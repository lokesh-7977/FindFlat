import { and, asc, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { db } from "../db";
import {
  type FlatmateProfile,
  flatmateProfilesTable,
  type NewFlatmateProfile,
} from "../db/flatmates";
import { snowflakeId } from "../lib/snowflake";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

type FlatmateSortBy = "createdAt" | "budget" | "updatedAt";

const SORT_FIELDS: Record<
  FlatmateSortBy,
  | typeof flatmateProfilesTable.createdAt
  | typeof flatmateProfilesTable.budget
  | typeof flatmateProfilesTable.updatedAt
> = {
  createdAt: flatmateProfilesTable.createdAt,
  budget: flatmateProfilesTable.budget,
  updatedAt: flatmateProfilesTable.updatedAt,
};

interface FlatmateFilters {
  city?: string;
  gender?: string;
  minBudget?: number;
  maxBudget?: number;
  q?: string;
  sortBy?: FlatmateSortBy;
  sortOrder?: "asc" | "desc";
}

export const flatmateRepository = {
  async findAll(filters: FlatmateFilters, limit: number, offset: number) {
    const conditions = [];
    if (filters.q) {
      const q = `%${escapeLike(filters.q)}%`;
      conditions.push(
        or(
          ilike(flatmateProfilesTable.description, q),
          ilike(flatmateProfilesTable.occupation, q),
          ilike(flatmateProfilesTable.locality, q),
        ),
      );
    }
    if (filters.city) conditions.push(ilike(flatmateProfilesTable.city, filters.city));
    if (filters.gender) conditions.push(ilike(flatmateProfilesTable.gender, filters.gender));
    if (filters.minBudget !== undefined)
      conditions.push(gte(flatmateProfilesTable.budget, filters.minBudget));
    if (filters.maxBudget !== undefined)
      conditions.push(lte(flatmateProfilesTable.budget, filters.maxBudget));

    const where = conditions.length ? and(...conditions) : undefined;
    const sortCol = SORT_FIELDS[filters.sortBy ?? "createdAt"];
    const order = filters.sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

    const [data, total] = await Promise.all([
      db
        .select()
        .from(flatmateProfilesTable)
        .where(where)
        .orderBy(order)
        .limit(limit)
        .offset(offset),
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
      .values({ ...data, id: snowflakeId() })
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
    const q = `%${escapeLike(query)}%`;
    const conditions = [
      or(
        ilike(flatmateProfilesTable.description, q),
        ilike(flatmateProfilesTable.occupation, q),
        ilike(flatmateProfilesTable.city, q),
      ) as SQL,
    ];
    if (city) conditions.push(ilike(flatmateProfilesTable.city, city));
    return db
      .select()
      .from(flatmateProfilesTable)
      .where(and(...conditions))
      .orderBy(desc(flatmateProfilesTable.createdAt))
      .limit(limit)
      .offset(offset);
  },
};
