import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { eventService } from "../services/eventService";

export async function listEventsHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const validCategories = [
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
  ] as const;
  const filters = {
    city: query.city,
    category: validCategories.includes(query.category as (typeof validCategories)[number])
      ? (query.category as (typeof validCategories)[number])
      : undefined,
  };
  const { data, total } = await eventService.list(filters, limit, offset);
  return c.json({ data, pagination: paginationMeta(page, limit, total) });
}

export async function getEventHandler(c: Context) {
  const event = await eventService.getById(c.req.param("id") as string);
  return c.json({ data: event });
}

export async function createEventHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const event = await eventService.create(userId, body);
  return c.json({ data: event }, 201);
}

export async function updateEventHandler(c: Context) {
  const userId = c.get("userId");
  const event = await eventService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json({ data: event });
}

export async function deleteEventHandler(c: Context) {
  const userId = c.get("userId");
  await eventService.delete(userId, c.req.param("id") as string);
  return c.json({ message: "Event deleted" });
}
