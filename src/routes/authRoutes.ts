import { Hono } from "hono";
import { z } from "zod";
import {
  googleCallbackHandler,
  googleInitHandler,
  logoutHandler,
  refreshTokenHandler,
} from "../controllers/authController";
import { zValidator } from "../lib/response";
import { rateLimit } from "../middleware/rateLimitMiddleware";

export const authRoutes = new Hono();

// Validate the refresh token cookie is present before hitting the handler
const refreshCookieSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken cookie is required"),
});

// Rate limits — keyed by IP
const authInitLimit = rateLimit({ limit: 20, windowMs: 15 * 60 * 1000 });
const refreshLimit = rateLimit({ limit: 30, windowMs: 15 * 60 * 1000 });
const logoutLimit = rateLimit({ limit: 20, windowMs: 15 * 60 * 1000 });

authRoutes.get("/google", authInitLimit, googleInitHandler);
authRoutes.get("/google/callback", authInitLimit, googleCallbackHandler);

authRoutes.post(
  "/refresh",
  refreshLimit,
  zValidator("cookie", refreshCookieSchema),
  refreshTokenHandler,
);

authRoutes.post("/logout", logoutLimit, logoutHandler);
