import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

// Key point pairs for drawing skeleton lines
const POSE_CONNECTIONS = [
  // Face
  ['nose', 'left_eye'], ['nose', 'right_eye'],
  ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
  
  // Upper body
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
  
  // Torso
  ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  
  // Lower body
  ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
];

// Important joint angles for physiotherapy
export const JOINT_ANGLES = [
  {
    name: 'Right Elbow Angle',
    points: ['right_shoulder', 'right_elbow', 'right_wrist'],
    normal: [150, 180]
  },
  {
    name: 'Left Elbow Angle',
    points: ['left_shoulder', 'left_elbow', 'left_wrist'],
    normal: [150, 180]
  },
  {
    name: 'Right Shoulder Angle',
    points: ['right_elbow', 'right_shoulder', 'right_hip'],
    normal: [0, 180]
  },
  {
    name: 'Left Shoulder Angle',
    points: ['left_elbow', 'left_shoulder', 'left_hip'],
    normal: [0, 180]
  },
  {
    name: 'Right Knee Angle',
    points: ['right_hip', 'right_knee', 'right_ankle'],
    normal: [160, 180]
  },
  {
    name: 'Left Knee Angle',
    points: ['left_hip', 'left_knee', 'left_ankle'],
    normal: [160, 180]
  },
  {
    name: 'Neck Angle',
    points: ['left_shoulder', 'nose', 'right_shoulder'],
    normal: [70, 110]
  }
];

// Joint display names
export const JOINT_DISPLAY_NAMES: {[key: string]: string} = {
  'nose': 'Nose',
  'left_eye': 'Left Eye',
  'right_eye': 'Right Eye',
  'left_ear': 'Left Ear',
  'right_ear': 'Right Ear',
  'left_shoulder': 'Left Shoulder',
  'right_shoulder': 'Right Shoulder',
  'left_elbow': 'Left Elbow',
  'right_elbow': 'Right Elbow',
  'left_wrist': 'Left Wrist',
  'right_wrist': 'Right Wrist',
  'left_hip': 'Left Hip',
  'right_hip': 'Right Hip',
  'left_knee': 'Left Knee',
  'right_knee': 'Right Knee',
  'left_ankle': 'Left Ankle',
  'right_ankle': 'Right Ankle'
};

// Keypoint positions history for velocity calculation
const keypointHistory = new Map<string, Array<{x: number, y: number, timestamp: number}>>();

// Setup the pose detector
export async function setupDetector(): Promise<poseDetection.PoseDetector> {
  // Initialize TensorFlow.js backend
  await tf.setBackend('webgl');
  await tf.ready();
  
  // Create a MoveNet detector
  const detectorConfig: poseDetection.MoveNetModelConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    enableSmoothing: true,
    minPoseScore: 0.2
  };
  
  return poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

// Calculate joint velocities based on position history
export function calculateVelocity(
  keypointName: string,
  currentPosition: {x: number, y: number}
): number {
  const now = Date.now();
  
  // Add current position to history
  if (!keypointHistory.has(keypointName)) {
    keypointHistory.set(keypointName, []);
  }
  
  const history = keypointHistory.get(keypointName)!;
  history.push({...currentPosition, timestamp: now});
  
  // Keep only the last 10 points for velocity calculation
  if (history.length > 10) {
    history.shift();
  }
  
  // Need at least 2 points to calculate velocity
  if (history.length < 2) return 0;
  
  // Calculate velocity based on the last 2 positions
  const current = history[history.length - 1];
  const previous = history[history.length - 2];
  
  const dx = current.x - previous.x;
  const dy = current.y - previous.y;
  const dt = (current.timestamp - previous.timestamp) / 1000; // in seconds
  
  if (dt === 0) return 0;
  
  // Velocity in pixels per second
  const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
  
  return parseFloat(velocity.toFixed(1));
}

// Draw skeleton with joint angles, names, and velocities
export function drawPose(
  ctx: CanvasRenderingContext2D,
  pose: poseDetection.Pose,
  canvasWidth: number,
  canvasHeight: number,
  showDetails: boolean = true
): void {
  if (!pose || !pose.keypoints) return;

  // Set default styles
  ctx.fillStyle = '#1976D2'; // Primary blue color
  ctx.strokeStyle = '#1976D2';
  ctx.lineWidth = 2;

  // Create a mapping of keypoint name to position
  const keypointMap = new Map();
  pose.keypoints.forEach(keypoint => {
    if (keypoint.score && keypoint.score > 0.3) {
      keypointMap.set(keypoint.name, {
        x: keypoint.x,
        y: keypoint.y
      });
      
      // Draw keypoint as a circle
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  // Draw connections
  ctx.beginPath();
  POSE_CONNECTIONS.forEach(([start, end]) => {
    const startPoint = keypointMap.get(start);
    const endPoint = keypointMap.get(end);

    if (startPoint && endPoint) {
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
    }
  });
  ctx.stroke();

  // Highlight specific joints for physiotherapy
  const jointHighlights = [
    'left_shoulder', 'right_shoulder',
    'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist',
    'left_knee', 'right_knee',
    'left_hip', 'right_hip',
    'left_ankle', 'right_ankle',
    'nose'
  ];

  // Draw joint highlights, names, and velocities
  jointHighlights.forEach(joint => {
    const point = keypointMap.get(joint);
    if (point) {
      // Highlight joint
      ctx.fillStyle = '#FF5722'; // Accent color for important joints
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add outline
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.stroke();
      
      if (showDetails) {
        // Calculate velocity of this joint
        const velocity = calculateVelocity(joint, point);
        
        // Draw joint name
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(JOINT_DISPLAY_NAMES[joint], point.x, point.y - 15);
        
        // Draw velocity if it's significant
        if (velocity > 5) {
          ctx.fillStyle = '#4CAF50'; // Green color for velocity
          ctx.fillText(`${velocity} px/s`, point.x, point.y + 20);
        }
      }
    }
  });
  
  // Calculate and display joint angles
  if (showDetails) {
    JOINT_ANGLES.forEach(angleConfig => {
      const [p1Name, p2Name, p3Name] = angleConfig.points;
      const p1 = keypointMap.get(p1Name);
      const p2 = keypointMap.get(p2Name);
      const p3 = keypointMap.get(p3Name);
      
      if (p1 && p2 && p3) {
        const angle = calculateAngle(p1, p2, p3);
        const isNormal = angle >= angleConfig.normal[0] && angle <= angleConfig.normal[1];
        
        // Position for angle text (near the middle point)
        const textX = (p1.x + p2.x + p3.x) / 3;
        const textY = (p1.y + p2.y + p3.y) / 3;
        
        // Draw angle value
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = isNormal ? '#4CAF50' : '#FF5722'; // Green if normal, red otherwise
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(angle)}°`, textX, textY);
        
        // Draw angle name in smaller text
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(angleConfig.name, textX, textY - 18);
      }
    });
  }
}

// Calculate angle between three points (in degrees)
export function calculateAngle(
  a: { x: number, y: number },
  b: { x: number, y: number },
  c: { x: number, y: number }
): number {
  // Calculate vectors
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };

  // Calculate dot product
  const dot = ab.x * cb.x + ab.y * cb.y;

  // Calculate magnitudes
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

  // Calculate angle in radians and handle potential numerical errors
  const cosAngle = dot / (magAB * magCB);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

  // Convert to degrees
  return (angleRad * 180) / Math.PI;
}

// Get a specific keypoint from the pose
export function getKeypoint(pose: poseDetection.Pose, name: string): { x: number, y: number } | null {
  if (!pose || !pose.keypoints) return null;
  
  const keypoint = pose.keypoints.find(kp => kp.name === name);
  if (!keypoint || (keypoint.score && keypoint.score < 0.3)) return null;
  
  return { x: keypoint.x, y: keypoint.y };
}
