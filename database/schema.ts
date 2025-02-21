import {
    varchar,
    uuid,
    integer,
    text,
    pgTable,
    date,
    pgEnum,
    timestamp,
  } from "drizzle-orm/pg-core";

  
  export const users = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    lastActivityDate: date("last_activity_date").defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).defaultNow(),
  });
  