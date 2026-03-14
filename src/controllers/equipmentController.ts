import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { equipmentService } from "../services/equipmentService";

export async function listEquipmentHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const validCategories = [
    "furniture",
    "electronics",
    "appliances",
    "kitchen",
    "fitness",
    "books",
    "other",
  ] as const;
  const validConditions = ["new", "like-new", "good", "fair", "poor"] as const;
  const filters = {
    city: query.city,
    category: validCategories.includes(query.category as (typeof validCategories)[number])
      ? (query.category as (typeof validCategories)[number])
      : undefined,
    condition: validConditions.includes(query.condition as (typeof validConditions)[number])
      ? (query.condition as (typeof validConditions)[number])
      : undefined,
    minPrice: Number.isFinite(Number(query.minPrice)) ? Number(query.minPrice) : undefined,
    maxPrice: Number.isFinite(Number(query.maxPrice)) ? Number(query.maxPrice) : undefined,
  };
  const { data, total } = await equipmentService.list(filters, limit, offset);
  return c.json({ data, pagination: paginationMeta(page, limit, total) });
}

export async function getEquipmentHandler(c: Context) {
  const item = await equipmentService.getById(c.req.param("id") as string);
  return c.json({ data: item });
}

export async function createEquipmentHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const item = await equipmentService.create(userId, body);
  return c.json({ data: item }, 201);
}

export async function updateEquipmentHandler(c: Context) {
  const userId = c.get("userId");
  const item = await equipmentService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json({ data: item });
}

export async function deleteEquipmentHandler(c: Context) {
  const userId = c.get("userId");
  await equipmentService.delete(userId, c.req.param("id") as string);
  return c.json({ message: "Equipment listing deleted" });
}
