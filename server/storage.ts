import { 
  User, InsertUser, Exercise, InsertExercise, Session, InsertSession,
  SessionExercise, InsertSessionExercise, ProgressRecord, InsertProgressRecord,
  EngagementMetric, InsertEngagementMetric, TherapistNote, InsertTherapistNote,
  PaymentRecord, InsertPaymentRecord,
  users, exercises, sessions, sessionExercises, progressRecords, 
  engagementMetrics, therapistNotes, paymentRecords
} from "@shared/schema";
import { eq, desc, count } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Exercise methods
  getExercise(id: number): Promise<Exercise | undefined>;
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByTargetArea(targetArea: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Session methods
  getSession(id: number): Promise<Session | undefined>;
  getSessionsByPatientId(patientId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSessionStatus(id: number, status: string): Promise<Session | undefined>;
  
  // Session Exercise methods
  getSessionExercises(sessionId: number): Promise<SessionExercise[]>;
  createSessionExercise(sessionExercise: InsertSessionExercise): Promise<SessionExercise>;
  completeSessionExercise(id: number, notes?: string): Promise<SessionExercise | undefined>;
  
  // Progress methods
  getProgressRecords(patientId: number): Promise<ProgressRecord[]>;
  createProgressRecord(progressRecord: InsertProgressRecord): Promise<ProgressRecord>;
  
  // Engagement methods
  getEngagementMetrics(userId: number): Promise<EngagementMetric[]>;
  getLatestEngagementMetric(userId: number): Promise<EngagementMetric | undefined>;
  createEngagementMetric(metric: InsertEngagementMetric): Promise<EngagementMetric>;
  updateEngagementStreak(userId: number, streak: number): Promise<EngagementMetric | undefined>;
  
  // Therapist Notes methods
  getTherapistNotes(patientId: number): Promise<TherapistNote[]>;
  createTherapistNote(note: InsertTherapistNote): Promise<TherapistNote>;
  
  // Payment methods
  getPaymentRecords(userId: number): Promise<PaymentRecord[]>;
  createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord>;
  updatePaymentStatus(id: number, status: string, receiptUrl?: string): Promise<PaymentRecord | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exercises: Map<number, Exercise>;
  private sessions: Map<number, Session>;
  private sessionExercises: Map<number, SessionExercise>;
  private progressRecords: Map<number, ProgressRecord>;
  private engagementMetrics: Map<number, EngagementMetric>;
  private therapistNotes: Map<number, TherapistNote>;
  private paymentRecords: Map<number, PaymentRecord>;
  
  private userIdCounter: number;
  private exerciseIdCounter: number;
  private sessionIdCounter: number;
  private sessionExerciseIdCounter: number;
  private progressRecordIdCounter: number;
  private engagementMetricIdCounter: number;
  private therapistNoteIdCounter: number;
  private paymentRecordIdCounter: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.sessions = new Map();
    this.sessionExercises = new Map();
    this.progressRecords = new Map();
    this.engagementMetrics = new Map();
    this.therapistNotes = new Map();
    this.paymentRecords = new Map();
    
    this.userIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.sessionIdCounter = 1;
    this.sessionExerciseIdCounter = 1;
    this.progressRecordIdCounter = 1;
    this.engagementMetricIdCounter = 1;
    this.therapistNoteIdCounter = 1;
    this.paymentRecordIdCounter = 1;
    
    // Initialize with some default data
    this.initDemoData();
  }

  private initDemoData() {
    // Create demo users
    const john: InsertUser = {
      username: "john",
      password: "password123",
      fullName: "John Doe",
      email: "john@example.com",
      userType: "patient"
    };
    
    const drRachel: InsertUser = {
      username: "drrachel",
      password: "password123",
      fullName: "Dr. Rachel Stevens",
      email: "rachel@example.com",
      userType: "therapist"
    };
    
    this.createUser(john);
    this.createUser(drRachel);
    
    // Create some exercises
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
    
    shoulderExercises.forEach(ex => this.createExercise(ex as InsertExercise));
    
    // Create a session
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const session: InsertSession = {
      patientId: 1,
      date: todayStr,
      startTime: new Date().toISOString(),
      status: "scheduled",
      therapistId: 2
    };
    
    const createdSession = this.createSession(session);
    
    // Add exercises to the session
    this.createSessionExercise({
      sessionId: createdSession.id,
      exerciseId: 1,
      sets: 3,
      reps: 12,
      completed: false
    });
    
    // Create progress records
    this.createProgressRecord({
      patientId: 1,
      date: todayStr,
      rangeOfMotion: 142,
      postureQuality: 72,
      painLevel: 3,
      notes: "Improving steadily"
    });
    
    // Create engagement metrics
    this.createEngagementMetric({
      userId: 1,
      date: todayStr,
      sessionsCompleted: 18,
      exercisesCompleted: 72,
      checkInStreak: 4,
      weeklyScore: 85
    });
    
    // Create therapist notes
    this.createTherapistNote({
      therapistId: 2,
      patientId: 1,
      date: todayStr,
      notes: "John has been making excellent progress with his shoulder rehabilitation program. Range of motion has improved significantly in the last two weeks. I've noticed his posture during external rotation exercises needs some refinement. The AI system has been flagging this correctly, and I've added some additional cues to help with proper form.",
      flags: ["progress on track", "new exercises added", "posture correction needed"]
    });
    
    // Create payment records
    const month = today.getMonth();
    const year = today.getFullYear();
    
    for (let i = 0; i < 3; i++) {
      const paymentDate = new Date(year, month - i, 1).toISOString().split('T')[0];
      this.createPaymentRecord({
        userId: 1,
        date: paymentDate,
        amount: 4999, // $49.99
        description: "Premium Rehabilitation Plan - Monthly",
        status: "processed",
        receiptUrl: `/receipts/invoice_${i+1}.pdf`
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date().toISOString() };
    this.users.set(id, newUser);
    return newUser;
  }

  // Exercise methods
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByTargetArea(targetArea: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(
      (exercise) => exercise.targetArea === targetArea
    );
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseIdCounter++;
    const newExercise: Exercise = { ...exercise, id, createdAt: new Date().toISOString() };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  // Session methods
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getSessionsByPatientId(patientId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.patientId === patientId
    );
  }

  async createSession(session: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const newSession: Session = { ...session, id };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async updateSessionStatus(id: number, status: string): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: Session = { ...session, status };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  // Session Exercise methods
  async getSessionExercises(sessionId: number): Promise<SessionExercise[]> {
    return Array.from(this.sessionExercises.values()).filter(
      (se) => se.sessionId === sessionId
    );
  }

  async createSessionExercise(sessionExercise: InsertSessionExercise): Promise<SessionExercise> {
    const id = this.sessionExerciseIdCounter++;
    const newSessionExercise: SessionExercise = { ...sessionExercise, id };
    this.sessionExercises.set(id, newSessionExercise);
    return newSessionExercise;
  }

  async completeSessionExercise(id: number, notes?: string): Promise<SessionExercise | undefined> {
    const sessionExercise = this.sessionExercises.get(id);
    if (!sessionExercise) return undefined;
    
    const updatedExercise: SessionExercise = { 
      ...sessionExercise, 
      completed: true,
      notes: notes || sessionExercise.notes
    };
    
    this.sessionExercises.set(id, updatedExercise);
    return updatedExercise;
  }

  // Progress methods
  async getProgressRecords(patientId: number): Promise<ProgressRecord[]> {
    return Array.from(this.progressRecords.values())
      .filter((record) => record.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createProgressRecord(progressRecord: InsertProgressRecord): Promise<ProgressRecord> {
    const id = this.progressRecordIdCounter++;
    const newRecord: ProgressRecord = { ...progressRecord, id };
    this.progressRecords.set(id, newRecord);
    return newRecord;
  }

  // Engagement methods
  async getEngagementMetrics(userId: number): Promise<EngagementMetric[]> {
    return Array.from(this.engagementMetrics.values())
      .filter((metric) => metric.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getLatestEngagementMetric(userId: number): Promise<EngagementMetric | undefined> {
    const metrics = await this.getEngagementMetrics(userId);
    return metrics.length > 0 ? metrics[0] : undefined;
  }

  async createEngagementMetric(metric: InsertEngagementMetric): Promise<EngagementMetric> {
    const id = this.engagementMetricIdCounter++;
    const newMetric: EngagementMetric = { ...metric, id };
    this.engagementMetrics.set(id, newMetric);
    return newMetric;
  }

  async updateEngagementStreak(userId: number, streak: number): Promise<EngagementMetric | undefined> {
    const latest = await this.getLatestEngagementMetric(userId);
    if (!latest) return undefined;
    
    const updated: EngagementMetric = { ...latest, checkInStreak: streak };
    this.engagementMetrics.set(latest.id, updated);
    return updated;
  }

  // Therapist Notes methods
  async getTherapistNotes(patientId: number): Promise<TherapistNote[]> {
    return Array.from(this.therapistNotes.values())
      .filter((note) => note.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTherapistNote(note: InsertTherapistNote): Promise<TherapistNote> {
    const id = this.therapistNoteIdCounter++;
    const newNote: TherapistNote = { ...note, id };
    this.therapistNotes.set(id, newNote);
    return newNote;
  }

  // Payment methods
  async getPaymentRecords(userId: number): Promise<PaymentRecord[]> {
    return Array.from(this.paymentRecords.values())
      .filter((payment) => payment.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord> {
    const id = this.paymentRecordIdCounter++;
    const newPayment: PaymentRecord = { ...payment, id };
    this.paymentRecords.set(id, newPayment);
    return newPayment;
  }

  async updatePaymentStatus(id: number, status: string, receiptUrl?: string): Promise<PaymentRecord | undefined> {
    const payment = this.paymentRecords.get(id);
    if (!payment) return undefined;
    
    const updatedPayment: PaymentRecord = { 
      ...payment, 
      status,
      receiptUrl: receiptUrl || payment.receiptUrl
    };
    
    this.paymentRecords.set(id, updatedPayment);
    return updatedPayment;
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Exercise methods
  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise || undefined;
  }

  async getAllExercises(): Promise<Exercise[]> {
    return db.select().from(exercises);
  }

  async getExercisesByTargetArea(targetArea: string): Promise<Exercise[]> {
    return db.select().from(exercises).where(eq(exercises.targetArea, targetArea));
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db
      .insert(exercises)
      .values(exercise)
      .returning();
    return newExercise;
  }

  // Session methods
  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async getSessionsByPatientId(patientId: number): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.patientId, patientId));
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateSessionStatus(id: number, status: string): Promise<Session | undefined> {
    const [updatedSession] = await db
      .update(sessions)
      .set({ status })
      .where(eq(sessions.id, id))
      .returning();
    return updatedSession || undefined;
  }

  // Session Exercise methods
  async getSessionExercises(sessionId: number): Promise<SessionExercise[]> {
    return db
      .select()
      .from(sessionExercises)
      .where(eq(sessionExercises.sessionId, sessionId));
  }

  async createSessionExercise(sessionExercise: InsertSessionExercise): Promise<SessionExercise> {
    const [newSessionExercise] = await db
      .insert(sessionExercises)
      .values(sessionExercise)
      .returning();
    return newSessionExercise;
  }

  async completeSessionExercise(id: number, notes?: string): Promise<SessionExercise | undefined> {
    const updateData: Partial<SessionExercise> = { completed: true };
    if (notes) {
      updateData.notes = notes;
    }

    const [updatedExercise] = await db
      .update(sessionExercises)
      .set(updateData)
      .where(eq(sessionExercises.id, id))
      .returning();
    return updatedExercise || undefined;
  }

  // Progress methods
  async getProgressRecords(patientId: number): Promise<ProgressRecord[]> {
    return db
      .select()
      .from(progressRecords)
      .where(eq(progressRecords.patientId, patientId))
      .orderBy(desc(progressRecords.date));
  }

  async createProgressRecord(progressRecord: InsertProgressRecord): Promise<ProgressRecord> {
    const [newRecord] = await db
      .insert(progressRecords)
      .values(progressRecord)
      .returning();
    return newRecord;
  }

  // Engagement methods
  async getEngagementMetrics(userId: number): Promise<EngagementMetric[]> {
    return db
      .select()
      .from(engagementMetrics)
      .where(eq(engagementMetrics.userId, userId))
      .orderBy(desc(engagementMetrics.date));
  }

  async getLatestEngagementMetric(userId: number): Promise<EngagementMetric | undefined> {
    const [metric] = await db
      .select()
      .from(engagementMetrics)
      .where(eq(engagementMetrics.userId, userId))
      .orderBy(desc(engagementMetrics.date))
      .limit(1);
    return metric || undefined;
  }

  async createEngagementMetric(metric: InsertEngagementMetric): Promise<EngagementMetric> {
    const [newMetric] = await db
      .insert(engagementMetrics)
      .values(metric)
      .returning();
    return newMetric;
  }

  async updateEngagementStreak(userId: number, streak: number): Promise<EngagementMetric | undefined> {
    const latestMetric = await this.getLatestEngagementMetric(userId);
    if (!latestMetric) return undefined;

    const [updatedMetric] = await db
      .update(engagementMetrics)
      .set({ checkInStreak: streak })
      .where(eq(engagementMetrics.id, latestMetric.id))
      .returning();
    return updatedMetric || undefined;
  }

  // Therapist Notes methods
  async getTherapistNotes(patientId: number): Promise<TherapistNote[]> {
    return db
      .select()
      .from(therapistNotes)
      .where(eq(therapistNotes.patientId, patientId))
      .orderBy(desc(therapistNotes.date));
  }

  async createTherapistNote(note: InsertTherapistNote): Promise<TherapistNote> {
    const [newNote] = await db
      .insert(therapistNotes)
      .values(note)
      .returning();
    return newNote;
  }

  // Payment methods
  async getPaymentRecords(userId: number): Promise<PaymentRecord[]> {
    return db
      .select()
      .from(paymentRecords)
      .where(eq(paymentRecords.userId, userId))
      .orderBy(desc(paymentRecords.date));
  }

  async createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord> {
    const [newPayment] = await db
      .insert(paymentRecords)
      .values(payment)
      .returning();
    return newPayment;
  }

  async updatePaymentStatus(id: number, status: string, receiptUrl?: string): Promise<PaymentRecord | undefined> {
    const updateData: Partial<PaymentRecord> = { status };
    if (receiptUrl) {
      updateData.receiptUrl = receiptUrl;
    }

    const [updatedPayment] = await db
      .update(paymentRecords)
      .set(updateData)
      .where(eq(paymentRecords.id, id))
      .returning();
    return updatedPayment || undefined;
  }
}

// Initialize with demo data if no production database is configured
const initializeDatabase = async () => {
  try {
    // Check if users table has data
    const userCount = await db.select({ count: count() }).from(users);
    
    if (userCount[0].count === 0) {
      // Add demo users
      const john: InsertUser = {
        username: "john",
        password: "password123",
        fullName: "John Doe",
        email: "john@example.com",
        userType: "patient"
      };
      
      const drRachel: InsertUser = {
        username: "drrachel",
        password: "password123",
        fullName: "Dr. Rachel Stevens",
        email: "rachel@example.com",
        userType: "therapist"
      };
      
      await db.insert(users).values([john, drRachel]);
      
      // Add demo exercises
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
      
      await db.insert(exercises).values(shoulderExercises);
      
      // Create a session
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const [session] = await db.insert(sessions).values({
        patientId: 1,
        date: todayStr,
        startTime: new Date().toISOString(),
        status: "scheduled",
        therapistId: 2
      }).returning();
      
      // Add exercises to the session
      await db.insert(sessionExercises).values({
        sessionId: session.id,
        exerciseId: 1,
        sets: 3,
        reps: 12,
        completed: false
      });
      
      // Create progress records
      await db.insert(progressRecords).values({
        patientId: 1,
        date: todayStr,
        rangeOfMotion: 142,
        postureQuality: 72,
        painLevel: 3,
        notes: "Improving steadily"
      });
      
      // Create engagement metrics
      await db.insert(engagementMetrics).values({
        userId: 1,
        date: todayStr,
        sessionsCompleted: 18,
        exercisesCompleted: 72,
        checkInStreak: 4,
        weeklyScore: 85
      });
      
      // Create therapist notes
      await db.insert(therapistNotes).values({
        therapistId: 2,
        patientId: 1,
        date: todayStr,
        notes: "John has been making excellent progress with his shoulder rehabilitation program. Range of motion has improved significantly in the last two weeks. I've noticed his posture during external rotation exercises needs some refinement. The AI system has been flagging this correctly, and I've added some additional cues to help with proper form.",
        flags: ["progress on track", "new exercises added", "posture correction needed"]
      });
      
      // Create payment records
      const month = today.getMonth();
      const year = today.getFullYear();
      
      const payments = [];
      for (let i = 0; i < 3; i++) {
        const paymentDate = new Date(year, month - i, 1).toISOString().split('T')[0];
        payments.push({
          userId: 1,
          date: paymentDate,
          amount: 4999, // $49.99
          description: "Premium Rehabilitation Plan - Monthly",
          status: "processed",
          receiptUrl: `/receipts/invoice_${i+1}.pdf`
        });
      }
      
      await db.insert(paymentRecords).values(payments);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Skip database initialization due to connection issues
// initializeDatabase().catch(console.error);

// Use in-memory storage instead due to database connection issues
console.log("Using in-memory storage due to database connection issues");
export const storage = new MemStorage();
