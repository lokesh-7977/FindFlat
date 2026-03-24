import { Hono } from "hono";
import { z } from "zod";
import {
  createServiceHandler,
  deleteServiceHandler,
  getServiceHandler,
  listServicesHandler,
  updateServiceHandler,
} from "../controllers/serviceController";
import { zValidator } from "../lib/response";

export const serviceRoutes = new Hono();

const createServiceSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  city: z.string().min(1).max(255),
  locality: z.string().max(255).optional(),
  serviceType: z.enum([
    "maid",
    "cook",
    "cleaner",
    "laundry",
    "babysitter",
    "electrician",
    "plumber",
    "carpenter",
    "painter",
    "pest-control",
    "movers",
    "other",
  ]),
  contactName: z.string().max(255).optional(),
  contactPhone: z.string().max(20).optional(),
  experience: z.string().max(100).optional(),
  availableTime: z.string().max(255).optional(),
  monthlyCharge: z.number().int().nonnegative().optional(),
  rating: z.string().optional(),
});

const updateServiceSchema = createServiceSchema.partial();

serviceRoutes.get("/", listServicesHandler);
serviceRoutes.get("/:id", getServiceHandler);
serviceRoutes.post("/", zValidator("json", createServiceSchema), createServiceHandler);
serviceRoutes.patch("/:id", zValidator("json", updateServiceSchema), updateServiceHandler);
serviceRoutes.delete("/:id", deleteServiceHandler);
