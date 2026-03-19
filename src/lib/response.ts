import { zValidator as _zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";

export function ok(data: unknown, message = "Success") {
  return { status: "success", message, data };
}

export function created(data: unknown, message = "Created successfully") {
  return { status: "success", message, data };
}

export function deleted(message = "Deleted successfully") {
  return { status: "success", message, data: null };
}

export function paginated(data: unknown, pagination: unknown, message = "Success") {
  return { status: "success", message, data, pagination };
}

// Wrapper around zValidator that returns consistent error format
export function zValidator(target: "json" | "query" | "param" | "cookie", schema: ZodSchema) {
  return _zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        { status: "error", message: "Validation failed", errors: result.error.issues },
        400,
      );
    }
  });
}
