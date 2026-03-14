import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  createEventHandler,
  deleteEventHandler,
  getEventHandler,
  listEventsHandler,
  updateEventHandler,
} from "../controllers/eventController";

export const eventRoutes = new Hono();

const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  city: z.string().min(1).max(255),
  locality: z.string().max(255).optional(),
  venue: z.string().max(500).optional(),
  category: z.enum([
    "sports",
    "music",
    "meetup",
    "workshop",
    "party",
    "cultural",
    "tech",
    "networking",
    "community",
    "other",
  ]),
  eventDate: z.coerce.date(),
  entryFee: z.number().int().nonnegative().optional(),
  maxAttendees: z.number().int().positive().optional(),
  organizer: z.string().max(255).optional(),
  eventLink: z.string().url().max(500).optional(),
});

const updateEventSchema = createEventSchema.partial();

eventRoutes.get("/", listEventsHandler);
eventRoutes.get("/:id", getEventHandler);
eventRoutes.post("/", zValidator("json", createEventSchema), createEventHandler);
eventRoutes.patch("/:id", zValidator("json", updateEventSchema), updateEventHandler);
eventRoutes.delete("/:id", deleteEventHandler);
