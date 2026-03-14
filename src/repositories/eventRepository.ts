import { and, count, eq, gte, ilike } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import { db } from "../db";
import { type Event, eventsTable, type NewEvent } from "../db/events";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

type EventCategory = Event["category"];

interface EventFilters {
  city?: string;
  category?: EventCategory;
}

export const eventRepository = {
  async findAll(filters: EventFilters, limit: number, offset: number) {
    const conditions = [gte(eventsTable.eventDate, new Date())];
    if (filters.city) conditions.push(ilike(eventsTable.city, filters.city));
    if (filters.category) conditions.push(eq(eventsTable.category, filters.category));

    const where = and(...conditions);

    const [data, total] = await Promise.all([
      db
        .select()
        .from(eventsTable)
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(eventsTable.eventDate),
      db.select({ count: count() }).from(eventsTable).where(where),
    ]);

    return { data, total: total[0].count };
  },

  async findById(id: string): Promise<Event | undefined> {
    const result = await db.select().from(eventsTable).where(eq(eventsTable.id, id)).limit(1);
    return result[0];
  },

  async create(data: Omit<NewEvent, "id">): Promise<Event> {
    const result = await db
      .insert(eventsTable)
      .values({ ...data, id: uuidv7() })
      .returning();
    return result[0];
  },

  async updateById(id: string, data: Partial<NewEvent>): Promise<Event | undefined> {
    const result = await db
      .update(eventsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(eventsTable.id, id))
      .returning();
    return result[0];
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(eventsTable).where(eq(eventsTable.id, id)).returning();
    return result.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0) {
    const conditions = [
      ilike(eventsTable.title, `%${escapeLike(query)}%`),
      gte(eventsTable.eventDate, new Date()),
    ];
    if (city) conditions.push(ilike(eventsTable.city, city));
    const where = and(...conditions);
    return db
      .select()
      .from(eventsTable)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(eventsTable.eventDate);
  },
};
