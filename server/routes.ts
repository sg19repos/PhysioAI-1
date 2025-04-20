import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPatientSchema, 
  insertExerciseSchema,
  insertPatientExerciseSchema,
  insertSessionSchema,
  insertProgressMeasurementSchema,
  insertAlertSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiRouter = express.Router();
  
  // Error handling middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: err.errors 
      });
    }
    return res.status(500).json({ message: err.message || "Internal server error" });
  };

  // Users endpoints
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Patients endpoints
  apiRouter.post("/patients", async (req: Request, res: Response) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.get("/patients/:id", async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const patient = await storage.getPatient(patientId);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      res.json(patient);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.get("/therapists/:id/patients", async (req: Request, res: Response) => {
    try {
      const therapistId = parseInt(req.params.id);
      const patients = await storage.getPatientsByTherapistId(therapistId);
      res.json(patients);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.patch("/patients/:id/engagement", async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const { score } = req.body;
      
      if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json({ message: "Score must be a number between 0 and 100" });
      }
      
      const patient = await storage.updatePatientEngagement(patientId, score);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      res.json(patient);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Exercises endpoints
  apiRouter.get("/exercises", async (_req: Request, res: Response) => {
    try {
      const exercises = await storage.getAllExercises();
      res.json(exercises);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.get("/exercises/:id", async (req: Request, res: Response) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const exercise = await storage.getExercise(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.json(exercise);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.post("/exercises", async (req: Request, res: Response) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.get("/exercises/body-part/:bodyPart", async (req: Request, res: Response) => {
    try {
      const { bodyPart } = req.params;
      const exercises = await storage.getExercisesByBodyPart(bodyPart);
      res.json(exercises);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Patient Exercises endpoints
  apiRouter.get("/patients/:id/exercises", async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const patientExercises = await storage.getPatientExercisesByPatientId(patientId);
      res.json(patientExercises);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.post("/patient-exercises", async (req: Request, res: Response) => {
    try {
      const patientExerciseData = insertPatientExerciseSchema.parse(req.body);
      const patientExercise = await storage.createPatientExercise(patientExerciseData);
      res.status(201).json(patientExercise);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.patch("/patient-exercises/:id/complete", async (req: Request, res: Response) => {
    try {
      const patientExerciseId = parseInt(req.params.id);
      const { performance, feedback } = req.body;
      
      if (typeof performance !== 'number' || performance < 0 || performance > 100) {
        return res.status(400).json({ message: "Performance must be a number between 0 and 100" });
      }
      
      const patientExercise = await storage.updatePatientExerciseCompletion(
        patientExerciseId, 
        performance, 
        feedback
      );
      
      if (!patientExercise) {
        return res.status(404).json({ message: "Patient exercise not found" });
      }
      
      res.json(patientExercise);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Sessions endpoints
  apiRouter.get("/patients/:id/sessions", async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const sessions = await storage.getSessionsByPatientId(patientId);
      res.json(sessions);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.get("/therapists/:id/active-sessions", async (req: Request, res: Response) => {
    try {
      const therapistId = parseInt(req.params.id);
      const sessions = await storage.getActiveSessionsByTherapistId(therapistId);
      res.json(sessions);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.post("/sessions", async (req: Request, res: Response) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.patch("/sessions/:id/status", async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { status, endTime } = req.body;
      
      if (!['scheduled', 'active', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const session = await storage.updateSessionStatus(
        sessionId, 
        status, 
        endTime ? new Date(endTime) : undefined
      );
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.patch("/sessions/:id/data", async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { postureQuality, rangeOfMotion, painLevel, notes } = req.body;
      
      const session = await storage.updateSessionData(
        sessionId,
        postureQuality,
        rangeOfMotion,
        painLevel,
        notes
      );
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Progress Measurements endpoints
  apiRouter.get("/patients/:id/progress", async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const measurements = await storage.getProgressMeasurementsByPatientId(patientId);
      res.json(measurements);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.post("/progress-measurements", async (req: Request, res: Response) => {
    try {
      const measurementData = insertProgressMeasurementSchema.parse(req.body);
      const measurement = await storage.createProgressMeasurement(measurementData);
      res.status(201).json(measurement);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Alerts endpoints
  apiRouter.get("/alerts", async (_req: Request, res: Response) => {
    try {
      const alerts = await storage.getUnresolvedAlerts();
      res.json(alerts);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.get("/patients/:id/alerts", async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const alerts = await storage.getAlertsByPatientId(patientId);
      res.json(alerts);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.post("/alerts", async (req: Request, res: Response) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.patch("/alerts/:id/status", async (req: Request, res: Response) => {
    try {
      const alertId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['unread', 'read', 'resolved'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const alert = await storage.updateAlertStatus(alertId, status);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      res.json(alert);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // AI Analysis endpoint for posture analysis and exercise recommendations
  apiRouter.post("/ai/analyze-posture", async (req: Request, res: Response) => {
    try {
      const { poseData, patientId, exerciseId } = req.body;
      
      if (!poseData || !Array.isArray(poseData) || !patientId) {
        return res.status(400).json({ message: "Invalid data format" });
      }
      
      // In a real application, this would use TensorFlow.js or a similar library
      // to analyze the pose data and provide feedback
      const feedback = {
        score: Math.round(Math.random() * 40 + 60), // Random score between 60-100
        issues: [],
        correctForm: true
      };
      
      if (feedback.score < 80) {
        feedback.correctForm = false;
        if (exerciseId === 1) { // External rotation exercise
          feedback.issues.push({
            part: "left_arm",
            message: "Keep your elbow closer to your body",
            severity: "medium"
          });
        } else if (exerciseId === 2) { // Wall slides
          feedback.issues.push({
            part: "shoulders",
            message: "Keep shoulders back and down",
            severity: "low"
          });
        }
      }
      
      res.json(feedback);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  apiRouter.post("/ai/recommend-exercises", async (req: Request, res: Response) => {
    try {
      const { patientId, bodyPart, currentExerciseIds } = req.body;
      
      if (!patientId || !bodyPart) {
        return res.status(400).json({ message: "Patient ID and body part are required" });
      }
      
      // Get available exercises for the body part
      const allExercises = await storage.getExercisesByBodyPart(bodyPart);
      
      // Filter out exercises that are already assigned
      const currentIds = currentExerciseIds || [];
      const availableExercises = allExercises.filter(ex => !currentIds.includes(ex.id));
      
      // In a real application, this would use TensorFlow.js or a similar library
      // to recommend exercises based on patient progress and performance
      const recommendations = availableExercises.slice(0, 2).map(exercise => ({
        exercise,
        confidence: Math.round(Math.random() * 40 + 60),
        reason: exercise.difficulty === 'beginner' 
          ? 'Recommended for building foundational strength'
          : 'Recommended to challenge and improve current abilities'
      }));
      
      res.json(recommendations);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Register API routes
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
