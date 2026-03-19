import type { Context } from "hono";
import { paginationMeta, paginationParams } from "../lib/pagination";
import { created, deleted, ok, paginated } from "../lib/response";
import { localServiceService } from "../services/localServiceService";

const VALID_SERVICE_TYPES = [
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
const VALID_SORT = ["createdAt", "monthlyCharge", "updatedAt"] as const;

export async function listServicesHandler(c: Context) {
  const query = c.req.query();
  const { page, limit, offset } = paginationParams(query);
  const filters = {
    city: query.city,
    q: query.q,
    locality: query.locality,
    serviceType: VALID_SERVICE_TYPES.includes(
      query.serviceType as (typeof VALID_SERVICE_TYPES)[number],
    )
      ? (query.serviceType as (typeof VALID_SERVICE_TYPES)[number])
      : undefined,
    sortBy: VALID_SORT.includes(query.sortBy as (typeof VALID_SORT)[number])
      ? (query.sortBy as (typeof VALID_SORT)[number])
      : undefined,
    sortOrder: query.sortOrder === "asc" ? ("asc" as const) : ("desc" as const),
  };
  const { data, total } = await localServiceService.list(filters, limit, offset);
  return c.json(paginated(data, paginationMeta(page, limit, total)));
}

export async function getServiceHandler(c: Context) {
  const svc = await localServiceService.getById(c.req.param("id") as string);
  return c.json(ok(svc));
}

export async function createServiceHandler(c: Context) {
  const userId = c.get("userId");
  const body = c.req.valid("json" as never);
  const svc = await localServiceService.create(userId, body);
  return c.json(created(svc), 201);
}

export async function updateServiceHandler(c: Context) {
  const userId = c.get("userId");
  const svc = await localServiceService.update(
    userId,
    c.req.param("id") as string,
    c.req.valid("json" as never),
  );
  return c.json(ok(svc, "Service updated"));
}

export async function deleteServiceHandler(c: Context) {
  const userId = c.get("userId");
  await localServiceService.delete(userId, c.req.param("id") as string);
  return c.json(deleted("Service deleted"));
}
