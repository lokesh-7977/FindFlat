import { and, count, eq, gte, ilike, lte, or } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import { db } from "../db";
import {
  type FlatmateProfile,
  flatmateProfilesTable,
  type NewFlatmateProfile,
} from "../db/flatmates";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

interface FlatmateFilters {
  city?: string;
  gender?: string;
  minBudget?: number;
  maxBudget?: number;
}

export const flatmateRepository = {
  async findAll(filters: FlatmateFilters, limit: number, offset: number) {
    const conditions = [];
    if (filters.city) conditions.push(ilike(flatmateProfilesTable.city, filters.city));
    if (filters.gender) conditions.push(ilike(flatmateProfilesTable.gender, filters.gender));
    if (filters.minBudget !== undefined)
      conditions.push(gte(flatmateProfilesTable.budget, filters.minBudget));
    if (filters.maxBudget !== undefined)
      conditions.push(lte(flatmateProfilesTable.budget, filters.maxBudget));

    const where = conditions.length ? and(...conditions) : undefined;

    const [data, total] = await Promise.all([
      db
        .select()
        .from(flatmateProfilesTable)
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(flatmateProfilesTable.createdAt),
      db.select({ count: count() }).from(flatmateProfilesTable).where(where),
    ]);

    return { data, total: total[0].count };
  },

  async findById(id: string): Promise<FlatmateProfile | undefined> {
    const result = await db
      .select()
      .from(flatmateProfilesTable)
      .where(eq(flatmateProfilesTable.id, id))
      .limit(1);
    return result[0];
  },

  async findByUserId(userId: string): Promise<FlatmateProfile | undefined> {
    const result = await db
      .select()
      .from(flatmateProfilesTable)
      .where(eq(flatmateProfilesTable.postedBy, userId))
      .limit(1);
    return result[0];
  },

  async create(data: Omit<NewFlatmateProfile, "id">): Promise<FlatmateProfile> {
    const result = await db
      .insert(flatmateProfilesTable)
      .values({ ...data, id: uuidv7() })
      .returning();
    return result[0];
  },

  async updateByUserId(
    userId: string,
    data: Partial<NewFlatmateProfile>,
  ): Promise<FlatmateProfile | undefined> {
    const result = await db
      .update(flatmateProfilesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(flatmateProfilesTable.postedBy, userId))
      .returning();
    return result[0];
  },

  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await db
      .delete(flatmateProfilesTable)
      .where(eq(flatmateProfilesTable.postedBy, userId))
      .returning();
    return result.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0) {
    const conditions = [
      or(
        ilike(flatmateProfilesTable.description, `%${escapeLike(query)}%`),
        ilike(flatmateProfilesTable.city, `%${escapeLike(query)}%`),
        ilike(flatmateProfilesTable.occupation, `%${escapeLike(query)}%`),
      ),
    ];
    if (city) conditions.push(ilike(flatmateProfilesTable.city, city));
    const where = and(...conditions);
    return db
      .select()
      .from(flatmateProfilesTable)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(flatmateProfilesTable.createdAt);
  },
};
