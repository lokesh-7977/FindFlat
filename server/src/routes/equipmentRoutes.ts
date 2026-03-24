import { Hono } from "hono";
import { z } from "zod";
import {
  createEquipmentHandler,
  deleteEquipmentHandler,
  getEquipmentHandler,
  listEquipmentHandler,
  updateEquipmentHandler,
} from "../controllers/equipmentController";
import { zValidator } from "../lib/response";

export const equipmentRoutes = new Hono();

const createEquipmentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  city: z.string().min(1).max(255),
  locality: z.string().max(255).optional(),
  price: z.number().int().nonnegative(),
  category: z.enum([
    "furniture",
    "electronics",
    "appliances",
    "kitchen",
    "fitness",
    "books",
    "other",
  ]),
  condition: z.enum(["new", "like-new", "good", "fair", "poor"]),
  photos: z.string().optional(),
  sellerContact: z.string().max(20).optional(),
});

const updateEquipmentSchema = createEquipmentSchema.partial();

equipmentRoutes.get("/", listEquipmentHandler);
equipmentRoutes.get("/:id", getEquipmentHandler);
equipmentRoutes.post("/", zValidator("json", createEquipmentSchema), createEquipmentHandler);
equipmentRoutes.patch("/:id", zValidator("json", updateEquipmentSchema), updateEquipmentHandler);
equipmentRoutes.delete("/:id", deleteEquipmentHandler);
