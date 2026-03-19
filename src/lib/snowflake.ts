/**
 * Snowflake ID generator
 *
 * Layout (64-bit):
 *   [41 bits] milliseconds since custom epoch
 *   [10 bits] machine ID (1–1023)
 *   [12 bits] per-ms sequence (0–4095)
 *
 * IDs are returned as decimal strings to avoid JS Number precision loss.
 * They are lexicographically sortable when zero-padded, but since we
 * store them in a TEXT column and sort by createdAt/id explicitly,
 * that's fine.
 *
 * Benefits over UUIDv7:
 *   - Smaller (≤20 digits vs 36 chars)
 *   - Monotonic within the same ms (sequence prevents collisions)
 *   - Encodes timestamp → can extract creation time without extra column
 */

const EPOCH = 1704067200000n; // 2024-01-01T00:00:00.000Z
const MACHINE_ID = BigInt(process.env.MACHINE_ID ?? "1") & 0x3ffn; // 10 bits

let lastTimestamp = -1n;
let sequence = 0n;

export function snowflakeId(): string {
  let now = BigInt(Date.now()) - EPOCH;

  if (now === lastTimestamp) {
    sequence = (sequence + 1n) & 0xfffn; // 12 bits
    if (sequence === 0n) {
      // Sequence exhausted — spin-wait for next millisecond
      while (BigInt(Date.now()) - EPOCH <= lastTimestamp) {}
      now = BigInt(Date.now()) - EPOCH;
    }
  } else {
    sequence = 0n;
  }

  lastTimestamp = now;

  const id = (now << 22n) | (MACHINE_ID << 12n) | sequence;
  return id.toString();
}

/** Extract the UTC timestamp embedded in a snowflake ID */
export function snowflakeTimestamp(id: string): Date {
  const ms = (BigInt(id) >> 22n) + EPOCH;
  return new Date(Number(ms));
}
