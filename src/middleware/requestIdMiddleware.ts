import type { Context, Next } from "hono";
import { snowflakeId } from "../lib/snowflake";

export async function requestIdMiddleware(c: Context, next: Next) {
  const id = c.req.header("x-request-id") ?? snowflakeId();
  c.set("requestId", id);
  c.header("X-Request-ID", id);
  await next();
}
