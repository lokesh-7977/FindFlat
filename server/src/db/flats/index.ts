import { index, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "../auth";

export const flatTypeEnum = pgEnum("flat_type", [
  "1bhk",
  "2bhk",
  "3bhk",
  "4bhk",
  "studio",
  "shared",
  "penthouse",
]);
export const furnishingEnum = pgEnum("furnishing", ["furnished", "semi-furnished", "unfurnished"]);

export const flatListingsTable = pgTable(
  "flat_listings",
  {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    city: varchar("city", { length: 255 }).notNull(),
    locality: varchar("locality", { length: 255 }),
    address: text("address"),
    rent: integer("rent").notNull(),
    deposit: integer("deposit"),
    flatType: flatTypeEnum("flat_type").notNull(),
    furnishing: furnishingEnum("furnishing").notNull(),
    preferredGender: varchar("preferred_gender", { length: 50 }),
    amenities: text("amenities"),
    photos: text("photos"),
    contactPhone: varchar("contact_phone", { length: 20 }),
    availableFrom: timestamp("available_from"),
    postedBy: text("posted_by")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("flat_listings_city_idx").on(t.city),
    index("flat_listings_posted_by_idx").on(t.postedBy),
    index("flat_listings_rent_idx").on(t.rent),
  ],
);

export type FlatListing = typeof flatListingsTable.$inferSelect;
export type NewFlatListing = typeof flatListingsTable.$inferInsert;
