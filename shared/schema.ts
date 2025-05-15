import { pgTable, text, serial, integer, boolean, timestamp, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull().default("patient"), // patient or therapist
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  targetArea: text("target_area").notNull(),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  poseData: json("pose_data"), // Serialized pose detection guide data
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, missed
  notes: text("notes"),
  therapistId: integer("therapist_id").references(() => users.id),
});

export const sessionExercises = pgTable("session_exercises", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  completed: boolean("completed").default(false),
  notes: text("notes"),
});

export const progressRecords = pgTable("progress_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  rangeOfMotion: integer("range_of_motion"),
  postureQuality: integer("posture_quality"), // 0-100 scale
  painLevel: integer("pain_level"), // 0-10 scale
  notes: text("notes"),
});

export const engagementMetrics = pgTable("engagement_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  sessionsCompleted: integer("sessions_completed").default(0),
  exercisesCompleted: integer("exercises_completed").default(0),
  checkInStreak: integer("check_in_streak").default(0),
  weeklyScore: integer("weekly_score").default(0),
});

export const therapistNotes = pgTable("therapist_notes", {
  id: serial("id").primaryKey(),
  therapistId: integer("therapist_id").references(() => users.id).notNull(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  notes: text("notes").notNull(),
  flags: text("flags").array(), // e.g. ['progress on track', 'posture correction needed']
});

export const paymentRecords = pgTable("payment_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  amount: integer("amount").notNull(), // stored in cents
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending, processed, failed
  receiptUrl: text("receipt_url"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({ 
  id: true, 
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ 
  id: true,
});

export const insertSessionExerciseSchema = createInsertSchema(sessionExercises).omit({ 
  id: true,
});

export const insertProgressRecordSchema = createInsertSchema(progressRecords).omit({ 
  id: true,
});

export const insertEngagementMetricSchema = createInsertSchema(engagementMetrics).omit({ 
  id: true,
});

export const insertTherapistNoteSchema = createInsertSchema(therapistNotes).omit({ 
  id: true,
});

export const insertPaymentRecordSchema = createInsertSchema(paymentRecords).omit({ 
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type SessionExercise = typeof sessionExercises.$inferSelect;
export type InsertSessionExercise = z.infer<typeof insertSessionExerciseSchema>;

export type ProgressRecord = typeof progressRecords.$inferSelect;
export type InsertProgressRecord = z.infer<typeof insertProgressRecordSchema>;

export type EngagementMetric = typeof engagementMetrics.$inferSelect;
export type InsertEngagementMetric = z.infer<typeof insertEngagementMetricSchema>;

export type TherapistNote = typeof therapistNotes.$inferSelect;
export type InsertTherapistNote = z.infer<typeof insertTherapistNoteSchema>;

export type PaymentRecord = typeof paymentRecords.$inferSelect;
export type InsertPaymentRecord = z.infer<typeof insertPaymentRecordSchema>;
