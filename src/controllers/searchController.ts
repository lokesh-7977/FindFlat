import type { Context } from "hono";
import { paginationParams } from "../lib/pagination";
import { searchService } from "../services/searchService";

export async function searchHandler(c: Context) {
  const query = c.req.query();
  const q = query.q || "";
  if (!q) return c.json({ data: {} });

  const { limit, offset } = paginationParams(query);
  const results = await searchService.search(q, query.city, query.type, limit, offset);
  return c.json({ data: results });
}
