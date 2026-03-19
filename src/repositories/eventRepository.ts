import { and, asc, count, desc, eq, gte, ilike, or, type SQL } from "drizzle-orm";
import { db } from "../db";
import { type Event, eventsTable, type NewEvent } from "../db/events";
import { likePattern } from "../lib/db";
import { snowflakeId } from "../lib/snowflake";

type EventCategory = Event["category"];
type EventSortBy = "eventDate" | "createdAt" | "entryFee";

const SORT_FIELDS: Record<
  EventSortBy,
  typeof eventsTable.eventDate | typeof eventsTable.createdAt | typeof eventsTable.entryFee
> = {
  eventDate: eventsTable.eventDate,
  createdAt: eventsTable.createdAt,
  entryFee: eventsTable.entryFee,
};

interface EventFilters {
  city?: string;
  category?: EventCategory;
  q?: string;
  sortBy?: EventSortBy;
  sortOrder?: "asc" | "desc";
}

export const eventRepository = {
  async findAll(filters: EventFilters, limit: number, offset: number) {
    const conditions: SQL[] = [gte(eventsTable.eventDate, new Date())];

    if (filters.q) {
      const q = likePattern(filters.q);
      conditions.push(
        or(
          ilike(eventsTable.title, q),
          ilike(eventsTable.description, q),
          ilike(eventsTable.venue, q),
        ) as SQL,
      );
    }
    if (filters.city) conditions.push(ilike(eventsTable.city, filters.city));
    if (filters.category) conditions.push(eq(eventsTable.category, filters.category));

    const where = and(...conditions);
    const sortCol = SORT_FIELDS[filters.sortBy ?? "eventDate"];
    const order = filters.sortOrder === "desc" ? desc(sortCol) : asc(sortCol);

    const [data, [{ count: total }]] = await Promise.all([
      db.select().from(eventsTable).where(where).orderBy(order).limit(limit).offset(offset),
      db.select({ count: count() }).from(eventsTable).where(where),
    ]);

    return { data, total };
  },

  async findById(id: string): Promise<Event | undefined> {
    const [row] = await db.select().from(eventsTable).where(eq(eventsTable.id, id)).limit(1);
    return row;
  },

  async create(data: Omit<NewEvent, "id">): Promise<Event> {
    const [row] = await db
      .insert(eventsTable)
      .values({ ...data, id: snowflakeId() })
      .returning();
    return row;
  },

  async updateById(id: string, data: Partial<NewEvent>): Promise<Event | undefined> {
    const [row] = await db
      .update(eventsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(eventsTable.id, id))
      .returning();
    return row;
  },

  async deleteById(id: string): Promise<boolean> {
    const rows = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning({ id: eventsTable.id });
    return rows.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0): Promise<Event[]> {
    const q = likePattern(query);
    const conditions: SQL[] = [
      or(ilike(eventsTable.title, q), ilike(eventsTable.description, q)) as SQL,
      gte(eventsTable.eventDate, new Date()),
    ];
    if (city) conditions.push(ilike(eventsTable.city, city));

    return db
      .select()
      .from(eventsTable)
      .where(and(...conditions))
      .orderBy(asc(eventsTable.eventDate))
      .limit(limit)
      .offset(offset);
  },
};
