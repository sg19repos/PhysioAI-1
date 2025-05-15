import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertExerciseSchema, insertSessionSchema, 
  insertSessionExerciseSchema, insertProgressRecordSchema,
  insertEngagementMetricSchema, insertTherapistNoteSchema, insertPaymentRecordSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    const targetArea = req.query.targetArea as string | undefined;
    
    const exercises = targetArea 
      ? await storage.getExercisesByTargetArea(targetArea)
      : await storage.getAllExercises();
      
    res.json(exercises);
  });
  
  app.get("/api/exercises/:id", async (req, res) => {
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
  
  app.post("/api/exercises", async (req, res) => {
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
  
  // Session routes
  app.get("/api/sessions/patient/:patientId", async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    
    const sessions = await storage.getSessionsByPatientId(patientId);
    res.json(sessions);
  });
  
  app.get("/api/sessions/:id", async (req, res) => {
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
  
  app.post("/api/sessions", async (req, res) => {
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
  
  app.patch("/api/sessions/:id/status", async (req, res) => {
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
  
  // Session Exercises routes
  app.get("/api/session-exercises/:sessionId", async (req, res) => {
    const sessionId = parseInt(req.params.sessionId);
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const exercises = await storage.getSessionExercises(sessionId);
    res.json(exercises);
  });
  
  app.post("/api/session-exercises", async (req, res) => {
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
  
  app.patch("/api/session-exercises/:id/complete", async (req, res) => {
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
  
  // Progress routes
  app.get("/api/progress/:patientId", async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    
    const records = await storage.getProgressRecords(patientId);
    res.json(records);
  });
  
  app.post("/api/progress", async (req, res) => {
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
  
  // Engagement routes
  app.get("/api/engagement/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const metrics = await storage.getEngagementMetrics(userId);
    res.json(metrics);
  });
  
  app.get("/api/engagement/:userId/latest", async (req, res) => {
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
  
  app.post("/api/engagement", async (req, res) => {
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
  
  app.patch("/api/engagement/:userId/streak", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const { streak } = req.body;
    if (typeof streak !== 'number' || streak < 0) {
      return res.status(400).json({ message: "Invalid streak value" });
    }
    
    const updated = await storage.updateEngagementStreak(userId, streak);
    if (!updated) {
      return res.status(404).json({ message: "Engagement metric not found" });
    }
    
    res.json(updated);
  });
  
  // Therapist Notes routes
  app.get("/api/therapist-notes/:patientId", async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    
    const notes = await storage.getTherapistNotes(patientId);
    res.json(notes);
  });
  
  app.post("/api/therapist-notes", async (req, res) => {
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
  
  // Payment routes
  app.get("/api/payments/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const payments = await storage.getPaymentRecords(userId);
    res.json(payments);
  });
  
  app.post("/api/payments", async (req, res) => {
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
  
  app.patch("/api/payments/:id/status", async (req, res) => {
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

  const httpServer = createServer(app);
  
  return httpServer;
}
