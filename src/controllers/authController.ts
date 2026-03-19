import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { config, IS_PROD } from "../config/env";
import { SessionExpiredError, TokenReuseError, UnauthorizedError } from "../lib/errors";
import { createAuthUrl, exchangeCodeForUser, verifyState } from "../lib/googleOAuth";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { logger } from "../lib/logger";
import { snowflakeId } from "../lib/snowflake";
import { sessionRepository } from "../repositories/sessionRepository";
import { userService } from "../services/userService";

const COOKIE_BASE = {
  path: "/",
  httpOnly: true,
  sameSite: "Lax",
  secure: IS_PROD,
} as const;

export async function googleInitHandler(c: Context) {
  const { url } = createAuthUrl(config.GOOGLE_CLIENT_ID, config.GOOGLE_REDIRECT_URI, [
    "openid",
    "email",
    "profile",
  ]);
  return c.redirect(url);
}

export async function googleCallbackHandler(c: Context) {
  const code = c.req.query("code");
  const state = c.req.query("state");

  if (!code || !state) {
    throw new UnauthorizedError("Missing code or state");
  }

  if (!verifyState(state)) {
    throw new HTTPException(401, { message: "Invalid or expired state" });
  }

  let googleProfile: Awaited<ReturnType<typeof exchangeCodeForUser>>;
  try {
    googleProfile = await exchangeCodeForUser(
      code,
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URI,
    );
  } catch (err) {
    logger.warn("Google token exchange failed", { error: (err as Error).message });
    throw new UnauthorizedError("Google login failed");
  }

  // Reject unverified Google accounts
  if (googleProfile.verified_email === false) {
    throw new UnauthorizedError("Google account email is not verified");
  }

  const sessionId = snowflakeId();
  const userAgent = c.req.header("user-agent");
  // Take only the first IP in a forwarded chain to prevent header spoofing
  const rawForwarded = c.req.header("x-forwarded-for");
  const ipAddress = rawForwarded?.split(",")[0]?.trim() ?? c.req.header("x-real-ip");

  const user = await userService.getOrCreateFromGoogleProfile(googleProfile);

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(user.id),
    signRefreshToken(user.id, sessionId),
  ]);

  await sessionRepository.createSession(user.id, refreshToken, {
    sessionId,
    userAgent,
    ipAddress,
  });

  sessionRepository
    .deleteExpiredSessions()
    .catch((err) =>
      logger.warn("Failed to purge expired sessions", { error: (err as Error).message }),
    );

  logger.info("User logged in", { userId: user.id, sessionId });

  setCookie(c, "accessToken", accessToken, { ...COOKIE_BASE, maxAge: 15 * 60 });
  setCookie(c, "refreshToken", refreshToken, { ...COOKIE_BASE, maxAge: 30 * 24 * 60 * 60 });

  return c.redirect("/");
}

export async function refreshTokenHandler(c: Context) {
  const refreshToken = getCookie(c, "refreshToken");

  // zValidator("cookie") on the route guarantees this is present, but we guard
  // here too so the type is narrowed without a non-null assertion.
  if (!refreshToken) {
    throw new UnauthorizedError("No refresh token");
  }

  let userId: string;
  let sessionId: string;

  try {
    ({ userId, sessionId } = await verifyRefreshToken(refreshToken));
  } catch {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const [newAccessToken, newRefreshToken] = await Promise.all([
    signAccessToken(userId),
    signRefreshToken(userId, sessionId),
  ]);

  const session = await sessionRepository.rotateRefreshToken(
    sessionId,
    refreshToken,
    newRefreshToken,
  );

  if (!session) {
    logger.warn("Token reuse detected — revoking all user sessions", { userId, sessionId });
    sessionRepository.deleteUserSessions(userId).catch(() => {});
    throw new TokenReuseError();
  }

  if (new Date() > new Date(session.expiresAt)) {
    sessionRepository.deleteSession(sessionId).catch(() => {});
    deleteCookie(c, "refreshToken", { path: "/" });
    throw new SessionExpiredError();
  }

  setCookie(c, "accessToken", newAccessToken, { ...COOKIE_BASE, maxAge: 15 * 60 });
  setCookie(c, "refreshToken", newRefreshToken, { ...COOKIE_BASE, maxAge: 30 * 24 * 60 * 60 });

  return c.json({ ok: true });
}

export async function logoutHandler(c: Context) {
  const refreshToken = getCookie(c, "refreshToken");

  if (!refreshToken) {
    return c.json({ message: "Already logged out" });
  }

  try {
    const { sessionId, userId } = await verifyRefreshToken(refreshToken);
    logger.info("User logged out", { userId, sessionId });
    sessionRepository.deleteSession(sessionId).catch(() => {});
  } catch {
    // Invalid token — still clear cookies below
  }

  deleteCookie(c, "accessToken", { path: "/" });
  deleteCookie(c, "refreshToken", { path: "/" });

  return c.json({ message: "Logged out successfully" });
}
