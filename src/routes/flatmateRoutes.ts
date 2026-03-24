import { Hono } from "hono";
import { z } from "zod";
import {
  createFlatmateHandler,
  deleteFlatmateHandler,
  getFlatmateHandler,
  listFlatmatesHandler,
  updateFlatmateHandler,
} from "../controllers/flatmateController";
import { zValidator } from "../lib/response";

export const flatmateRoutes = new Hono();

const createFlatmateSchema = z.object({
  city: z.string().min(1).max(255),
  locality: z.string().max(255).optional(),
  budget: z.number().int().positive(),
  description: z.string().optional(),
  gender: z.string().max(50).optional(),
  age: z.number().int().min(18).max(100).optional(),
  occupation: z.string().max(255).optional(),
  smoking: z.enum(["yes", "no", "occasionally"]).optional(),
  foodPref: z.enum(["veg", "non-veg", "vegan", "no-preference"]).optional(),
  contactPhone: z.string().max(20).optional(),
  moveInDate: z.coerce.date().optional(),
});

const updateFlatmateSchema = createFlatmateSchema.partial();

flatmateRoutes.get("/", listFlatmatesHandler);
flatmateRoutes.get("/:id", getFlatmateHandler);
flatmateRoutes.post("/", zValidator("json", createFlatmateSchema), createFlatmateHandler);
flatmateRoutes.patch("/", zValidator("json", updateFlatmateSchema), updateFlatmateHandler);
flatmateRoutes.delete("/", deleteFlatmateHandler);
