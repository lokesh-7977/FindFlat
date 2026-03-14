import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { localServiceService } from "../services/localServiceService";

export async function listServicesHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const validServiceTypes = [
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
  ] as const;
  const filters = {
    city: query.city,
    locality: query.locality,
    serviceType: validServiceTypes.includes(query.serviceType as (typeof validServiceTypes)[number])
      ? (query.serviceType as (typeof validServiceTypes)[number])
      : undefined,
  };
  const { data, total } = await localServiceService.list(filters, limit, offset);
  return c.json({ data, pagination: paginationMeta(page, limit, total) });
}

export async function getServiceHandler(c: Context) {
  const svc = await localServiceService.getById(c.req.param("id") as string);
  return c.json({ data: svc });
}

export async function createServiceHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const svc = await localServiceService.create(userId, body);
  return c.json({ data: svc }, 201);
}

export async function updateServiceHandler(c: Context) {
  const userId = c.get("userId");
  const svc = await localServiceService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json({ data: svc });
}

export async function deleteServiceHandler(c: Context) {
  const userId = c.get("userId");
  await localServiceService.delete(userId, c.req.param("id") as string);
  return c.json({ message: "Service deleted" });
}
