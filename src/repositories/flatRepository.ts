import { and, count, eq, gte, ilike, lte } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import { db } from "../db";
import { type FlatListing, flatListingsTable, type NewFlatListing } from "../db/flats";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

type FlatType = FlatListing["flatType"];
type Furnishing = FlatListing["furnishing"];

interface FlatFilters {
  city?: string;
  minRent?: number;
  maxRent?: number;
  flatType?: FlatType;
  furnishing?: Furnishing;
  gender?: string;
}

export const flatRepository = {
  async findAll(filters: FlatFilters, limit: number, offset: number) {
    const conditions = [];
    if (filters.city) conditions.push(ilike(flatListingsTable.city, filters.city));
    if (filters.minRent !== undefined)
      conditions.push(gte(flatListingsTable.rent, filters.minRent));
    if (filters.maxRent !== undefined)
      conditions.push(lte(flatListingsTable.rent, filters.maxRent));
    if (filters.flatType) conditions.push(eq(flatListingsTable.flatType, filters.flatType));
    if (filters.furnishing) conditions.push(eq(flatListingsTable.furnishing, filters.furnishing));
    if (filters.gender) conditions.push(ilike(flatListingsTable.preferredGender, filters.gender));

    const where = conditions.length ? and(...conditions) : undefined;

    const [data, total] = await Promise.all([
      db
        .select()
        .from(flatListingsTable)
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(flatListingsTable.createdAt),
      db.select({ count: count() }).from(flatListingsTable).where(where),
    ]);

    return { data, total: total[0].count };
  },

  async findById(id: string): Promise<FlatListing | undefined> {
    const result = await db
      .select()
      .from(flatListingsTable)
      .where(eq(flatListingsTable.id, id))
      .limit(1);
    return result[0];
  },

  async create(data: Omit<NewFlatListing, "id">): Promise<FlatListing> {
    const result = await db
      .insert(flatListingsTable)
      .values({ ...data, id: uuidv7() })
      .returning();
    return result[0];
  },

  async updateById(id: string, data: Partial<NewFlatListing>): Promise<FlatListing | undefined> {
    const result = await db
      .update(flatListingsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(flatListingsTable.id, id))
      .returning();
    return result[0];
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db
      .delete(flatListingsTable)
      .where(eq(flatListingsTable.id, id))
      .returning();
    return result.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0) {
    const conditions = [ilike(flatListingsTable.title, `%${escapeLike(query)}%`)];
    if (city) conditions.push(ilike(flatListingsTable.city, city));
    const where = and(...conditions);
    const data = await db
      .select()
      .from(flatListingsTable)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(flatListingsTable.createdAt);
    return data;
  },
};
