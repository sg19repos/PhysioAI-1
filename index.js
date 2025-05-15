var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  engagementMetrics: () => engagementMetrics,
  exercises: () => exercises,
  insertEngagementMetricSchema: () => insertEngagementMetricSchema,
  insertExerciseSchema: () => insertExerciseSchema,
  insertPaymentRecordSchema: () => insertPaymentRecordSchema,
  insertProgressRecordSchema: () => insertProgressRecordSchema,
  insertSessionExerciseSchema: () => insertSessionExerciseSchema,
  insertSessionSchema: () => insertSessionSchema,
  insertTherapistNoteSchema: () => insertTherapistNoteSchema,
  insertUserSchema: () => insertUserSchema,
  paymentRecords: () => paymentRecords,
  progressRecords: () => progressRecords,
  sessionExercises: () => sessionExercises,
  sessions: () => sessions,
  therapistNotes: () => therapistNotes,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull().default("patient"),
  // patient or therapist
  createdAt: timestamp("created_at").defaultNow()
});
var exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  targetArea: text("target_area").notNull(),
  difficulty: text("difficulty").notNull(),
  // easy, medium, hard
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  poseData: json("pose_data"),
  // Serialized pose detection guide data
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id)
});
var sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("scheduled"),
  // scheduled, completed, missed
  notes: text("notes"),
  therapistId: integer("therapist_id").references(() => users.id)
});
var sessionExercises = pgTable("session_exercises", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  completed: boolean("completed").default(false),
  notes: text("notes")
});
var progressRecords = pgTable("progress_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  rangeOfMotion: integer("range_of_motion"),
  postureQuality: integer("posture_quality"),
  // 0-100 scale
  painLevel: integer("pain_level"),
  // 0-10 scale
  notes: text("notes")
});
var engagementMetrics = pgTable("engagement_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  sessionsCompleted: integer("sessions_completed").default(0),
  exercisesCompleted: integer("exercises_completed").default(0),
  checkInStreak: integer("check_in_streak").default(0),
  weeklyScore: integer("weekly_score").default(0)
});
var therapistNotes = pgTable("therapist_notes", {
  id: serial("id").primaryKey(),
  therapistId: integer("therapist_id").references(() => users.id).notNull(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  notes: text("notes").notNull(),
  flags: text("flags").array()
  // e.g. ['progress on track', 'posture correction needed']
});
var paymentRecords = pgTable("payment_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  amount: integer("amount").notNull(),
  // stored in cents
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, processed, failed
  receiptUrl: text("receipt_url")
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true
});
var insertSessionSchema = createInsertSchema(sessions).omit({
  id: true
});
var insertSessionExerciseSchema = createInsertSchema(sessionExercises).omit({
  id: true
});
var insertProgressRecordSchema = createInsertSchema(progressRecords).omit({
  id: true
});
var insertEngagementMetricSchema = createInsertSchema(engagementMetrics).omit({
  id: true
});
var insertTherapistNoteSchema = createInsertSchema(therapistNotes).omit({
  id: true
});
var insertPaymentRecordSchema = createInsertSchema(paymentRecords).omit({
  id: true
});

// server/storage.ts
import { eq, desc, count } from "drizzle-orm";

// server/db.ts
import dotenv from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
dotenv.config();
neonConfig.webSocketConstructor = ws;
var DATABASE_URL = "your_database_url_here";
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var db;
var pool;
if (DATABASE_URL && DATABASE_URL !== "your_database_url_here") {
  pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema: schema_exports });
} else {
  db = {
    data: {},
    get(table, id) {
      return this.data[table]?.[id] || null;
    },
    set(table, id, value) {
      if (!this.data[table]) this.data[table] = {};
      this.data[table][id] = value;
    },
    all(table) {
      return Object.values(this.data[table] || {});
    }
  };
  pool = null;
  console.warn("Using in-memory DB. Data will not persist between restarts.");
}

// server/storage.ts
var MemStorage = class {
  users;
  exercises;
  sessions;
  sessionExercises;
  progressRecords;
  engagementMetrics;
  therapistNotes;
  paymentRecords;
  userIdCounter;
  exerciseIdCounter;
  sessionIdCounter;
  sessionExerciseIdCounter;
  progressRecordIdCounter;
  engagementMetricIdCounter;
  therapistNoteIdCounter;
  paymentRecordIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.exercises = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    this.sessionExercises = /* @__PURE__ */ new Map();
    this.progressRecords = /* @__PURE__ */ new Map();
    this.engagementMetrics = /* @__PURE__ */ new Map();
    this.therapistNotes = /* @__PURE__ */ new Map();
    this.paymentRecords = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.sessionIdCounter = 1;
    this.sessionExerciseIdCounter = 1;
    this.progressRecordIdCounter = 1;
    this.engagementMetricIdCounter = 1;
    this.therapistNoteIdCounter = 1;
    this.paymentRecordIdCounter = 1;
    this.initDemoData();
  }
  initDemoData() {
    const john = {
      username: "john",
      password: "password123",
      fullName: "John Doe",
      email: "john@example.com",
      userType: "patient"
    };
    const drRachel = {
      username: "drrachel",
      password: "password123",
      fullName: "Dr. Rachel Stevens",
      email: "rachel@example.com",
      userType: "therapist"
    };
    this.createUser(john);
    this.createUser(drRachel);
    const shoulderExercises = [
      {
        name: "Shoulder Flexion",
        description: "Raising your arm forward and upward",
        targetArea: "shoulder",
        difficulty: "medium",
        sets: 3,
        reps: 12,
        imageUrl: "shoulder-flexion.jpg",
        createdBy: 2
      },
      {
        name: "Shoulder External Rotation",
        description: "Targets rotator cuff strength",
        targetArea: "shoulder",
        difficulty: "medium",
        sets: 3,
        reps: 12,
        imageUrl: "shoulder-rotation.jpg",
        createdBy: 2
      },
      {
        name: "Scapular Retraction",
        description: "Improves posture and shoulder stability",
        targetArea: "shoulder",
        difficulty: "easy",
        sets: 2,
        reps: 15,
        imageUrl: "scapular-retraction.jpg",
        createdBy: 2
      },
      {
        name: "Pendulum Exercise",
        description: "Gentle motion for shoulder mobility",
        targetArea: "shoulder",
        difficulty: "easy",
        sets: 3,
        reps: 10,
        imageUrl: "pendulum.jpg",
        createdBy: 2
      }
    ];
    shoulderExercises.forEach((ex) => this.createExercise(ex));
    const today = /* @__PURE__ */ new Date();
    const todayStr = today.toISOString().split("T")[0];
    const session = {
      patientId: 1,
      date: todayStr,
      startTime: (/* @__PURE__ */ new Date()).toISOString(),
      status: "scheduled",
      therapistId: 2
    };
    const createdSession = this.createSession(session);
    this.createSessionExercise({
      sessionId: createdSession.id,
      exerciseId: 1,
      sets: 3,
      reps: 12,
      completed: false
    });
    this.createProgressRecord({
      patientId: 1,
      date: todayStr,
      rangeOfMotion: 142,
      postureQuality: 72,
      painLevel: 3,
      notes: "Improving steadily"
    });
    this.createEngagementMetric({
      userId: 1,
      date: todayStr,
      sessionsCompleted: 18,
      exercisesCompleted: 72,
      checkInStreak: 4,
      weeklyScore: 85
    });
    this.createTherapistNote({
      therapistId: 2,
      patientId: 1,
      date: todayStr,
      notes: "John has been making excellent progress with his shoulder rehabilitation program. Range of motion has improved significantly in the last two weeks. I've noticed his posture during external rotation exercises needs some refinement. The AI system has been flagging this correctly, and I've added some additional cues to help with proper form.",
      flags: ["progress on track", "new exercises added", "posture correction needed"]
    });
    const month = today.getMonth();
    const year = today.getFullYear();
    for (let i = 0; i < 3; i++) {
      const paymentDate = new Date(year, month - i, 1).toISOString().split("T")[0];
      this.createPaymentRecord({
        userId: 1,
        date: paymentDate,
        amount: 4999,
        // $49.99
        description: "Premium Rehabilitation Plan - Monthly",
        status: "processed",
        receiptUrl: `/receipts/invoice_${i + 1}.pdf`
      });
    }
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(user) {
    const id = this.userIdCounter++;
    const newUser = { ...user, id, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.users.set(id, newUser);
    return newUser;
  }
  // Exercise methods
  async getExercise(id) {
    return this.exercises.get(id);
  }
  async getAllExercises() {
    return Array.from(this.exercises.values());
  }
  async getExercisesByTargetArea(targetArea) {
    return Array.from(this.exercises.values()).filter(
      (exercise) => exercise.targetArea === targetArea
    );
  }
  async createExercise(exercise) {
    const id = this.exerciseIdCounter++;
    const newExercise = { ...exercise, id, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.exercises.set(id, newExercise);
    return newExercise;
  }
  // Session methods
  async getSession(id) {
    return this.sessions.get(id);
  }
  async getSessionsByPatientId(patientId) {
    return Array.from(this.sessions.values()).filter(
      (session) => session.patientId === patientId
    );
  }
  async createSession(session) {
    const id = this.sessionIdCounter++;
    const newSession = { ...session, id };
    this.sessions.set(id, newSession);
    return newSession;
  }
  async updateSessionStatus(id, status) {
    const session = this.sessions.get(id);
    if (!session) return void 0;
    const updatedSession = { ...session, status };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  // Session Exercise methods
  async getSessionExercises(sessionId) {
    return Array.from(this.sessionExercises.values()).filter(
      (se) => se.sessionId === sessionId
    );
  }
  async createSessionExercise(sessionExercise) {
    const id = this.sessionExerciseIdCounter++;
    const newSessionExercise = { ...sessionExercise, id };
    this.sessionExercises.set(id, newSessionExercise);
    return newSessionExercise;
  }
  async completeSessionExercise(id, notes) {
    const sessionExercise = this.sessionExercises.get(id);
    if (!sessionExercise) return void 0;
    const updatedExercise = {
      ...sessionExercise,
      completed: true,
      notes: notes || sessionExercise.notes
    };
    this.sessionExercises.set(id, updatedExercise);
    return updatedExercise;
  }
  // Progress methods
  async getProgressRecords(patientId) {
    return Array.from(this.progressRecords.values()).filter((record) => record.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async createProgressRecord(progressRecord) {
    const id = this.progressRecordIdCounter++;
    const newRecord = { ...progressRecord, id };
    this.progressRecords.set(id, newRecord);
    return newRecord;
  }
  // Engagement methods
  async getEngagementMetrics(userId) {
    return Array.from(this.engagementMetrics.values()).filter((metric) => metric.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async getLatestEngagementMetric(userId) {
    const metrics = await this.getEngagementMetrics(userId);
    return metrics.length > 0 ? metrics[0] : void 0;
  }
  async createEngagementMetric(metric) {
    const id = this.engagementMetricIdCounter++;
    const newMetric = { ...metric, id };
    this.engagementMetrics.set(id, newMetric);
    return newMetric;
  }
  async updateEngagementStreak(userId, streak) {
    const latest = await this.getLatestEngagementMetric(userId);
    if (!latest) return void 0;
    const updated = { ...latest, checkInStreak: streak };
    this.engagementMetrics.set(latest.id, updated);
    return updated;
  }
  // Therapist Notes methods
  async getTherapistNotes(patientId) {
    return Array.from(this.therapistNotes.values()).filter((note) => note.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async createTherapistNote(note) {
    const id = this.therapistNoteIdCounter++;
    const newNote = { ...note, id };
    this.therapistNotes.set(id, newNote);
    return newNote;
  }
  // Payment methods
  async getPaymentRecords(userId) {
    return Array.from(this.paymentRecords.values()).filter((payment) => payment.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async createPaymentRecord(payment) {
    const id = this.paymentRecordIdCounter++;
    const newPayment = { ...payment, id };
    this.paymentRecords.set(id, newPayment);
    return newPayment;
  }
  async updatePaymentStatus(id, status, receiptUrl) {
    const payment = this.paymentRecords.get(id);
    if (!payment) return void 0;
    const updatedPayment = {
      ...payment,
      status,
      receiptUrl: receiptUrl || payment.receiptUrl
    };
    this.paymentRecords.set(id, updatedPayment);
    return updatedPayment;
  }
};
console.log("Using in-memory storage due to database connection issues");
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.get("/api/exercises", async (req, res) => {
    const targetArea = req.query.targetArea;
    const exercises2 = targetArea ? await storage.getExercisesByTargetArea(targetArea) : await storage.getAllExercises();
    res.json(exercises2);
  });
  app2.get("/api/exercises/:id", async (req, res) => {
    const exerciseId = parseInt(req.params.id);
    if (isNaN(exerciseId)) {
      return res.status(400).json({ message: "Invalid exercise ID" });
    }
    const exercise = await storage.getExercise(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.json(exercise);
  });
  app2.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });
  app2.get("/api/sessions/patient/:patientId", async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const sessions2 = await storage.getSessionsByPatientId(patientId);
    res.json(sessions2);
  });
  app2.get("/api/sessions/:id", async (req, res) => {
    const sessionId = parseInt(req.params.id);
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    const session = await storage.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  });
  app2.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });
  app2.patch("/api/sessions/:id/status", async (req, res) => {
    const sessionId = parseInt(req.params.id);
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    const { status } = req.body;
    if (!status || !["scheduled", "completed", "missed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updatedSession = await storage.updateSessionStatus(sessionId, status);
    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(updatedSession);
  });
  app2.get("/api/session-exercises/:sessionId", async (req, res) => {
    const sessionId = parseInt(req.params.sessionId);
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    const exercises2 = await storage.getSessionExercises(sessionId);
    res.json(exercises2);
  });
  app2.post("/api/session-exercises", async (req, res) => {
    try {
      const sessionExerciseData = insertSessionExerciseSchema.parse(req.body);
      const sessionExercise = await storage.createSessionExercise(sessionExerciseData);
      res.status(201).json(sessionExercise);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create session exercise" });
    }
  });
  app2.patch("/api/session-exercises/:id/complete", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const { notes } = req.body;
    const updated = await storage.completeSessionExercise(id, notes);
    if (!updated) {
      return res.status(404).json({ message: "Session exercise not found" });
    }
    res.json(updated);
  });
  app2.get("/api/progress/:patientId", async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const records = await storage.getProgressRecords(patientId);
    res.json(records);
  });
  app2.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressRecordSchema.parse(req.body);
      const progress = await storage.createProgressRecord(progressData);
      res.status(201).json(progress);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create progress record" });
    }
  });
  app2.get("/api/engagement/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const metrics = await storage.getEngagementMetrics(userId);
    res.json(metrics);
  });
  app2.get("/api/engagement/:userId/latest", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const metric = await storage.getLatestEngagementMetric(userId);
    if (!metric) {
      return res.status(404).json({ message: "No engagement metrics found" });
    }
    res.json(metric);
  });
  app2.post("/api/engagement", async (req, res) => {
    try {
      const engagementData = insertEngagementMetricSchema.parse(req.body);
      const metric = await storage.createEngagementMetric(engagementData);
      res.status(201).json(metric);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create engagement metric" });
    }
  });
  app2.patch("/api/engagement/:userId/streak", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const { streak } = req.body;
    if (typeof streak !== "number" || streak < 0) {
      return res.status(400).json({ message: "Invalid streak value" });
    }
    const updated = await storage.updateEngagementStreak(userId, streak);
    if (!updated) {
      return res.status(404).json({ message: "Engagement metric not found" });
    }
    res.json(updated);
  });
  app2.get("/api/therapist-notes/:patientId", async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const notes = await storage.getTherapistNotes(patientId);
    res.json(notes);
  });
  app2.post("/api/therapist-notes", async (req, res) => {
    try {
      const noteData = insertTherapistNoteSchema.parse(req.body);
      const note = await storage.createTherapistNote(noteData);
      res.status(201).json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create therapist note" });
    }
  });
  app2.get("/api/payments/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const payments = await storage.getPaymentRecords(userId);
    res.json(payments);
  });
  app2.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentRecordSchema.parse(req.body);
      const payment = await storage.createPaymentRecord(paymentData);
      res.status(201).json(payment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create payment record" });
    }
  });
  app2.patch("/api/payments/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }
    const { status, receiptUrl } = req.body;
    if (!status || !["pending", "processed", "failed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await storage.updatePaymentStatus(id, status, receiptUrl);
    if (!updated) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    res.json(updated);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/PhysioAI-1/",
  root: "client",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      external: []
      // Remove externals for browser build
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
