import { 
  User, InsertUser, users,
  Patient, InsertPatient, patients,
  Exercise, InsertExercise, exercises,
  PatientExercise, InsertPatientExercise, patientExercises,
  Session, InsertSession, sessions,
  ProgressMeasurement, InsertProgressMeasurement, progressMeasurements,
  Alert, InsertAlert, alerts
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient operations
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByUserId(userId: number): Promise<Patient | undefined>;
  getPatientsByTherapistId(therapistId: number): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatientEngagement(id: number, score: number): Promise<Patient | undefined>;
  updatePatientStatus(id: number, status: string): Promise<Patient | undefined>;
  
  // Exercise operations
  getExercise(id: number): Promise<Exercise | undefined>;
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // PatientExercise operations
  getPatientExercise(id: number): Promise<PatientExercise | undefined>;
  getPatientExercisesByPatientId(patientId: number): Promise<PatientExercise[]>;
  createPatientExercise(patientExercise: InsertPatientExercise): Promise<PatientExercise>;
  updatePatientExerciseCompletion(id: number, performance: number, feedback?: string): Promise<PatientExercise | undefined>;
  
  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  getSessionsByPatientId(patientId: number): Promise<Session[]>;
  getActiveSessionsByTherapistId(therapistId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSessionStatus(id: number, status: string, endTime?: Date): Promise<Session | undefined>;
  updateSessionData(id: number, postureQuality?: number, rangeOfMotion?: any, painLevel?: number, notes?: string): Promise<Session | undefined>;
  
  // ProgressMeasurement operations
  getProgressMeasurement(id: number): Promise<ProgressMeasurement | undefined>;
  getProgressMeasurementsByPatientId(patientId: number): Promise<ProgressMeasurement[]>;
  createProgressMeasurement(measurement: InsertProgressMeasurement): Promise<ProgressMeasurement>;
  
  // Alert operations
  getAlert(id: number): Promise<Alert | undefined>;
  getAlertsByPatientId(patientId: number): Promise<Alert[]>;
  getUnresolvedAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlertStatus(id: number, status: string): Promise<Alert | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private exercises: Map<number, Exercise>;
  private patientExercises: Map<number, PatientExercise>;
  private sessions: Map<number, Session>;
  private progressMeasurements: Map<number, ProgressMeasurement>;
  private alerts: Map<number, Alert>;
  
  private userIdCounter: number;
  private patientIdCounter: number;
  private exerciseIdCounter: number;
  private patientExerciseIdCounter: number;
  private sessionIdCounter: number;
  private progressMeasurementIdCounter: number;
  private alertIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.exercises = new Map();
    this.patientExercises = new Map();
    this.sessions = new Map();
    this.progressMeasurements = new Map();
    this.alerts = new Map();
    
    this.userIdCounter = 1;
    this.patientIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.patientExerciseIdCounter = 1;
    this.sessionIdCounter = 1;
    this.progressMeasurementIdCounter = 1;
    this.alertIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }
  
  async getPatientByUserId(userId: number): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.userId === userId,
    );
  }
  
  async getPatientsByTherapistId(therapistId: number): Promise<Patient[]> {
    return Array.from(this.patients.values()).filter(
      (patient) => patient.therapistId === therapistId,
    );
  }
  
  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientIdCounter++;
    const patient: Patient = { 
      ...insertPatient, 
      id, 
      startDate: new Date(),
      engagementScore: 0,
    };
    this.patients.set(id, patient);
    return patient;
  }
  
  async updatePatientEngagement(id: number, score: number): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updatedPatient = { 
      ...patient, 
      engagementScore: score,
      lastCheckIn: new Date()
    };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }
  
  async updatePatientStatus(id: number, status: string): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updatedPatient = { ...patient, status };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }
  
  // Exercise operations
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }
  
  async getAllExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }
  
  async getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(
      (exercise) => exercise.bodyPart === bodyPart,
    );
  }
  
  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseIdCounter++;
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }
  
  // PatientExercise operations
  async getPatientExercise(id: number): Promise<PatientExercise | undefined> {
    return this.patientExercises.get(id);
  }
  
  async getPatientExercisesByPatientId(patientId: number): Promise<PatientExercise[]> {
    return Array.from(this.patientExercises.values()).filter(
      (patientExercise) => patientExercise.patientId === patientId,
    );
  }
  
  async createPatientExercise(insertPatientExercise: InsertPatientExercise): Promise<PatientExercise> {
    const id = this.patientExerciseIdCounter++;
    const patientExercise: PatientExercise = { 
      ...insertPatientExercise, 
      id,
      completed: false,
      assignedDate: new Date(),
      performance: 0
    };
    this.patientExercises.set(id, patientExercise);
    return patientExercise;
  }
  
  async updatePatientExerciseCompletion(id: number, performance: number, feedback?: string): Promise<PatientExercise | undefined> {
    const patientExercise = this.patientExercises.get(id);
    if (!patientExercise) return undefined;
    
    const updatedPatientExercise = { 
      ...patientExercise, 
      completed: true,
      completedDate: new Date(),
      performance,
      feedback
    };
    this.patientExercises.set(id, updatedPatientExercise);
    return updatedPatientExercise;
  }
  
  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }
  
  async getSessionsByPatientId(patientId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.patientId === patientId,
    );
  }
  
  async getActiveSessionsByTherapistId(therapistId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.therapistId === therapistId && session.status === 'active',
    );
  }
  
  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const session: Session = { 
      ...insertSession, 
      id,
      startTime: insertSession.startTime || new Date()
    };
    this.sessions.set(id, session);
    return session;
  }
  
  async updateSessionStatus(id: number, status: string, endTime?: Date): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { 
      ...session, 
      status,
      endTime: endTime || (status === 'completed' ? new Date() : session.endTime)
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  
  async updateSessionData(id: number, postureQuality?: number, rangeOfMotion?: any, painLevel?: number, notes?: string): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { 
      ...session,
      postureQuality: postureQuality !== undefined ? postureQuality : session.postureQuality,
      rangeOfMotion: rangeOfMotion !== undefined ? rangeOfMotion : session.rangeOfMotion,
      painLevel: painLevel !== undefined ? painLevel : session.painLevel,
      notes: notes !== undefined ? notes : session.notes
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  
  // ProgressMeasurement operations
  async getProgressMeasurement(id: number): Promise<ProgressMeasurement | undefined> {
    return this.progressMeasurements.get(id);
  }
  
  async getProgressMeasurementsByPatientId(patientId: number): Promise<ProgressMeasurement[]> {
    return Array.from(this.progressMeasurements.values()).filter(
      (measurement) => measurement.patientId === patientId,
    );
  }
  
  async createProgressMeasurement(insertMeasurement: InsertProgressMeasurement): Promise<ProgressMeasurement> {
    const id = this.progressMeasurementIdCounter++;
    const measurement: ProgressMeasurement = { 
      ...insertMeasurement, 
      id,
      date: new Date()
    };
    this.progressMeasurements.set(id, measurement);
    return measurement;
  }
  
  // Alert operations
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }
  
  async getAlertsByPatientId(patientId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.patientId === patientId,
    );
  }
  
  async getUnresolvedAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.status !== 'resolved',
    );
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertIdCounter++;
    const alert: Alert = { 
      ...insertAlert, 
      id,
      date: new Date(),
      status: 'unread'
    };
    this.alerts.set(id, alert);
    return alert;
  }
  
  async updateAlertStatus(id: number, status: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, status };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
  
  // Initialize sample data for demo purposes
  private initializeSampleData() {
    // Create sample therapist
    const therapist: User = {
      id: this.userIdCounter++,
      username: 'drsarah',
      password: 'password123',
      fullName: 'Dr. Sarah Reynolds',
      role: 'therapist',
      createdAt: new Date(),
    };
    this.users.set(therapist.id, therapist);
    
    // Create sample patient
    const patient: User = {
      id: this.userIdCounter++,
      username: 'johndoe',
      password: 'password123',
      fullName: 'John Doe',
      role: 'patient',
      createdAt: new Date(),
    };
    this.users.set(patient.id, patient);
    
    // Create patient record
    const patientRecord: Patient = {
      id: this.patientIdCounter++,
      userId: patient.id,
      condition: 'Shoulder Rehabilitation',
      injury: 'Rotator Cuff Tear',
      startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 4 weeks ago
      targetEndDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000), // 8 weeks from now
      status: 'active',
      therapistId: therapist.id,
      engagementScore: 85,
      lastCheckIn: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    };
    this.patients.set(patientRecord.id, patientRecord);
    
    // Create sample exercises
    const exercises: Exercise[] = [
      {
        id: this.exerciseIdCounter++,
        name: 'External Rotation with Band',
        description: 'Targets rotator cuff muscles to improve shoulder stability',
        difficulty: 'intermediate',
        bodyPart: 'shoulder',
        instructions: 'Stand with elbow at side, bent to 90 degrees. Hold resistance band and rotate arm outward, keeping elbow at side. Return slowly to start position.',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        createdBy: therapist.id,
      },
      {
        id: this.exerciseIdCounter++,
        name: 'Wall Slides',
        description: 'Improves shoulder mobility and posture',
        difficulty: 'beginner',
        bodyPart: 'shoulder',
        instructions: 'Stand with back against wall, elbows and wrists touching wall. Slide arms up the wall while maintaining contact, then return to starting position.',
        imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        createdBy: therapist.id,
      },
      {
        id: this.exerciseIdCounter++,
        name: 'Prone Scapular Retraction',
        description: 'Strengthens middle back muscles to improve posture',
        difficulty: 'intermediate',
        bodyPart: 'shoulder',
        instructions: 'Lie on stomach with arms at sides, thumbs up. Lift arms by squeezing shoulder blades together. Hold briefly, then lower slowly.',
        imageUrl: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        createdBy: therapist.id,
      },
      {
        id: this.exerciseIdCounter++,
        name: 'Internal Rotation Stretch',
        description: 'Increases range of motion for internal shoulder rotation',
        difficulty: 'beginner',
        bodyPart: 'shoulder',
        instructions: 'Place hand behind lower back. Use other hand to gently pull elbow forward. Feel stretch in shoulder, hold for 30 seconds.',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        createdBy: therapist.id,
      },
    ];
    
    exercises.forEach(exercise => {
      this.exercises.set(exercise.id, exercise);
    });
    
    // Create patient exercises
    const patientExercises: PatientExercise[] = [
      {
        id: this.patientExerciseIdCounter++,
        patientId: patientRecord.id,
        exerciseId: 1, // External Rotation
        sets: 3,
        reps: 12,
        assigned: true,
        completed: true,
        assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        performance: 70,
        feedback: 'Good effort, but work on keeping elbow against body',
      },
      {
        id: this.patientExerciseIdCounter++,
        patientId: patientRecord.id,
        exerciseId: 2, // Wall Slides
        sets: 3,
        reps: 10,
        assigned: true,
        completed: true,
        assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        performance: 85,
        feedback: 'Excellent form, maintain contact with wall',
      },
      {
        id: this.patientExerciseIdCounter++,
        patientId: patientRecord.id,
        exerciseId: 3, // Prone Scapular Retraction
        sets: 3,
        reps: 15,
        assigned: true,
        completed: false,
        assignedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: this.patientExerciseIdCounter++,
        patientId: patientRecord.id,
        exerciseId: 4, // Internal Rotation Stretch
        sets: 3,
        reps: 1,
        durationSeconds: 30,
        assigned: true,
        completed: false,
        assignedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];
    
    patientExercises.forEach(patientExercise => {
      this.patientExercises.set(patientExercise.id, patientExercise);
    });
    
    // Create active session
    const activeSession: Session = {
      id: this.sessionIdCounter++,
      patientId: patientRecord.id,
      therapistId: therapist.id,
      startTime: new Date(),
      status: 'active',
      notes: 'Focus on shoulder external rotation',
    };
    this.sessions.set(activeSession.id, activeSession);
    
    // Create progress measurements
    const progressMeasurements: ProgressMeasurement[] = [
      {
        id: this.progressMeasurementIdCounter++,
        patientId: patientRecord.id,
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 4 weeks ago
        rangeOfMotion: { flexion: 90, extension: 20, abduction: 85, externalRotation: 30, internalRotation: 40 },
        postureQuality: 60,
        strength: 50,
        painLevel: 7,
        notes: 'Initial assessment',
      },
      {
        id: this.progressMeasurementIdCounter++,
        patientId: patientRecord.id,
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
        rangeOfMotion: { flexion: 100, extension: 25, abduction: 95, externalRotation: 35, internalRotation: 45 },
        postureQuality: 65,
        strength: 55,
        painLevel: 6,
        notes: 'Showing improvement',
      },
      {
        id: this.progressMeasurementIdCounter++,
        patientId: patientRecord.id,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
        rangeOfMotion: { flexion: 110, extension: 30, abduction: 105, externalRotation: 40, internalRotation: 50 },
        postureQuality: 70,
        strength: 60,
        painLevel: 5,
        notes: 'Good progress on ROM',
      },
      {
        id: this.progressMeasurementIdCounter++,
        patientId: patientRecord.id,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        rangeOfMotion: { flexion: 120, extension: 35, abduction: 115, externalRotation: 45, internalRotation: 55 },
        postureQuality: 75,
        strength: 65,
        painLevel: 4,
        notes: 'Continued improvement',
      },
    ];
    
    progressMeasurements.forEach(measurement => {
      this.progressMeasurements.set(measurement.id, measurement);
    });
    
    // Create alerts
    const alerts: Alert[] = [
      {
        id: this.alertIdCounter++,
        patientId: patientRecord.id,
        type: 'missed_session',
        message: 'Missed scheduled session on Monday',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'unread',
        priority: 'high',
      },
      {
        id: this.alertIdCounter++,
        patientId: patientRecord.id,
        type: 'form_correction',
        message: 'External rotation exercise form needs correction',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'unread',
        priority: 'medium',
      },
      {
        id: this.alertIdCounter++,
        patientId: patientRecord.id,
        type: 'progress_milestone',
        message: 'Achieved 120° shoulder flexion',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        status: 'read',
        priority: 'low',
      },
    ];
    
    alerts.forEach(alert => {
      this.alerts.set(alert.id, alert);
    });
  }
}

// Export singleton storage instance
export const storage = new MemStorage();
