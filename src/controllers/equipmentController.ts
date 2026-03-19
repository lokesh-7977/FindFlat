import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { created, deleted, ok, paginated } from "../lib/response";
import { equipmentService } from "../services/equipmentService";

const VALID_CATEGORIES = [
  "furniture",
  "electronics",
  "appliances",
  "kitchen",
  "fitness",
  "books",
  "other",
] as const;
const VALID_CONDITIONS = ["new", "like-new", "good", "fair", "poor"] as const;
const VALID_SORT = ["createdAt", "price", "updatedAt"] as const;

export async function listEquipmentHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const filters = {
    city: query.city,
    q: query.q,
    category: VALID_CATEGORIES.includes(query.category as (typeof VALID_CATEGORIES)[number])
      ? (query.category as (typeof VALID_CATEGORIES)[number])
      : undefined,
    condition: VALID_CONDITIONS.includes(query.condition as (typeof VALID_CONDITIONS)[number])
      ? (query.condition as (typeof VALID_CONDITIONS)[number])
      : undefined,
    minPrice: Number.isFinite(Number(query.minPrice)) ? Number(query.minPrice) : undefined,
    maxPrice: Number.isFinite(Number(query.maxPrice)) ? Number(query.maxPrice) : undefined,
    sortBy: VALID_SORT.includes(query.sortBy as (typeof VALID_SORT)[number])
      ? (query.sortBy as (typeof VALID_SORT)[number])
      : undefined,
    sortOrder: query.sortOrder === "asc" ? ("asc" as const) : ("desc" as const),
  };
  const { data, total } = await equipmentService.list(filters, limit, offset);
  return c.json(paginated(data, paginationMeta(page, limit, total)));
}

export async function getEquipmentHandler(c: Context) {
  const item = await equipmentService.getById(c.req.param("id") as string);
  return c.json(ok(item));
}

export async function createEquipmentHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const item = await equipmentService.create(userId, body);
  return c.json(created(item), 201);
}

export async function updateEquipmentHandler(c: Context) {
  const userId = c.get("userId");
  const item = await equipmentService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json(ok(item, "Equipment listing updated"));
}

export async function deleteEquipmentHandler(c: Context) {
  const userId = c.get("userId");
  await equipmentService.delete(userId, c.req.param("id") as string);
  return c.json(deleted("Equipment listing deleted"));
}
