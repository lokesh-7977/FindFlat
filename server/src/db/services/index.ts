import { index, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "../auth";

export const serviceTypeEnum = pgEnum("service_type", [
  "maid",
  "cook",
  "cleaner",
  "laundry",
  "babysitter",
  "electrician",
  "plumber",
  "carpenter",
  "painter",
  "pest-control",
  "movers",
  "other",
]);

export const localServicesTable = pgTable(
  "local_services",
  {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    city: varchar("city", { length: 255 }).notNull(),
    locality: varchar("locality", { length: 255 }),
    serviceType: serviceTypeEnum("service_type").notNull(),
    contactName: varchar("contact_name", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 20 }),
    experience: varchar("experience", { length: 100 }),
    availableTime: varchar("available_time", { length: 255 }),
    monthlyCharge: integer("monthly_charge"),
    rating: text("rating"),
    postedBy: text("posted_by")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("local_services_city_idx").on(t.city),
    index("local_services_type_idx").on(t.serviceType),
    index("local_services_posted_by_idx").on(t.postedBy),
  ],
);

export type LocalService = typeof localServicesTable.$inferSelect;
export type NewLocalService = typeof localServicesTable.$inferInsert;
