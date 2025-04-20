import { Results } from '@mediapipe/pose';
import { POSE_CONNECTIONS } from './mediapipe';

/**
 * Draws the skeleton overlay on the canvas based on pose detection results
 * @param canvas - The canvas element to draw on
 * @param results - The pose detection results from MediaPipe
 * @param connections - The skeleton connections to draw
 */
export function drawSkeleton(
  canvas: HTMLCanvasElement,
  results: Results,
  connections: number[][]
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !results.poseLandmarks) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set canvas dimensions to match the video
  const width = canvas.width;
  const height = canvas.height;
  
  // Draw connections (bones)
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#10B981'; // Default color (green)
  
  for (const [i, j] of connections) {
    const pointA = results.poseLandmarks[i];
    const pointB = results.poseLandmarks[j];
    
    // Skip if points aren't visible enough
    if (pointA.visibility < 0.5 || pointB.visibility < 0.5) continue;
    
    // Check if this is an important joint to highlight (for example, if there's a posture issue)
    if (i === 11 || i === 12 || i === 13 || i === 14) { // Shoulders and elbows
      // In a real app, we would check if this joint has issues and change color accordingly
      const hasIssue = shouldHighlightJoint(i, results);
      ctx.strokeStyle = hasIssue ? '#EF4444' : '#10B981'; // Red if issue, green if ok
    } else {
      ctx.strokeStyle = '#10B981'; // Default green
    }
    
    ctx.beginPath();
    ctx.moveTo(pointA.x * width, pointA.y * height);
    ctx.lineTo(pointB.x * width, pointB.y * height);
    ctx.stroke();
  }
  
  // Draw joint points
  for (let i = 0; i < results.poseLandmarks.length; i++) {
    const point = results.poseLandmarks[i];
    
    // Skip if point isn't visible enough
    if (point.visibility < 0.5) continue;
    
    const x = point.x * width;
    const y = point.y * height;
    
    // Check if this joint should be highlighted
    const hasIssue = shouldHighlightJoint(i, results);
    
    ctx.fillStyle = hasIssue ? '#EF4444' : '#10B981'; // Red if issue, green if ok
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * Determines if a joint should be highlighted based on pose analysis
 * This is a simplified implementation that could be replaced with more
 * sophisticated analysis in a production application
 */
function shouldHighlightJoint(jointIndex: number, results: Results): boolean {
  // In the design mockup, the left arm was highlighted, so we'll replicate that
  // In a real app, this would be based on actual analysis of joint angles and positions
  const leftArmJoints = [11, 13, 15, 17, 19]; // Left shoulder, elbow, wrist, etc.
  
  // Simplified logic for demo purposes:
  // Highlight left arm joints 30% of the time to simulate posture issues
  if (leftArmJoints.includes(jointIndex) && Math.random() < 0.3) {
    return true;
  }
  
  return false;
}

/**
 * Analyzes exercise form based on pose landmarks and exercise type
 * @param poseLandmarks - The detected pose landmarks from MediaPipe
 * @param exerciseType - The type of exercise being performed
 * @returns Analysis results with score and feedback
 */
export function analyzeExerciseForm(poseLandmarks: any[], exerciseType: string): {
  score: number;
  issues: Array<{ part: string; message: string; severity: string }>;
  correctForm: boolean;
} {
  // This would be a complex function in a real application
  // For the MVP, we'll implement a simplified version
  
  // Default results
  const result = {
    score: 75,
    issues: [] as Array<{ part: string; message: string; severity: string }>,
    correctForm: true
  };
  
  // Skip if no landmarks
  if (!poseLandmarks || poseLandmarks.length < 33) {
    return {
      score: 0,
      issues: [{ part: "detection", message: "Cannot detect pose properly", severity: "high" }],
      correctForm: false
    };
  }
  
  // Simplified analysis based on exercise type
  switch (exerciseType) {
    case "shoulderExternalRotation":
      // Check if elbow is close to body
      const shoulderX = poseLandmarks[11].x;
      const elbowX = poseLandmarks[13].x;
      const wristX = poseLandmarks[15].x;
      
      // If elbow is too far from body
      if (Math.abs(elbowX - shoulderX) > 0.15) {
        result.issues.push({
          part: "left_arm",
          message: "Keep your elbow closer to your body",
          severity: "medium"
        });
        result.score -= 15;
        result.correctForm = false;
      }
      
      // If wrist isn't rotated enough
      if (wristX < elbowX + 0.05) {
        result.issues.push({
          part: "left_wrist",
          message: "Rotate your arm outward more",
          severity: "low"
        });
        result.score -= 10;
        result.correctForm = false;
      }
      break;
      
    case "shoulderFlexion":
      // Check if arm is raised high enough
      const shoulderY = poseLandmarks[11].y;
      const wristY = poseLandmarks[15].y;
      
      if (shoulderY - wristY < 0.3) {
        result.issues.push({
          part: "left_arm",
          message: "Raise your arm higher",
          severity: "medium"
        });
        result.score -= 20;
        result.correctForm = false;
      }
      break;
      
    case "wallSlides":
      // Check shoulder position
      const leftShoulderY = poseLandmarks[11].y;
      const rightShoulderY = poseLandmarks[12].y;
      
      if (Math.abs(leftShoulderY - rightShoulderY) > 0.05) {
        result.issues.push({
          part: "shoulders",
          message: "Keep shoulders level and back against wall",
          severity: "low"
        });
        result.score -= 15;
        result.correctForm = false;
      }
      break;
      
    default:
      // Generic checks for all exercises
      
      // Check for general posture - shoulders back and down
      const neckY = poseLandmarks[0].y;
      const leftShoulder = poseLandmarks[11];
      const rightShoulder = poseLandmarks[12];
      
      if (leftShoulder.y < neckY - 0.05 || rightShoulder.y < neckY - 0.05) {
        result.issues.push({
          part: "shoulders",
          message: "Relax your shoulders down and back",
          severity: "low"
        });
        result.score -= 10;
        result.correctForm = false;
      }
  }
  
  // Cap score between 0-100
  result.score = Math.max(0, Math.min(100, result.score));
  
  return result;
}

/**
 * Estimates range of motion angles from pose landmarks
 * @param poseLandmarks - The detected pose landmarks from MediaPipe
 * @returns Object with calculated joint angles
 */
export function calculateRangeOfMotion(poseLandmarks: any[]): Record<string, number> {
  if (!poseLandmarks || poseLandmarks.length < 33) {
    return {};
  }
  
  // Calculate shoulder flexion angle (simplified)
  const shoulderFlexionAngle = calculateAngle(
    poseLandmarks[23], // hip
    poseLandmarks[11], // shoulder
    poseLandmarks[13]  // elbow
  );
  
  // Calculate shoulder abduction angle (simplified)
  // For true abduction, we would need a different calculation
  const shoulderAbductionAngle = calculateAngle(
    poseLandmarks[11], // shoulder
    poseLandmarks[13], // elbow
    poseLandmarks[15]  // wrist
  );
  
  // Return calculated angles
  return {
    shoulderFlexion: shoulderFlexionAngle,
    shoulderAbduction: shoulderAbductionAngle
  };
}

/**
 * Calculates the angle between three points in 2D space
 */
function calculateAngle(a: any, b: any, c: any): number {
  if (!a || !b || !c) return 0;
  
  // Create vectors from the middle point
  const vec1 = { x: a.x - b.x, y: a.y - b.y };
  const vec2 = { x: c.x - b.x, y: c.y - b.y };
  
  // Calculate dot product
  const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
  
  // Calculate angle in radians
  const angle = Math.acos(dotProduct / (mag1 * mag2));
  
  // Convert to degrees
  return angle * (180 / Math.PI);
}
