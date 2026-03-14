import { index, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "../auth";

export const smokingEnum = pgEnum("smoking", ["yes", "no", "occasionally"]);
export const foodPrefEnum = pgEnum("food_pref", ["veg", "non-veg", "vegan", "no-preference"]);

export const flatmateProfilesTable = pgTable(
  "flatmate_profiles",
  {
    id: text("id").primaryKey(),
    city: varchar("city", { length: 255 }).notNull(),
    locality: varchar("locality", { length: 255 }),
    budget: integer("budget").notNull(),
    description: text("description"),
    gender: varchar("gender", { length: 50 }),
    age: integer("age"),
    occupation: varchar("occupation", { length: 255 }),
    smoking: smokingEnum("smoking"),
    foodPref: foodPrefEnum("food_pref"),
    contactPhone: varchar("contact_phone", { length: 20 }),
    moveInDate: timestamp("move_in_date"),
    postedBy: text("posted_by")
      .notNull()
      .unique()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("flatmate_profiles_city_idx").on(t.city),
    index("flatmate_profiles_budget_idx").on(t.budget),
  ],
);

export type FlatmateProfile = typeof flatmateProfilesTable.$inferSelect;
export type NewFlatmateProfile = typeof flatmateProfilesTable.$inferInsert;
