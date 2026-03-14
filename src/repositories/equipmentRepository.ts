import { and, count, eq, gte, ilike, lte } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import { db } from "../db";
import {
  type EquipmentListing,
  equipmentListingsTable,
  type NewEquipmentListing,
} from "../db/equipment";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

type EquipmentCategory = EquipmentListing["category"];
type EquipmentCondition = EquipmentListing["condition"];

interface EquipmentFilters {
  city?: string;
  category?: EquipmentCategory;
  condition?: EquipmentCondition;
  minPrice?: number;
  maxPrice?: number;
}

export const equipmentRepository = {
  async findAll(filters: EquipmentFilters, limit: number, offset: number) {
    const conditions = [];
    if (filters.city) conditions.push(ilike(equipmentListingsTable.city, filters.city));
    if (filters.category) conditions.push(eq(equipmentListingsTable.category, filters.category));
    if (filters.condition) conditions.push(eq(equipmentListingsTable.condition, filters.condition));
    if (filters.minPrice !== undefined)
      conditions.push(gte(equipmentListingsTable.price, filters.minPrice));
    if (filters.maxPrice !== undefined)
      conditions.push(lte(equipmentListingsTable.price, filters.maxPrice));

    const where = conditions.length ? and(...conditions) : undefined;

    const [data, total] = await Promise.all([
      db
        .select()
        .from(equipmentListingsTable)
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(equipmentListingsTable.createdAt),
      db.select({ count: count() }).from(equipmentListingsTable).where(where),
    ]);

    return { data, total: total[0].count };
  },

  async findById(id: string): Promise<EquipmentListing | undefined> {
    const result = await db
      .select()
      .from(equipmentListingsTable)
      .where(eq(equipmentListingsTable.id, id))
      .limit(1);
    return result[0];
  },

  async create(data: Omit<NewEquipmentListing, "id">): Promise<EquipmentListing> {
    const result = await db
      .insert(equipmentListingsTable)
      .values({ ...data, id: uuidv7() })
      .returning();
    return result[0];
  },

  async updateById(
    id: string,
    data: Partial<NewEquipmentListing>,
  ): Promise<EquipmentListing | undefined> {
    const result = await db
      .update(equipmentListingsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(equipmentListingsTable.id, id))
      .returning();
    return result[0];
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db
      .delete(equipmentListingsTable)
      .where(eq(equipmentListingsTable.id, id))
      .returning();
    return result.length > 0;
  },

  async search(query: string, city?: string, limit = 20, offset = 0) {
    const conditions = [ilike(equipmentListingsTable.title, `%${escapeLike(query)}%`)];
    if (city) conditions.push(ilike(equipmentListingsTable.city, city));
    const where = and(...conditions);
    return db
      .select()
      .from(equipmentListingsTable)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(equipmentListingsTable.createdAt);
  },
};
