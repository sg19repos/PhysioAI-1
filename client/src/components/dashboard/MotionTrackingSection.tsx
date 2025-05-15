import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MotionTracker from '../motion/MotionTracker';
import SkeletonOverlay from '../motion/SkeletonOverlay';
import ExerciseCard from '../exercise/ExerciseCard';
import { useWebcam } from '@/hooks/use-webcam';
import { useMotionDetection } from '@/hooks/use-motion-detection';

type MotionTrackingSectionProps = {
  userId: number;
};

const MotionTrackingSection: React.FC<MotionTrackingSectionProps> = ({ userId }) => {
  // Component state
  const [webcamActive, setWebcamActive] = useState(false);
  
  // Refs
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Hooks for webcam and motion detection
  const { videoReady, videoError, startWebcam, stopWebcam } = useWebcam(webcamRef);
  const { 
    poses, 
    isDetecting, 
    showDetails,
    toggleDetails,
    startPoseDetection, 
    stopPoseDetection 
  } = useMotionDetection(webcamRef, canvasRef);
  
  // Fetch current session
  const { data: sessions = [] } = useQuery<any[]>({
    queryKey: [`/api/sessions/patient/${userId}`],
  });
  
  const todaySession = sessions.find((session: any) => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });
  
  // Fetch session exercises
  const { data: sessionExercises = [], isLoading: loadingExercises } = useQuery<any[]>({
    queryKey: [`/api/session-exercises/${todaySession?.id}`],
    enabled: !!todaySession?.id,
  });
  
  // Fetch exercise details for the current exercise
  const currentExerciseId = sessionExercises[0]?.exerciseId;
  const { data: currentExercise } = useQuery<any>({
    queryKey: [`/api/exercises/${currentExerciseId}`],
    enabled: !!currentExerciseId,
  });
  
  // Fetch recommended exercises
  const { data: allExercises = [] } = useQuery<any[]>({
    queryKey: ['/api/exercises'],
  });
  
  const recommendedExercises = allExercises?.slice(0, 3) || [];
  
  useEffect(() => {
    if (webcamActive && videoReady) {
      startPoseDetection();
    }
    
    return () => {
      if (webcamActive) {
        stopPoseDetection();
      }
    };
  }, [webcamActive, videoReady, startPoseDetection, stopPoseDetection]);
  
  const toggleWebcam = () => {
    if (webcamActive) {
      stopWebcam();
      stopPoseDetection();
      setWebcamActive(false);
    } else {
      startWebcam();
      setWebcamActive(true);
    }
  };
  
  // Analyze posture issues based on poses
  const postureIssues = [
    "Keep your shoulders level during the movement",
    "Extend your arm fully at the top of the motion"
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-heading font-semibold text-neutral-800">Real-time Motion Tracking</h2>
          <p className="text-neutral-500 text-sm mt-1">Analyze and correct your posture with AI assistance</p>
        </div>
        <div className="p-6">
          <div className="webcam-container mb-4 relative aspect-video bg-black rounded-lg overflow-hidden">
            {webcamActive ? (
              <>
                <video 
                  ref={webcamRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
                <canvas 
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <p className="mb-4">Enable your camera to start motion tracking</p>
                  <Button onClick={toggleWebcam}>
                    Enable Camera
                  </Button>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 right-4">
              <Button 
                variant="outline" 
                size="icon"
                className="bg-white hover:bg-gray-100 rounded-full"
                onClick={toggleWebcam}
              >
                {webcamActive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.414 10l3.293-3.293a1 1 0 00-1.414-1.414L12 8.586 8.707 5.293a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 101.414 1.414L12 11.414l3.293 3.293a1 1 0 001.414-1.414L13.414 10z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-neutral-800 font-medium mb-2">Current Exercise</h3>
                <p className="text-primary font-semibold">
                  {currentExercise?.name || "No exercise selected"} - Set 2/3
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">Progress</span>
                    <span className="text-neutral-800 font-medium">8/12 reps</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: '66%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 px-2">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-neutral-800 font-medium mb-1">Posture Analysis</h3>
                <p className="text-warning font-medium">Minor corrections needed</p>
                <ul className="mt-2 text-sm text-neutral-700">
                  {postureIssues.map((issue, index) => (
                    <li key={index} className="flex items-start mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-warning flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-heading font-semibold text-neutral-800">Next Exercises</h2>
          <p className="text-neutral-500 text-sm mt-1">AI-recommended for today's session</p>
        </div>
        <div className="p-4">
          {recommendedExercises.map((exercise: any) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
          
          <Link href="/exercises">
            <Button variant="ghost" className="w-full mt-2">
              View all exercises
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MotionTrackingSection;
