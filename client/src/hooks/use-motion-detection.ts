import { useState, useEffect, useCallback, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { setupDetector, drawPose } from '@/lib/pose-detection';

interface MotionDetectionHookResult {
  poses: poseDetection.Pose[] | null;
  isDetecting: boolean;
  showDetails: boolean;
  toggleDetails: () => void;
  startPoseDetection: () => void;
  stopPoseDetection: () => void;
}

export const useMotionDetection = (
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
): MotionDetectionHookResult => {
  const [poses, setPoses] = useState<poseDetection.Pose[] | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const animationRef = useRef<number | null>(null);

  // Toggle display of joint details (names, angles, velocities)
  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  // Initialize detector
  const initializeDetector = useCallback(async () => {
    if (!detectorRef.current) {
      try {
        detectorRef.current = await setupDetector();
      } catch (error) {
        console.error('Error initializing pose detector:', error);
      }
    }
    return detectorRef.current;
  }, []);

  // Detection loop
  const detectPose = useCallback(async () => {
    if (!isDetecting || !detectorRef.current || !webcamRef.current || !canvasRef.current) {
      return;
    }

    if (webcamRef.current.readyState < 2) {
      // Video not ready yet
      animationRef.current = requestAnimationFrame(detectPose);
      return;
    }

    try {
      // Get pose data
      const video = webcamRef.current;
      const detector = detectorRef.current;
      const detectedPoses = await detector.estimatePoses(video, {
        flipHorizontal: false,
        maxPoses: 1,
      });

      if (detectedPoses && detectedPoses.length > 0) {
        setPoses(detectedPoses);
        
        // Draw skeleton on canvas
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Set canvas dimensions to match video
          const { videoWidth, videoHeight } = video;
          if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
          }

          // Clear canvas
          ctx.clearRect(0, 0, videoWidth, videoHeight);
          
          // Draw pose with joint details
          drawPose(ctx, detectedPoses[0], videoWidth, videoHeight, showDetails);
        }
      }
    } catch (error) {
      console.error('Error during pose detection:', error);
    }

    // Continue detection loop
    if (isDetecting) {
      animationRef.current = requestAnimationFrame(detectPose);
    }
  }, [isDetecting, webcamRef, canvasRef, showDetails]);

  // Start detection
  const startPoseDetection = useCallback(async () => {
    if (isDetecting) return;

    try {
      await initializeDetector();
      setIsDetecting(true);
    } catch (error) {
      console.error('Error starting pose detection:', error);
    }
  }, [isDetecting, initializeDetector]);

  // Stop detection
  const stopPoseDetection = useCallback(() => {
    setIsDetecting(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setPoses(null);
  }, []);

  // Run detection loop when isDetecting changes or showDetails changes
  useEffect(() => {
    if (isDetecting) {
      detectPose();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDetecting, detectPose, showDetails]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  return {
    poses,
    isDetecting,
    showDetails,
    toggleDetails,
    startPoseDetection,
    stopPoseDetection
  };
};
