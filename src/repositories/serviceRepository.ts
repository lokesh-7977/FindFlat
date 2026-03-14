import { and, count, eq, ilike } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import { db } from "../db";
import { type LocalService, localServicesTable, type NewLocalService } from "../db/services";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

type ServiceType = LocalService["serviceType"];

interface ServiceFilters {
  city?: string;
  locality?: string;
  serviceType?: ServiceType;
}

export const serviceRepository = {
  async findAll(filters: ServiceFilters, limit: number, offset: number) {
    const conditions = [];
    if (filters.city) conditions.push(ilike(localServicesTable.city, filters.city));
    if (filters.locality) conditions.push(ilike(localServicesTable.locality, filters.locality));
    if (filters.serviceType)
      conditions.push(eq(localServicesTable.serviceType, filters.serviceType));

    const where = conditions.length ? and(...conditions) : undefined;

    const [data, total] = await Promise.all([
      db
        .select()
        .from(localServicesTable)
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(localServicesTable.createdAt),
      db.select({ count: count() }).from(localServicesTable).where(where),
    ]);

    return { data, total: total[0].count };
  },

  async findById(id: string): Promise<LocalService | undefined> {
    const result = await db
      .select()
      .from(localServicesTable)
      .where(eq(localServicesTable.id, id))
      .limit(1);
    return result[0];
  },

  async create(data: Omit<NewLocalService, "id">): Promise<LocalService> {
    const result = await db
      .insert(localServicesTable)
      .values({ ...data, id: uuidv7() })
      .returning();
    return result[0];
  },

  async updateById(id: string, data: Partial<NewLocalService>): Promise<LocalService | undefined> {
    const result = await db
      .update(localServicesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(localServicesTable.id, id))
      .returning();
    return result[0];
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db
      .delete(localServicesTable)
      .where(eq(localServicesTable.id, id))
      .returning();
    return result.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0) {
    const conditions = [ilike(localServicesTable.title, `%${escapeLike(query)}%`)];
    if (city) conditions.push(ilike(localServicesTable.city, city));
    const where = and(...conditions);
    return db
      .select()
      .from(localServicesTable)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(localServicesTable.createdAt);
  },
};
