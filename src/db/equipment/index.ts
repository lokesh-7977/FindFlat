import { index, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "../auth";

export const equipmentCategoryEnum = pgEnum("equipment_category", [
  "furniture",
  "electronics",
  "appliances",
  "kitchen",
  "fitness",
  "books",
  "other",
]);

export const equipmentConditionEnum = pgEnum("equipment_condition", [
  "new",
  "like-new",
  "good",
  "fair",
  "poor",
]);

export const equipmentListingsTable = pgTable(
  "equipment_listings",
  {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    city: varchar("city", { length: 255 }).notNull(),
    locality: varchar("locality", { length: 255 }),
    price: integer("price").notNull(),
    category: equipmentCategoryEnum("category").notNull(),
    condition: equipmentConditionEnum("condition").notNull(),
    photos: text("photos"),
    sellerContact: varchar("seller_contact", { length: 20 }),
    postedBy: text("posted_by")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("equipment_listings_city_idx").on(t.city),
    index("equipment_listings_category_idx").on(t.category),
    index("equipment_listings_price_idx").on(t.price),
    index("equipment_listings_posted_by_idx").on(t.postedBy),
  ],
);

export type EquipmentListing = typeof equipmentListingsTable.$inferSelect;
export type NewEquipmentListing = typeof equipmentListingsTable.$inferInsert;
