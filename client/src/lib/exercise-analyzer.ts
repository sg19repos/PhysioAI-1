import * as poseDetection from '@tensorflow-models/pose-detection';
import { calculateAngle, getKeypoint } from './pose-detection';

export type ExerciseType = 
  | 'shoulderFlexion'
  | 'shoulderExternalRotation'
  | 'scapularRetraction'
  | 'pendulumExercise';

interface ExerciseAnalysis {
  isCorrectForm: boolean;
  angle: number;
  issues: string[];
}

// Analyze exercise form based on pose data
export function analyzeExerciseForm(
  pose: poseDetection.Pose,
  exerciseType: ExerciseType
): ExerciseAnalysis {
  switch (exerciseType) {
    case 'shoulderFlexion':
      return analyzeShoulderFlexion(pose);
    case 'shoulderExternalRotation':
      return analyzeShoulderExternalRotation(pose);
    case 'scapularRetraction':
      return analyzeScapularRetraction(pose);
    case 'pendulumExercise':
      return analyzePendulumExercise(pose);
    default:
      return { isCorrectForm: false, angle: 0, issues: ['Unknown exercise type'] };
  }
}

// Analyze shoulder flexion exercise
function analyzeShoulderFlexion(pose: poseDetection.Pose): ExerciseAnalysis {
  const issues: string[] = [];
  let isCorrectForm = true;
  let angle = 0;
  
  // Get relevant keypoints
  const shoulder = getKeypoint(pose, 'right_shoulder');
  const elbow = getKeypoint(pose, 'right_elbow');
  const wrist = getKeypoint(pose, 'right_wrist');
  const hip = getKeypoint(pose, 'right_hip');
  
  // Check if we have all needed keypoints
  if (!shoulder || !elbow || !wrist || !hip) {
    return {
      isCorrectForm: false,
      angle: 0,
      issues: ['Cannot detect all required body points. Please adjust your position.']
    };
  }
  
  // Calculate shoulder flexion angle (between hip, shoulder, and elbow)
  angle = calculateAngle(hip, shoulder, elbow);
  
  // Check if arm is raised to appropriate height
  if (angle < 45) {
    issues.push('Raise your arm higher');
    isCorrectForm = false;
  }
  
  // Check if arm is straight
  const elbowAngle = calculateAngle(shoulder, elbow, wrist);
  if (elbowAngle < 160) {
    issues.push('Keep your arm straight during the movement');
    isCorrectForm = false;
  }
  
  // Check shoulder alignment
  const leftShoulder = getKeypoint(pose, 'left_shoulder');
  if (leftShoulder && shoulder) {
    const shoulderDiff = Math.abs(leftShoulder.y - shoulder.y);
    if (shoulderDiff > 30) {
      issues.push('Keep your shoulders level');
      isCorrectForm = false;
    }
  }
  
  return { isCorrectForm, angle, issues };
}

// Analyze shoulder external rotation exercise
function analyzeShoulderExternalRotation(pose: poseDetection.Pose): ExerciseAnalysis {
  const issues: string[] = [];
  let isCorrectForm = true;
  let angle = 0;
  
  // Get relevant keypoints
  const shoulder = getKeypoint(pose, 'right_shoulder');
  const elbow = getKeypoint(pose, 'right_elbow');
  const wrist = getKeypoint(pose, 'right_wrist');
  
  // Check if we have all needed keypoints
  if (!shoulder || !elbow || !wrist) {
    return {
      isCorrectForm: false,
      angle: 0,
      issues: ['Cannot detect all required body points. Please adjust your position.']
    };
  }
  
  // For external rotation, we primarily look at the angle between shoulder, elbow, and wrist
  angle = calculateAngle(shoulder, elbow, wrist);
  
  // Check if elbow is at correct position (close to the body)
  const hipPoint = getKeypoint(pose, 'right_hip');
  if (hipPoint && elbow) {
    const elbowHipDistance = Math.sqrt(
      Math.pow(elbow.x - hipPoint.x, 2) + Math.pow(elbow.y - hipPoint.y, 2)
    );
    
    if (elbowHipDistance > 50) {
      issues.push('Keep your elbow close to your body');
      isCorrectForm = false;
    }
  }
  
  // Check if hand is moving outward enough
  if (angle < 30) {
    issues.push('Rotate your arm outward more');
    isCorrectForm = false;
  }
  
  return { isCorrectForm, angle, issues };
}

// Analyze scapular retraction exercise
function analyzeScapularRetraction(pose: poseDetection.Pose): ExerciseAnalysis {
  const issues: string[] = [];
  let isCorrectForm = true;
  let angle = 0;
  
  // Get relevant keypoints
  const leftShoulder = getKeypoint(pose, 'left_shoulder');
  const rightShoulder = getKeypoint(pose, 'right_shoulder');
  const spine = { 
    x: (leftShoulder?.x || 0 + rightShoulder?.x || 0) / 2,
    y: (leftShoulder?.y || 0 + rightShoulder?.y || 0) / 2 + 40 // Approximate spine point
  };
  
  // Check if we have all needed keypoints
  if (!leftShoulder || !rightShoulder) {
    return {
      isCorrectForm: false,
      angle: 0,
      issues: ['Cannot detect shoulders. Please adjust your position.']
    };
  }
  
  // Calculate shoulder width (distance between shoulders)
  const shoulderWidth = Math.sqrt(
    Math.pow(rightShoulder.x - leftShoulder.x, 2) + 
    Math.pow(rightShoulder.y - leftShoulder.y, 2)
  );
  
  // Use shoulder width as a proxy for retraction
  angle = shoulderWidth;
  
  // Check if shoulders are retracted enough
  const shoulderBaseline = 100; // Baseline value - would be calibrated in a real app
  if (shoulderWidth < shoulderBaseline) {
    issues.push('Pull your shoulder blades together more');
    isCorrectForm = false;
  }
  
  // Check shoulder height alignment
  const shoulderHeightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
  if (shoulderHeightDiff > 20) {
    issues.push('Keep your shoulders level');
    isCorrectForm = false;
  }
  
  return { isCorrectForm, angle, issues };
}

// Analyze pendulum exercise
function analyzePendulumExercise(pose: poseDetection.Pose): ExerciseAnalysis {
  const issues: string[] = [];
  let isCorrectForm = true;
  let angle = 0;
  
  // Get relevant keypoints
  const shoulder = getKeypoint(pose, 'right_shoulder');
  const elbow = getKeypoint(pose, 'right_elbow');
  const wrist = getKeypoint(pose, 'right_wrist');
  const hip = getKeypoint(pose, 'right_hip');
  
  // Check if we have all needed keypoints
  if (!shoulder || !elbow || !wrist || !hip) {
    return {
      isCorrectForm: false,
      angle: 0,
      issues: ['Cannot detect all required body points. Please adjust your position.']
    };
  }
  
  // Check if upper body is bent forward enough
  const torsoAngle = calculateAngle(
    { x: shoulder.x, y: 0 }, // Vertical reference point
    shoulder,
    hip
  );
  
  if (torsoAngle < 30) {
    issues.push('Bend forward more at the waist');
    isCorrectForm = false;
  }
  
  // Check if arm is hanging loosely
  angle = calculateAngle(shoulder, elbow, wrist);
  if (angle < 160) {
    issues.push('Keep your arm relaxed and straight');
    isCorrectForm = false;
  }
  
  // For pendulum, we're looking for movement over time
  // This would require tracking the position changes across frames
  // Simplified for this example
  
  return { isCorrectForm, angle, issues };
}

// Get feedback based on pose history
export function getPoseFeedback(
  poseHistory: poseDetection.Pose[],
  exerciseType: ExerciseType
): string[] {
  if (!poseHistory || poseHistory.length === 0) {
    return [];
  }
  
  // Analyze the most recent pose
  const latestPose = poseHistory[poseHistory.length - 1];
  const analysis = analyzeExerciseForm(latestPose, exerciseType);
  
  // Return the issues as feedback
  return analysis.issues;
}

// Determine exercise difficulty based on analysis
export function getExerciseDifficulty(
  poseHistory: poseDetection.Pose[],
  exerciseType: ExerciseType
): 'easy' | 'medium' | 'hard' {
  if (!poseHistory || poseHistory.length < 5) {
    return 'medium'; // Default
  }
  
  // Count how many poses had correct form
  const correctFormCount = poseHistory.reduce((count, pose) => {
    const analysis = analyzeExerciseForm(pose, exerciseType);
    return count + (analysis.isCorrectForm ? 1 : 0);
  }, 0);
  
  // Calculate percentage of correct form
  const correctPercentage = (correctFormCount / poseHistory.length) * 100;
  
  // Determine difficulty based on correct form percentage
  if (correctPercentage >= 80) {
    return 'easy';
  } else if (correctPercentage >= 50) {
    return 'medium';
  } else {
    return 'hard';
  }
}
