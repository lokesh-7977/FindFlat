import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { created, deleted, ok, paginated } from "../lib/response";
import { eventService } from "../services/eventService";

const VALID_CATEGORIES = [
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
const VALID_SORT = ["eventDate", "createdAt", "entryFee"] as const;

export async function listEventsHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const filters = {
    city: query.city,
    q: query.q,
    category: VALID_CATEGORIES.includes(query.category as (typeof VALID_CATEGORIES)[number])
      ? (query.category as (typeof VALID_CATEGORIES)[number])
      : undefined,
    sortBy: VALID_SORT.includes(query.sortBy as (typeof VALID_SORT)[number])
      ? (query.sortBy as (typeof VALID_SORT)[number])
      : undefined,
    sortOrder: query.sortOrder === "desc" ? ("desc" as const) : ("asc" as const),
  };
  const { data, total } = await eventService.list(filters, limit, offset);
  return c.json(paginated(data, paginationMeta(page, limit, total)));
}

export async function getEventHandler(c: Context) {
  const event = await eventService.getById(c.req.param("id") as string);
  return c.json(ok(event));
}

export async function createEventHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const event = await eventService.create(userId, body);
  return c.json(created(event), 201);
}

export async function updateEventHandler(c: Context) {
  const userId = c.get("userId");
  const event = await eventService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json(ok(event, "Event updated"));
}

export async function deleteEventHandler(c: Context) {
  const userId = c.get("userId");
  await eventService.delete(userId, c.req.param("id") as string);
  return c.json(deleted("Event deleted"));
}
