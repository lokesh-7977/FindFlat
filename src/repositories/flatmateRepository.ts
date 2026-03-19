import { and, asc, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { db } from "../db";
import {
  type FlatmateProfile,
  flatmateProfilesTable,
  type NewFlatmateProfile,
} from "../db/flatmates";
import { likePattern } from "../lib/db";
import { snowflakeId } from "../lib/snowflake";

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
    const conditions: SQL[] = [];

    if (filters.q) {
      const q = likePattern(filters.q);
      conditions.push(
        or(
          ilike(flatmateProfilesTable.description, q),
          ilike(flatmateProfilesTable.occupation, q),
          ilike(flatmateProfilesTable.locality, q),
        ) as SQL,
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

    const [data, [{ count: total }]] = await Promise.all([
      db
        .select()
        .from(flatmateProfilesTable)
        .where(where)
        .orderBy(order)
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(flatmateProfilesTable).where(where),
    ]);

    return { data, total };
  },

  async findById(id: string): Promise<FlatmateProfile | undefined> {
    const [row] = await db
      .select()
      .from(flatmateProfilesTable)
      .where(eq(flatmateProfilesTable.id, id))
      .limit(1);
    return row;
  },

  async findByUserId(userId: string): Promise<FlatmateProfile | undefined> {
    const [row] = await db
      .select()
      .from(flatmateProfilesTable)
      .where(eq(flatmateProfilesTable.postedBy, userId))
      .limit(1);
    return row;
  },

  async create(data: Omit<NewFlatmateProfile, "id">): Promise<FlatmateProfile> {
    const [row] = await db
      .insert(flatmateProfilesTable)
      .values({ ...data, id: snowflakeId() })
      .returning();
    return row;
  },

  async updateByUserId(
    userId: string,
    data: Partial<NewFlatmateProfile>,
  ): Promise<FlatmateProfile | undefined> {
    const [row] = await db
      .update(flatmateProfilesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(flatmateProfilesTable.postedBy, userId))
      .returning();
    return row;
  },

  async deleteByUserId(userId: string): Promise<boolean> {
    const rows = await db
      .delete(flatmateProfilesTable)
      .where(eq(flatmateProfilesTable.postedBy, userId))
      .returning({ id: flatmateProfilesTable.id });
    return rows.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0): Promise<FlatmateProfile[]> {
    const q = likePattern(query);
    const conditions: SQL[] = [
      or(
        ilike(flatmateProfilesTable.description, q),
        ilike(flatmateProfilesTable.occupation, q),
        ilike(flatmateProfilesTable.city, q),
      ) as SQL,
    ];
    // Note: city filter is already included in the or() above via city search,
    // but if an explicit city filter is provided, we narrow to exact city match.
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
