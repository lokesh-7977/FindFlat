import { and, asc, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { db } from "../db";
import {
  type EquipmentListing,
  equipmentListingsTable,
  type NewEquipmentListing,
} from "../db/equipment";
import { likePattern } from "../lib/db";
import { snowflakeId } from "../lib/snowflake";

type EquipmentCategory = EquipmentListing["category"];
type EquipmentCondition = EquipmentListing["condition"];
type EquipmentSortBy = "createdAt" | "price" | "updatedAt";

const SORT_FIELDS: Record<
  EquipmentSortBy,
  | typeof equipmentListingsTable.createdAt
  | typeof equipmentListingsTable.price
  | typeof equipmentListingsTable.updatedAt
> = {
  createdAt: equipmentListingsTable.createdAt,
  price: equipmentListingsTable.price,
  updatedAt: equipmentListingsTable.updatedAt,
};

interface EquipmentFilters {
  city?: string;
  category?: EquipmentCategory;
  condition?: EquipmentCondition;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sortBy?: EquipmentSortBy;
  sortOrder?: "asc" | "desc";
}

export const equipmentRepository = {
  async findAll(filters: EquipmentFilters, limit: number, offset: number) {
    const conditions: SQL[] = [];

    if (filters.q) {
      const q = likePattern(filters.q);
      conditions.push(
        or(
          ilike(equipmentListingsTable.title, q),
          ilike(equipmentListingsTable.description, q),
        ) as SQL,
      );
    }
    if (filters.city) conditions.push(ilike(equipmentListingsTable.city, filters.city));
    if (filters.category) conditions.push(eq(equipmentListingsTable.category, filters.category));
    if (filters.condition) conditions.push(eq(equipmentListingsTable.condition, filters.condition));
    if (filters.minPrice !== undefined)
      conditions.push(gte(equipmentListingsTable.price, filters.minPrice));
    if (filters.maxPrice !== undefined)
      conditions.push(lte(equipmentListingsTable.price, filters.maxPrice));

    const where = conditions.length ? and(...conditions) : undefined;
    const sortCol = SORT_FIELDS[filters.sortBy ?? "createdAt"];
    const order = filters.sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

    const [data, [{ count: total }]] = await Promise.all([
      db
        .select()
        .from(equipmentListingsTable)
        .where(where)
        .orderBy(order)
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(equipmentListingsTable).where(where),
    ]);

    return { data, total };
  },

  async findById(id: string): Promise<EquipmentListing | undefined> {
    const [row] = await db
      .select()
      .from(equipmentListingsTable)
      .where(eq(equipmentListingsTable.id, id))
      .limit(1);
    return row;
  },

  async create(data: Omit<NewEquipmentListing, "id">): Promise<EquipmentListing> {
    const [row] = await db
      .insert(equipmentListingsTable)
      .values({ ...data, id: snowflakeId() })
      .returning();
    return row;
  },

  async updateById(
    id: string,
    data: Partial<NewEquipmentListing>,
  ): Promise<EquipmentListing | undefined> {
    const [row] = await db
      .update(equipmentListingsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(equipmentListingsTable.id, id))
      .returning();
    return row;
  },

  async deleteById(id: string): Promise<boolean> {
    const rows = await db
      .delete(equipmentListingsTable)
      .where(eq(equipmentListingsTable.id, id))
      .returning({ id: equipmentListingsTable.id });
    return rows.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0): Promise<EquipmentListing[]> {
    const q = likePattern(query);
    const conditions: SQL[] = [
      or(
        ilike(equipmentListingsTable.title, q),
        ilike(equipmentListingsTable.description, q),
      ) as SQL,
    ];
    if (city) conditions.push(ilike(equipmentListingsTable.city, city));

    return db
      .select()
      .from(equipmentListingsTable)
      .where(and(...conditions))
      .orderBy(desc(equipmentListingsTable.createdAt))
      .limit(limit)
      .offset(offset);
  },
};
