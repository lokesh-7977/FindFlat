import { index, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "../auth";

export const eventCategoryEnum = pgEnum("event_category", [
  "sports",
  "music",
  "meetup",
  "workshop",
  "party",
  "cultural",
  "tech",
  "networking",
  "community",
  "other",
]);

export const eventsTable = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    city: varchar("city", { length: 255 }).notNull(),
    locality: varchar("locality", { length: 255 }),
    venue: varchar("venue", { length: 500 }),
    category: eventCategoryEnum("event_category").notNull(),
    eventDate: timestamp("event_date").notNull(),
    entryFee: integer("entry_fee"),
    maxAttendees: integer("max_attendees"),
    organizer: varchar("organizer", { length: 255 }),
    eventLink: varchar("event_link", { length: 500 }),
    postedBy: text("posted_by")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("events_city_idx").on(t.city),
    index("events_category_idx").on(t.category),
    index("events_date_idx").on(t.eventDate),
    index("events_posted_by_idx").on(t.postedBy),
  ],
);

export type Event = typeof eventsTable.$inferSelect;
export type NewEvent = typeof eventsTable.$inferInsert;
