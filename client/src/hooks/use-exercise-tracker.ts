import { useState, useCallback, useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { analyzeExerciseForm, ExerciseType, getPoseFeedback } from '@/lib/exercise-analyzer';
import { Exercise } from '@shared/schema';

interface ExerciseTrackerResult {
  repetitionCount: number;
  exerciseProgress: number;
  feedbackMessages: string[];
  postureFeedback: string[];
  registerPose: (pose: poseDetection.Pose, exercise: Exercise | undefined) => void;
  startExercise: () => void;
  stopExercise: () => void;
  resetExercise: () => void;
}

export const useExerciseTracker = (): ExerciseTrackerResult => {
  const [repetitionCount, setRepetitionCount] = useState<number>(0);
  const [exerciseProgress, setExerciseProgress] = useState<number>(0);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [postureFeedback, setPostureFeedback] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  
  // Reference values for tracking exercise state
  const exerciseStateRef = useRef({
    inRepetition: false,
    currentAngle: 0,
    repetitionThreshold: 30, // The angle change required to count as a rep
    lastFeedbackTime: 0,
    poseHistory: [] as poseDetection.Pose[],
    feedbackCooldown: 2000, // 2 seconds between feedback messages
  });

  // Reset all exercise tracking
  const resetExercise = useCallback(() => {
    setRepetitionCount(0);
    setExerciseProgress(0);
    setFeedbackMessages([]);
    setPostureFeedback([]);
    exerciseStateRef.current = {
      inRepetition: false,
      currentAngle: 0,
      repetitionThreshold: 30,
      lastFeedbackTime: 0,
      poseHistory: [],
      feedbackCooldown: 2000
    };
  }, []);

  // Start exercise tracking
  const startExercise = useCallback(() => {
    resetExercise();
    setIsTracking(true);
  }, [resetExercise]);

  // Stop exercise tracking
  const stopExercise = useCallback(() => {
    setIsTracking(false);
  }, []);

  // Process pose data for exercise tracking
  const registerPose = useCallback((pose: poseDetection.Pose, exercise: Exercise | undefined) => {
    if (!isTracking || !pose || !pose.keypoints || !exercise) {
      return;
    }

    // Add pose to history
    const maxHistoryLength = 10;
    exerciseStateRef.current.poseHistory.push(pose);
    if (exerciseStateRef.current.poseHistory.length > maxHistoryLength) {
      exerciseStateRef.current.poseHistory.shift();
    }

    // Determine exercise type from name or target area
    let exerciseType: ExerciseType = 'shoulderFlexion'; // Default
    
    if (exercise.name.toLowerCase().includes('external rotation')) {
      exerciseType = 'shoulderExternalRotation';
    } else if (exercise.name.toLowerCase().includes('retraction')) {
      exerciseType = 'scapularRetraction';
    } else if (exercise.name.toLowerCase().includes('pendulum')) {
      exerciseType = 'pendulumExercise';
    }

    // Analyze exercise form
    const analysis = analyzeExerciseForm(pose, exerciseType);
    
    // Track the current angle as we get it
    exerciseStateRef.current.currentAngle = analysis.angle;

    // Determine thresholds based on exercise type
    let upThreshold = 45;
    let downThreshold = 20;
    
    if (exerciseType === 'shoulderFlexion') {
      upThreshold = 60;
      downThreshold = 30;
    } else if (exerciseType === 'shoulderExternalRotation') {
      upThreshold = 30;
      downThreshold = 15;
    } else if (exerciseType === 'scapularRetraction') {
      upThreshold = 120; // Wider shoulder distance
      downThreshold = 100; // Narrower shoulder distance
    }
    
    // Update repetition threshold based on exercise
    exerciseStateRef.current.repetitionThreshold = upThreshold;

    // Provide instant feedback if form is incorrect
    if (!analysis.isCorrectForm && analysis.issues.length > 0) {
      const now = Date.now();
      if (now - exerciseStateRef.current.lastFeedbackTime > exerciseStateRef.current.feedbackCooldown) {
        setPostureFeedback(analysis.issues);
        exerciseStateRef.current.lastFeedbackTime = now;
      }
    } else if (analysis.isCorrectForm) {
      // Clear negative feedback when form is good to provide positive reinforcement
      if (postureFeedback.length > 0) {
        setPostureFeedback([]);
      }
      
      // Update repetition count based on angle changes
      if (!exerciseStateRef.current.inRepetition && analysis.angle > upThreshold) {
        // Starting a repetition
        exerciseStateRef.current.inRepetition = true;
        
        // Provide positive feedback occasionally
        const now = Date.now();
        if (now - exerciseStateRef.current.lastFeedbackTime > exerciseStateRef.current.feedbackCooldown * 2) {
          setPostureFeedback(["Good form! Keep going."]);
          exerciseStateRef.current.lastFeedbackTime = now;
        }
      } else if (exerciseStateRef.current.inRepetition && analysis.angle < downThreshold) {
        // Completing a repetition
        exerciseStateRef.current.inRepetition = false;
        const newCount = repetitionCount + 1;
        setRepetitionCount(newCount);
        
        // Calculate progress based on current exercise
        const maxReps = exercise.reps || 12;
        const maxSets = exercise.sets || 3;
        const totalReps = maxReps * maxSets;
        const newProgress = (newCount / totalReps) * 100;
        setExerciseProgress(Math.min(newProgress, 100));
        
        // Add encouraging feedback message
        if (newCount % 5 === 0) {
          // Every 5 reps, give extra encouragement
          setFeedbackMessages(prev => [...prev.slice(-4), `Great job! ${newCount} repetitions completed!`]);
        } else {
          setFeedbackMessages(prev => [...prev.slice(-4), `Repetition ${newCount} completed`]);
        }
        
        // Check if set is complete
        if (newCount % maxReps === 0) {
          const currentSet = Math.ceil(newCount / maxReps);
          if (currentSet < maxSets) {
            setPostureFeedback([`Set ${currentSet} complete! Take a short break, then continue.`]);
          } else {
            setPostureFeedback([`All sets complete! Great work!`]);
          }
          exerciseStateRef.current.lastFeedbackTime = Date.now();
        }
      }
    }
  }, [isTracking, repetitionCount, postureFeedback]);

  return {
    repetitionCount,
    exerciseProgress,
    feedbackMessages,
    postureFeedback,
    registerPose,
    startExercise,
    stopExercise,
    resetExercise
  };
};
