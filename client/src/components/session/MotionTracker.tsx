import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Archive, AlertCircle, Camera as CameraIcon, CameraOff } from "lucide-react";
import { Camera } from '@mediapipe/camera_utils';
import * as poseDetection from '@mediapipe/pose';
import { apiRequest } from '@/lib/queryClient';
import { POSE_CONNECTIONS } from '@/lib/mediapipe';
import { drawSkeleton } from '@/lib/poseAnalysis';

interface MotionTrackerProps {
  patientId: number;
  patientName: string;
  condition: string;
  exerciseId?: number;
  exerciseName?: string;
  onPoseAnalyzed?: (feedback: any) => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({
  patientId,
  patientName,
  condition,
  exerciseId,
  exerciseName = 'No exercise selected',
  onPoseAnalyzed
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [postureFeedback, setPostureFeedback] = useState<string | null>(null);
  const [postureIssue, setPostureIssue] = useState<{part: string, message: string} | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<poseDetection.Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const resultsRef = useRef<any>(null);
  
  // Initialize MediaPipe Pose detection
  useEffect(() => {
    const initializePose = async () => {
      try {
        // Create a new Pose instance with proper error handling
        let pose;
        try {
          pose = new poseDetection.Pose({
            locateFile: (file) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
          });
        } catch (error) {
          console.error('Error creating Pose instance:', error);
          // Try alternative initialization
          const Pose = (poseDetection as any).Pose || (poseDetection as any).default?.Pose;
          if (!Pose) {
            throw new Error('Could not find Pose constructor');
          }
          pose = new Pose({
            locateFile: (file: string) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
          });
        }
        
        // Set pose detection options
        await pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        
        // Set up the callback that will process pose detection results
        pose.onResults((results: poseDetection.Results) => {
          resultsRef.current = results;
          
          if (canvasRef.current && results.poseLandmarks) {
            drawSkeleton(canvasRef.current, results, POSE_CONNECTIONS);
            
            // If tracking is on, analyze posture periodically
            if (isTracking && exerciseId) {
              analyzePosture(results.poseLandmarks);
            }
          }
          
          setIsLoading(false);
        });
        
        poseRef.current = pose;
        
        // Set up the camera if the video element exists
        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && poseRef.current) {
                await poseRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480
          });
          
          cameraRef.current = camera;
          await camera.start();
        }
      } catch (error) {
        console.error('Error initializing pose detection:', error);
        setIsLoading(false);
      }
    };
    
    initializePose();
    
    // Cleanup function
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, []);
  
  // Periodically analyze posture when tracking is active
  const analyzePosture = async (poseLandmarks: any) => {
    if (!exerciseId || !poseLandmarks) return;
    
    try {
      // Throttle API calls to avoid overloading
      const shouldAnalyze = Math.random() < 0.1; // Only analyze ~10% of frames
      if (!shouldAnalyze) return;
      
      const response = await apiRequest('POST', '/api/ai/analyze-posture', {
        poseData: poseLandmarks,
        patientId,
        exerciseId
      });
      
      const feedback = await response.json();
      
      if (onPoseAnalyzed) {
        onPoseAnalyzed(feedback);
      }
      
      if (!feedback.correctForm && feedback.issues && feedback.issues.length > 0) {
        setPostureIssue(feedback.issues[0]);
        setPostureFeedback(`Posture Alert: ${feedback.issues[0].part.split('_').join(' ')}`);
      } else {
        setPostureFeedback(null);
        setPostureIssue(null);
      }
    } catch (error) {
      console.error('Error analyzing posture:', error);
    }
  };
  
  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      setPostureFeedback(null);
      setPostureIssue(null);
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop recording the session
  };
  
  const toggleCamera = () => {
    const newCameraState = !isCameraOn;
    setIsCameraOn(newCameraState);
    
    if (cameraRef.current) {
      if (!newCameraState) {
        // Turn off camera
        cameraRef.current.stop();
        // Clear the canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      } else {
        // Turn on camera
        cameraRef.current.start();
      }
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 border-b border-neutral-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white font-semibold">
              {getInitials(patientName)}
            </div>
            <div className="ml-3">
              <CardTitle className="text-lg font-medium text-neutral-900">{patientName}</CardTitle>
              <p className="text-sm text-neutral-500">{condition}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Badge className="bg-green-100 text-green-800 mr-2">Live</Badge>
            <Button variant="destructive" size="sm">End Session</Button>
          </div>
        </div>
      </CardHeader>
      
      <div className="relative bg-neutral-900 w-full" style={{ height: '400px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover invisible"
          playsInline
        />
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={640}
          height={480}
        />
        
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800 bg-opacity-90">
            <CameraOff className="h-16 w-16 text-neutral-400 mb-4" />
            <h3 className="text-xl font-medium text-white">Camera is turned off</h3>
            <p className="text-neutral-400 mt-2">Click "Turn On Camera" to enable motion tracking</p>
          </div>
        )}
        
        {postureFeedback && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {postureFeedback}
          </div>
        )}
      </div>
      
      <CardFooter className="p-4 bg-neutral-50 border-t border-neutral-100">
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={toggleTracking}
              variant={isTracking ? "secondary" : "default"}
              className="inline-flex items-center"
            >
              <Play className="h-5 w-5 mr-1" />
              {isTracking ? "Pause Exercise" : "Start Exercise"}
            </Button>
            
            <Button 
              onClick={toggleRecording}
              variant="outline"
              className={`inline-flex items-center ${isRecording ? 'text-red-500 border-red-500' : ''}`}
            >
              <Archive className="h-5 w-5 mr-1" />
              {isRecording ? "Stop Recording" : "Archive Session"}
            </Button>
            
            <Button 
              onClick={toggleCamera}
              variant="outline"
              className="inline-flex items-center"
            >
              {isCameraOn ? (
                <>
                  <CameraOff className="h-5 w-5 mr-1" />
                  Turn Off Camera
                </>
              ) : (
                <>
                  <CameraIcon className="h-5 w-5 mr-1" />
                  Turn On Camera
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-neutral-600 mr-2">Current Exercise:</span>
            <span className="font-medium">{exerciseName}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MotionTracker;
