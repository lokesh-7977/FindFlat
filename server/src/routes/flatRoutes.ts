import { Hono } from "hono";
import { z } from "zod";
import {
  createFlatHandler,
  deleteFlatHandler,
  getFlatHandler,
  listFlatsHandler,
  updateFlatHandler,
} from "../controllers/flatController";
import { zValidator } from "../lib/response";

export const flatRoutes = new Hono();

const createFlatSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  city: z.string().min(1).max(255),
  locality: z.string().max(255).optional(),
  address: z.string().optional(),
  rent: z.number().int().positive(),
  deposit: z.number().int().nonnegative().optional(),
  flatType: z.enum(["1bhk", "2bhk", "3bhk", "4bhk", "studio", "shared", "penthouse"]),
  furnishing: z.enum(["furnished", "semi-furnished", "unfurnished"]),
  preferredGender: z.string().max(50).optional(),
  amenities: z.string().optional(),
  photos: z.string().optional(),
  contactPhone: z.string().max(20).optional(),
  availableFrom: z.coerce.date().optional(),
});

const updateFlatSchema = createFlatSchema.partial();

flatRoutes.get("/", listFlatsHandler);
flatRoutes.get("/:id", getFlatHandler);
flatRoutes.post("/", zValidator("json", createFlatSchema), createFlatHandler);
flatRoutes.patch("/:id", zValidator("json", updateFlatSchema), updateFlatHandler);
flatRoutes.delete("/:id", deleteFlatHandler);
