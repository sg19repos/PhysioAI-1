import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Archive, AlertCircle } from "lucide-react";
import { Camera } from '@mediapipe/camera_utils';
import { Pose } from '@mediapipe/pose';
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const resultsRef = useRef<any>(null);
  
  // Initialize MediaPipe Pose detection
  useEffect(() => {
    const initializePose = async () => {
      try {
        // Create a new Pose instance
        const pose = new Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });
        
        // Set pose detection options
        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        
        // Set up the callback that will process pose detection results
        pose.onResults((results) => {
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
          camera.start();
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
            <Badge variant="success" className="mr-2">Live</Badge>
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
