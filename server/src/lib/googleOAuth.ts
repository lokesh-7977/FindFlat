import { randomBytes } from "node:crypto";
import type { GoogleUser } from "../types/authTypes";

// In-memory state store — maps state → expiry timestamp
const stateStore = new Map<string, number>();
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/** Generate a cryptographically secure random state string. */
function generateState(): string {
  return randomBytes(24).toString("base64url");
}

export function createAuthUrl(
  clientId: string,
  redirectUri: string,
  scope: string[],
): { url: string; state: string } {
  const state = generateState();
  stateStore.set(state, Date.now() + STATE_TTL_MS);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope.join(" "),
    state,
    include_granted_scopes: "true",
    prompt: "consent",
  });

  return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, state };
}

export function verifyState(state: string): boolean {
  const expiry = stateStore.get(state);
  if (!expiry) return false;
  stateStore.delete(state);
  return Date.now() < expiry;
}

export async function exchangeCodeForUser(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<GoogleUser> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  }).then((r) => r.json() as Promise<Record<string, unknown>>);

  if ("error" in tokenRes) {
    throw new Error(String(tokenRes.error_description ?? tokenRes.error));
  }

  const accessToken = tokenRes.access_token as string;

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { authorization: `Bearer ${accessToken}` },
  }).then((r) => r.json() as Promise<Record<string, unknown>>);

  if ("error" in userRes) {
    const errMsg =
      (userRes.error as Record<string, unknown>)?.message ?? "Failed to fetch Google user";
    throw new Error(String(errMsg));
  }

  return userRes as unknown as GoogleUser;
}
