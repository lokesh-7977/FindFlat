import { zValidator as _zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono/types";
import type { ZodSchema } from "zod";

// ── Response shape helpers ────────────────────────────────────────────────────

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

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Drop-in replacement for @hono/zod-validator that returns a consistent
 * { status, message, errors } shape on validation failure.
 *
 * Generic parameters are preserved so c.req.valid() is correctly typed
 * in route handlers.
 */
export function zValidator<T extends ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) {
  return _zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          status: "error",
          message: "Validation failed",
          errors: result.error.issues,
        },
        400,
      );
    }
  });
}
