import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { flatService } from "../services/flatService";

export async function listFlatsHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const validFlatTypes = ["1bhk", "2bhk", "3bhk", "4bhk", "studio", "shared", "penthouse"] as const;
  const validFurnishings = ["furnished", "semi-furnished", "unfurnished"] as const;
  const filters = {
    city: query.city,
    minRent: Number.isFinite(Number(query.minRent)) ? Number(query.minRent) : undefined,
    maxRent: Number.isFinite(Number(query.maxRent)) ? Number(query.maxRent) : undefined,
    flatType: validFlatTypes.includes(query.flatType as (typeof validFlatTypes)[number])
      ? (query.flatType as (typeof validFlatTypes)[number])
      : undefined,
    furnishing: validFurnishings.includes(query.furnishing as (typeof validFurnishings)[number])
      ? (query.furnishing as (typeof validFurnishings)[number])
      : undefined,
    gender: query.gender,
  };
  const { data, total } = await flatService.list(filters, limit, offset);
  return c.json({ data, pagination: paginationMeta(page, limit, total) });
}

export async function getFlatHandler(c: Context) {
  const flat = await flatService.getById(c.req.param("id") as string);
  return c.json({ data: flat });
}

export async function createFlatHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const flat = await flatService.create(userId, body);
  return c.json({ data: flat }, 201);
}

export async function updateFlatHandler(c: Context) {
  const userId = c.get("userId");
  const flat = await flatService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json({ data: flat });
}

export async function deleteFlatHandler(c: Context) {
  const userId = c.get("userId");
  await flatService.delete(userId, c.req.param("id") as string);
  return c.json({ message: "Flat listing deleted" });
}
