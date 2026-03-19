import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "../db";
import { type LocalService, localServicesTable, type NewLocalService } from "../db/services";
import { snowflakeId } from "../lib/snowflake";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

type ServiceType = LocalService["serviceType"];
type ServiceSortBy = "createdAt" | "monthlyCharge" | "updatedAt";

const SORT_FIELDS: Record<
  ServiceSortBy,
  | typeof localServicesTable.createdAt
  | typeof localServicesTable.monthlyCharge
  | typeof localServicesTable.updatedAt
> = {
  createdAt: localServicesTable.createdAt,
  monthlyCharge: localServicesTable.monthlyCharge,
  updatedAt: localServicesTable.updatedAt,
};

interface ServiceFilters {
  city?: string;
  locality?: string;
  serviceType?: ServiceType;
  q?: string;
  sortBy?: ServiceSortBy;
  sortOrder?: "asc" | "desc";
}

export const serviceRepository = {
  async findAll(filters: ServiceFilters, limit: number, offset: number) {
    const conditions = [];
    if (filters.q) {
      const q = `%${escapeLike(filters.q)}%`;
      conditions.push(
        or(
          ilike(localServicesTable.title, q),
          ilike(localServicesTable.description, q),
          ilike(localServicesTable.contactName, q),
        ),
      );
    }
    if (filters.city) conditions.push(ilike(localServicesTable.city, filters.city));
    if (filters.locality) conditions.push(ilike(localServicesTable.locality, filters.locality));
    if (filters.serviceType)
      conditions.push(eq(localServicesTable.serviceType, filters.serviceType));

    const where = conditions.length ? and(...conditions) : undefined;
    const sortCol = SORT_FIELDS[filters.sortBy ?? "createdAt"];
    const order = filters.sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

    const [data, total] = await Promise.all([
      db.select().from(localServicesTable).where(where).orderBy(order).limit(limit).offset(offset),
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
      .values({ ...data, id: snowflakeId() })
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
    const q = `%${escapeLike(query)}%`;
    const conditions = [
      or(ilike(localServicesTable.title, q), ilike(localServicesTable.description, q)) as SQL,
    ];
    if (city) conditions.push(ilike(localServicesTable.city, city));
    return db
      .select()
      .from(localServicesTable)
      .where(and(...conditions))
      .orderBy(desc(localServicesTable.createdAt))
      .limit(limit)
      .offset(offset);
  },
};
