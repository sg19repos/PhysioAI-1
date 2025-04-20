import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("patient"), // "patient" or "therapist"
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  profilePicture: true,
});

// Patients schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  condition: text("condition").notNull(),
  injury: text("injury"),
  startDate: timestamp("start_date").defaultNow(),
  targetEndDate: timestamp("target_end_date"),
  status: text("status").notNull().default("active"), // active, completed, paused
  therapistId: integer("therapist_id").references(() => users.id),
  engagementScore: integer("engagement_score").default(0),
  lastCheckIn: timestamp("last_check_in"),
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  userId: true,
  condition: true,
  injury: true,
  targetEndDate: true,
  status: true,
  therapistId: true,
});

// Exercises schema
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  bodyPart: text("body_part").notNull(),
  instructions: text("instructions").notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const insertExerciseSchema = createInsertSchema(exercises).pick({
  name: true,
  description: true,
  imageUrl: true,
  videoUrl: true,
  difficulty: true,
  bodyPart: true,
  instructions: true,
  createdBy: true,
});

// Patient exercises schema
export const patientExercises = pgTable("patient_exercises", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  durationSeconds: integer("duration_seconds"),
  assigned: boolean("assigned").notNull().default(true),
  completed: boolean("completed").notNull().default(false),
  assignedDate: timestamp("assigned_date").defaultNow(),
  completedDate: timestamp("completed_date"),
  performance: integer("performance").default(0), // 0-100 score
  feedback: text("feedback"),
});

export const insertPatientExerciseSchema = createInsertSchema(patientExercises).pick({
  patientId: true,
  exerciseId: true,
  sets: true,
  reps: true,
  durationSeconds: true,
  assigned: true,
});

// Sessions schema
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  therapistId: integer("therapist_id").references(() => users.id),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("scheduled"), // scheduled, active, completed, cancelled
  notes: text("notes"),
  postureQuality: integer("posture_quality"), // 0-100 score
  rangeOfMotion: json("range_of_motion"), // JSON object with ROM data
  painLevel: integer("pain_level"), // 0-10 score
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  patientId: true,
  therapistId: true,
  startTime: true,
  status: true,
  notes: true,
});

// Progress measurements schema
export const progressMeasurements = pgTable("progress_measurements", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  sessionId: integer("session_id").references(() => sessions.id),
  date: timestamp("date").defaultNow(),
  rangeOfMotion: json("range_of_motion"), // JSON object with ROM data
  postureQuality: integer("posture_quality"), // 0-100 score
  strength: integer("strength"), // 0-100 score
  painLevel: integer("pain_level"), // 0-10 score
  notes: text("notes"),
});

export const insertProgressMeasurementSchema = createInsertSchema(progressMeasurements).pick({
  patientId: true,
  sessionId: true,
  rangeOfMotion: true,
  postureQuality: true,
  strength: true,
  painLevel: true,
  notes: true,
});

// Alerts schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  type: text("type").notNull(), // missed_session, form_correction, progress_milestone
  message: text("message").notNull(),
  date: timestamp("date").defaultNow(),
  status: text("status").notNull().default("unread"), // unread, read, resolved
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  patientId: true,
  type: true,
  message: true,
  priority: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type PatientExercise = typeof patientExercises.$inferSelect;
export type InsertPatientExercise = z.infer<typeof insertPatientExerciseSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type ProgressMeasurement = typeof progressMeasurements.$inferSelect;
export type InsertProgressMeasurement = z.infer<typeof insertProgressMeasurementSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
