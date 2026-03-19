/**
 * Snowflake ID generator
 *
 * Layout (64-bit):
 *   [41 bits] milliseconds since custom epoch
 *   [10 bits] machine ID (1–1023)
 *   [12 bits] per-ms sequence (0–4095)
 *
 * IDs are returned as decimal strings to avoid JS Number precision loss.
 *
 * Benefits over UUIDv7:
 *   - Smaller (≤20 digits vs 36 chars)
 *   - Monotonic within the same ms (sequence prevents collisions)
 *   - Encodes timestamp → creation time extractable without extra column
 */

const EPOCH = 1704067200000n; // 2024-01-01T00:00:00.000Z
const MACHINE_ID = BigInt(process.env.MACHINE_ID ?? "1") & 0x3ffn; // 10 bits

let lastTimestamp = -1n;
let sequence = 0n;

/** Generate a unique Snowflake ID as a decimal string. */
export function snowflakeId(): string {
  let now = BigInt(Date.now()) - EPOCH;

  if (now === lastTimestamp) {
    sequence = (sequence + 1n) & 0xfffn; // 12-bit cap
    if (sequence === 0n) {
      // Sequence exhausted — advance to the next millisecond without blocking.
      // In practice this is extremely rare (>4096 IDs in a single ms).
      now = lastTimestamp + 1n;
    }
  } else {
    sequence = 0n;
  }

  lastTimestamp = now;

  const id = (now << 22n) | (MACHINE_ID << 12n) | sequence;
  return id.toString();
}

/** Extract the UTC timestamp embedded in a Snowflake ID. */
export function snowflakeTimestamp(id: string): Date {
  const ms = (BigInt(id) >> 22n) + EPOCH;
  return new Date(Number(ms));
}
