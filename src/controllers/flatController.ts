import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { created, deleted, ok, paginated } from "../lib/response";
import { flatService } from "../services/flatService";

const VALID_FLAT_TYPES = ["1bhk", "2bhk", "3bhk", "4bhk", "studio", "shared", "penthouse"] as const;
const VALID_FURNISHINGS = ["furnished", "semi-furnished", "unfurnished"] as const;
const VALID_SORT = ["createdAt", "rent", "updatedAt"] as const;

export async function listFlatsHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const filters = {
    city: query.city,
    q: query.q,
    minRent: Number.isFinite(Number(query.minRent)) ? Number(query.minRent) : undefined,
    maxRent: Number.isFinite(Number(query.maxRent)) ? Number(query.maxRent) : undefined,
    flatType: VALID_FLAT_TYPES.includes(query.flatType as (typeof VALID_FLAT_TYPES)[number])
      ? (query.flatType as (typeof VALID_FLAT_TYPES)[number])
      : undefined,
    furnishing: VALID_FURNISHINGS.includes(query.furnishing as (typeof VALID_FURNISHINGS)[number])
      ? (query.furnishing as (typeof VALID_FURNISHINGS)[number])
      : undefined,
    gender: query.gender,
    sortBy: VALID_SORT.includes(query.sortBy as (typeof VALID_SORT)[number])
      ? (query.sortBy as (typeof VALID_SORT)[number])
      : undefined,
    sortOrder: query.sortOrder === "asc" ? ("asc" as const) : ("desc" as const),
  };
  const { data, total } = await flatService.list(filters, limit, offset);
  return c.json(paginated(data, paginationMeta(page, limit, total)));
}

export async function getFlatHandler(c: Context) {
  const flat = await flatService.getById(c.req.param("id") as string);
  return c.json(ok(flat));
}

export async function createFlatHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const flat = await flatService.create(userId, body);
  return c.json(created(flat), 201);
}

export async function updateFlatHandler(c: Context) {
  const userId = c.get("userId");
  const flat = await flatService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json(ok(flat, "Flat listing updated"));
}

export async function deleteFlatHandler(c: Context) {
  const userId = c.get("userId");
  await flatService.delete(userId, c.req.param("id") as string);
  return c.json(deleted("Flat listing deleted"));
}
