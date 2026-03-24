import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { created, deleted, ok, paginated } from "../lib/response";
import { flatmateService } from "../services/flatmateService";

const VALID_SORT = ["createdAt", "budget", "updatedAt"] as const;

export async function listFlatmatesHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const filters = {
    city: query.city,
    q: query.q,
    gender: query.gender,
    minBudget: Number.isFinite(Number(query.minBudget)) ? Number(query.minBudget) : undefined,
    maxBudget: Number.isFinite(Number(query.maxBudget)) ? Number(query.maxBudget) : undefined,
    sortBy: VALID_SORT.includes(query.sortBy as (typeof VALID_SORT)[number])
      ? (query.sortBy as (typeof VALID_SORT)[number])
      : undefined,
    sortOrder: query.sortOrder === "asc" ? ("asc" as const) : ("desc" as const),
  };
  const { data, total } = await flatmateService.list(filters, limit, offset);
  return c.json(paginated(data, paginationMeta(page, limit, total)));
}

export async function getFlatmateHandler(c: Context) {
  const profile = await flatmateService.getById(c.req.param("id") as string);
  return c.json(ok(profile));
}

export async function createFlatmateHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const profile = await flatmateService.create(userId, body);
  return c.json(created(profile), 201);
}

export async function updateFlatmateHandler(c: Context) {
  const userId = c.get("userId");
  const profile = await flatmateService.update(userId, c.req.valid("json" as never));
  return c.json(ok(profile, "Flatmate profile updated"));
}

export async function deleteFlatmateHandler(c: Context) {
  const userId = c.get("userId");
  await flatmateService.delete(userId);
  return c.json(deleted("Flatmate profile deleted"));
}
