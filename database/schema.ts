import {
    varchar,
    uuid,
    integer,
    text,
    pgTable,
    date,
    pgEnum,
    timestamp,
    jsonb,
  } from "drizzle-orm/pg-core";
import { link } from "fs";
import { title } from "process";

  
  export const users = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    lastActivityDate: date("last_activity_date").defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).defaultNow(),
  });

  export const profile = pgTable("profile", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Change from integer → uuid
    userSetName: varchar("userSetName", { length: 255 }),
    name: varchar("profileName", { length: 255 }),
    skills: jsonb("skills"), // Change from text → jsonb to store array of strings
    queryString: text("queryString")
  });

  export const contact = pgTable("contact", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    profileId: uuid("profile_id").notNull().references(() => profile.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    phone: text("phone"),
    linkedin: text("linkedin"),
    github: text("github"),
    location: text("location"),
    X: text("X")
  })

  export const education = pgTable("education", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    profileId: uuid("profile_id").notNull().references(() => profile.id, { onDelete: "cascade" }),
    institution: text("institution"),
    university: text("university"),
    degree: text("degree").notNull(),
    field: text("field"),
    cgpa: text("cgpa"),
    percentage: text("percentage"),
    duration: text("duration").notNull()
  })

  export const experience = pgTable("experience", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    profileId: uuid("profile_id").notNull().references(() => profile.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    company: text("company").notNull(),
    duration: text("duration").notNull(),
    location: text("location").notNull(),
    responsibilities: jsonb("responsibilities").notNull()
});

export const projects = pgTable("projects", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  profileId: uuid("profile_id").notNull().references(() => profile.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  duration: text("duration").notNull(),
  description: jsonb("description").notNull(),
  techStack: jsonb("tech_stack").notNull()
});

export const jobs = pgTable("jobs", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  profileId: uuid("profile_id").notNull().references(() => profile.id, { onDelete: "cascade" }),
  logo: text("logo").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  posted: text("posted").notNull(),
  valid: text("valid").notNull(),
  url: text("url").notNull(),
})

