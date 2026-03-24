import { and, asc, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { db } from "../db";
import { type FlatListing, flatListingsTable, type NewFlatListing } from "../db/flats";
import { likePattern } from "../lib/db";
import { snowflakeId } from "../lib/snowflake";

type FlatType = FlatListing["flatType"];
type Furnishing = FlatListing["furnishing"];
type FlatSortBy = "createdAt" | "rent" | "updatedAt";

const SORT_FIELDS: Record<
  FlatSortBy,
  | typeof flatListingsTable.createdAt
  | typeof flatListingsTable.rent
  | typeof flatListingsTable.updatedAt
> = {
  createdAt: flatListingsTable.createdAt,
  rent: flatListingsTable.rent,
  updatedAt: flatListingsTable.updatedAt,
};

interface FlatFilters {
  city?: string;
  minRent?: number;
  maxRent?: number;
  flatType?: FlatType;
  furnishing?: Furnishing;
  gender?: string;
  q?: string;
  sortBy?: FlatSortBy;
  sortOrder?: "asc" | "desc";
}

export const flatRepository = {
  async findAll(filters: FlatFilters, limit: number, offset: number) {
    const conditions: SQL[] = [];

    if (filters.q) {
      const q = likePattern(filters.q);
      conditions.push(
        or(
          ilike(flatListingsTable.title, q),
          ilike(flatListingsTable.description, q),
          ilike(flatListingsTable.locality, q),
        ) as SQL,
      );
    }
    if (filters.city) conditions.push(ilike(flatListingsTable.city, filters.city));
    if (filters.minRent !== undefined)
      conditions.push(gte(flatListingsTable.rent, filters.minRent));
    if (filters.maxRent !== undefined)
      conditions.push(lte(flatListingsTable.rent, filters.maxRent));
    if (filters.flatType) conditions.push(eq(flatListingsTable.flatType, filters.flatType));
    if (filters.furnishing) conditions.push(eq(flatListingsTable.furnishing, filters.furnishing));
    if (filters.gender) conditions.push(ilike(flatListingsTable.preferredGender, filters.gender));

    const where = conditions.length ? and(...conditions) : undefined;
    const sortCol = SORT_FIELDS[filters.sortBy ?? "createdAt"];
    const order = filters.sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

    const [data, [{ count: total }]] = await Promise.all([
      db.select().from(flatListingsTable).where(where).orderBy(order).limit(limit).offset(offset),
      db.select({ count: count() }).from(flatListingsTable).where(where),
    ]);

    return { data, total };
  },

  async findById(id: string): Promise<FlatListing | undefined> {
    const [row] = await db
      .select()
      .from(flatListingsTable)
      .where(eq(flatListingsTable.id, id))
      .limit(1);
    return row;
  },

  async create(data: Omit<NewFlatListing, "id">): Promise<FlatListing> {
    const [row] = await db
      .insert(flatListingsTable)
      .values({ ...data, id: snowflakeId() })
      .returning();
    return row;
  },

  async updateById(id: string, data: Partial<NewFlatListing>): Promise<FlatListing | undefined> {
    const [row] = await db
      .update(flatListingsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(flatListingsTable.id, id))
      .returning();
    return row;
  },

  async deleteById(id: string): Promise<boolean> {
    const rows = await db
      .delete(flatListingsTable)
      .where(eq(flatListingsTable.id, id))
      .returning({ id: flatListingsTable.id });
    return rows.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0): Promise<FlatListing[]> {
    const q = likePattern(query);
    const conditions: SQL[] = [
      or(ilike(flatListingsTable.title, q), ilike(flatListingsTable.description, q)) as SQL,
    ];
    if (city) conditions.push(ilike(flatListingsTable.city, city));

    return db
      .select()
      .from(flatListingsTable)
      .where(and(...conditions))
      .orderBy(desc(flatListingsTable.createdAt))
      .limit(limit)
      .offset(offset);
  },
};
