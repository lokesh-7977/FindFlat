import type { Context } from "hono";
import { NotFoundError, UnauthorizedError } from "../lib/errors";
import { deleted, ok } from "../lib/response";
import { userService } from "../services/userService";

// Matches the updateProfileSchema in apiRoutes.ts
type UpdateProfileBody = {
  name?: string;
  city?: string;
  photo?: string;
  gender?: "male" | "female" | "other";
};

export async function getMeHandler(c: Context) {
  const userId = c.get("userId");
  const user = await userService.getById(userId);
  if (!user) throw new NotFoundError("User not found");

  const { googleSub: _, ...safeUser } = user;
  return c.json(ok(safeUser));
}

export async function updateMeHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json") as UpdateProfileBody;

  const updated = await userService.updateProfile(userId, body);
  if (!updated) throw new NotFoundError("User not found");

  const { googleSub: _, ...safeUser } = updated;
  return c.json(ok(safeUser, "Profile updated"));
}

export async function getSessionsHandler(c: Context) {
  const userId = c.get("userId");
  const currentSessionId = c.get("sessionId");

  const sessions = await userService.getSessions(userId);

  const data = sessions.map((s) => ({
    id: s.id,
    userAgent: s.userAgent,
    ipAddress: s.ipAddress,
    createdAt: s.createdAt,
    lastUsedAt: s.lastUsedAt,
    expiresAt: s.expiresAt,
    isCurrent: s.id === currentSessionId,
  }));

  return c.json(ok(data, "Active sessions"));
}

export async function revokeSessionHandler(c: Context) {
  const userId = c.get("userId");
  const sessionId = c.req.param("id");

  if (!sessionId) throw new UnauthorizedError("Session ID required");

  const revoked = await userService.revokeSession(userId, sessionId);
  if (!revoked) throw new NotFoundError("Session not found");

  return c.json(deleted("Session revoked"));
}
