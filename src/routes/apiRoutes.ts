import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  getMeHandler,
  getSessionsHandler,
  revokeSessionHandler,
  updateMeHandler,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { equipmentRoutes } from "./equipmentRoutes";
import { eventRoutes } from "./eventRoutes";
import { flatmateRoutes } from "./flatmateRoutes";
import { flatRoutes } from "./flatRoutes";
import { searchRoutes } from "./searchRoutes";
import { serviceRoutes } from "./serviceRoutes";

export const apiRoutes = new Hono();

apiRoutes.use("*", authMiddleware);

const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  city: z.string().max(255).optional(),
  photo: z.string().url().max(500).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

// User profile
apiRoutes.get("/me", getMeHandler);
apiRoutes.patch("/me", zValidator("json", updateProfileSchema), updateMeHandler);

// Session management
apiRoutes.get("/me/sessions", getSessionsHandler);
apiRoutes.delete("/me/sessions/:id", revokeSessionHandler);

// Product modules
apiRoutes.route("/flats", flatRoutes);
apiRoutes.route("/flatmates", flatmateRoutes);
apiRoutes.route("/services", serviceRoutes);
apiRoutes.route("/equipment", equipmentRoutes);
apiRoutes.route("/events", eventRoutes);
apiRoutes.route("/search", searchRoutes);
