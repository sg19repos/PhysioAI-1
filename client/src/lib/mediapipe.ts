import * as poseDetection from '@mediapipe/pose';

// Constants for MediaPipe Pose connections
export const POSE_CONNECTIONS = [
  // Face connections (simplified)
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
  // Torso connections
  [11, 12], [11, 23], [12, 24], [23, 24],
  // Right arm connections
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  // Left arm connections
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  // Right leg connections
  [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
  // Left leg connections
  [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
];

// Helper function to initialize MediaPipe Pose
export async function initializePose(): Promise<poseDetection.Pose> {
  const pose = new poseDetection.Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });
  
  await pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  
  return pose;
}

// Convert MediaPipe landmarks to a format suitable for our application
export function normalizePoseLandmarks(results: poseDetection.Results) {
  if (!results.poseLandmarks) return null;
  
  // Normalize coordinates to be between 0-1 (MediaPipe already does this)
  return results.poseLandmarks.map(landmark => ({
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
    visibility: landmark.visibility || 0
  }));
}

// Calculate angles between body parts
export function calculateJointAngles(landmarks: any[]) {
  if (!landmarks || landmarks.length < 33) return null;
  
  // Calculate angles for key joints
  const angles = {
    // Right shoulder angle (between right hip, shoulder, and elbow)
    rightShoulderFlexion: calculateAngle(
      landmarks[23], // right hip
      landmarks[11], // right shoulder
      landmarks[13]  // right elbow
    ),
    
    // Left shoulder angle (between left hip, shoulder, and elbow)
    leftShoulderFlexion: calculateAngle(
      landmarks[24], // left hip
      landmarks[12], // left shoulder
      landmarks[14]  // left elbow
    ),
    
    // Right elbow angle
    rightElbowFlexion: calculateAngle(
      landmarks[11], // right shoulder
      landmarks[13], // right elbow
      landmarks[15]  // right wrist
    ),
    
    // Left elbow angle
    leftElbowFlexion: calculateAngle(
      landmarks[12], // left shoulder
      landmarks[14], // left elbow
      landmarks[16]  // left wrist
    ),
    
    // Right hip angle
    rightHipFlexion: calculateAngle(
      landmarks[11], // right shoulder
      landmarks[23], // right hip
      landmarks[25]  // right knee
    ),
    
    // Left hip angle
    leftHipFlexion: calculateAngle(
      landmarks[12], // left shoulder
      landmarks[24], // left hip
      landmarks[26]  // left knee
    ),
    
    // Right knee angle
    rightKneeFlexion: calculateAngle(
      landmarks[23], // right hip
      landmarks[25], // right knee
      landmarks[27]  // right ankle
    ),
    
    // Left knee angle
    leftKneeFlexion: calculateAngle(
      landmarks[24], // left hip
      landmarks[26], // left knee
      landmarks[28]  // left ankle
    )
  };
  
  return angles;
}

// Calculate angle between three points
function calculateAngle(pointA: any, pointB: any, pointC: any): number {
  if (!pointA || !pointB || !pointC || 
      pointA.visibility < 0.5 || 
      pointB.visibility < 0.5 || 
      pointC.visibility < 0.5) {
    return -1; // Invalid angle if any point isn't visible enough
  }
  
  const vectorAB = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y
  };
  
  const vectorBC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y
  };
  
  // Calculate dot product
  const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;
  
  // Calculate magnitudes
  const magnitudeAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
  const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
  
  // Calculate angle in radians
  const angleRadians = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
  
  // Convert to degrees
  const angleDegrees = angleRadians * (180 / Math.PI);
  
  return angleDegrees;
}

// Detect if a pose is correct for a specific exercise
export function isPoseCorrect(
  angles: any, 
  exerciseType: string, 
  expectedRanges: { [key: string]: [number, number] }
): { correct: boolean; feedback: string[] } {
  if (!angles) {
    return { correct: false, feedback: ['Unable to detect pose angles'] };
  }
  
  const feedback: string[] = [];
  let allCorrect = true;
  
  // Check each expected angle against the measured angle
  for (const [joint, [min, max]] of Object.entries(expectedRanges)) {
    if (angles[joint] === -1) {
      feedback.push(`Cannot see ${joint.replace(/([A-Z])/g, ' $1').toLowerCase()} clearly`);
      allCorrect = false;
      continue;
    }
    
    if (angles[joint] < min) {
      feedback.push(`Increase ${joint.replace(/([A-Z])/g, ' $1').toLowerCase()} angle`);
      allCorrect = false;
    } else if (angles[joint] > max) {
      feedback.push(`Decrease ${joint.replace(/([A-Z])/g, ' $1').toLowerCase()} angle`);
      allCorrect = false;
    }
  }
  
  // Add exercise-specific feedback
  if (exerciseType === 'shoulderExternalRotation' && allCorrect) {
    feedback.push('Good external rotation form, maintain elbow position');
  } else if (exerciseType === 'wallSlides' && allCorrect) {
    feedback.push('Excellent wall slide form, maintain contact with wall');
  }
  
  return {
    correct: allCorrect,
    feedback
  };
}
