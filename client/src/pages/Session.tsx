import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MotionTracker from '@/components/motion/MotionTracker';
import { useExerciseTracker } from '@/hooks/use-exercise-tracker';
import ProgressIndicator from '@/components/progress/ProgressIndicator';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Exercise, Session as SessionType, SessionExercise } from '@shared/schema';
import * as poseDetection from '@tensorflow-models/pose-detection';

interface ExerciseWithDetails extends SessionExercise {
  details?: Exercise;
  completed: boolean;
}

const Session: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("live");
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [currentRep, setCurrentRep] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [feedback, setFeedback] = useState<string[]>([]);
  const userId = 1; // This would come from authentication

  // Fetch user's sessions
  const { data: sessions } = useQuery<SessionType[]>({
    queryKey: [`/api/sessions/patient/${userId}`],
  });

  // Find today's session
  const todaySession = sessions?.find((session: SessionType) => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  // Fetch session exercises
  const { data: sessionExercises, isLoading: loadingExercises } = useQuery<SessionExercise[]>({
    queryKey: [`/api/session-exercises/${todaySession?.id}`],
    enabled: !!todaySession?.id,
  });

  // Fetch all exercises to have the complete exercise data
  const { data: allExercises } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises'],
  });

  // Full exercise details for exercises in this session
  const exercisesWithDetails: ExerciseWithDetails[] | undefined = sessionExercises?.map((sessionExercise: SessionExercise) => {
    const exerciseDetails = allExercises?.find((ex: Exercise) => ex.id === sessionExercise.exerciseId);
    return {
      ...sessionExercise,
      details: exerciseDetails,
      completed: false
    };
  });

  // Get current exercise
  const currentExercise = exercisesWithDetails?.find(ex => ex.exerciseId === activeExerciseId)?.details;

  // Initialize exercise tracker
  const { 
    feedbackMessages,
    repetitionCount,
    exerciseProgress,
    postureFeedback,
    registerPose,
    startExercise,
    stopExercise,
    resetExercise,
  } = useExerciseTracker();

  // Handle pose detection
  const handlePoseDetected = (poses: poseDetection.Pose[]) => {
    if (!sessionStarted || !poses || poses.length === 0) return;
    registerPose(poses[0], currentExercise);
  };

  // Start exercise session
  const startSession = () => {
    if (!sessionExercises || sessionExercises.length === 0) return;
    
    // Set first exercise as active
    const firstExercise = sessionExercises[0];
    if (firstExercise) {
      setActiveExerciseId(firstExercise.exerciseId);
      setSessionStarted(true);
      
      // Give a moment for camera to initialize before starting exercise tracking
      setTimeout(() => {
        startExercise();
      }, 500);
    }
  };

  // Complete current exercise
  const completeExercise = () => {
    stopExercise();
    
    // Move to next exercise if available
    if (sessionExercises && activeExerciseId) {
      const currentIndex = sessionExercises.findIndex((ex: SessionExercise) => ex.exerciseId === activeExerciseId);
      if (currentIndex >= 0 && currentIndex < sessionExercises.length - 1) {
        const nextExercise = sessionExercises[currentIndex + 1];
        if (nextExercise) {
          setActiveExerciseId(nextExercise.exerciseId);
          resetExercise();
          startExercise();
        }
      } else {
        // Session completed - all exercises done
        setSessionStarted(false);
      }
    }
  };

  // Update rep and set counts based on exercise progress
  useEffect(() => {
    if (repetitionCount > 0) {
      setCurrentRep(repetitionCount % (currentExercise?.reps || 12));
      setCurrentSet(Math.floor(repetitionCount / (currentExercise?.reps || 12)) + 1);
    }
  }, [repetitionCount, currentExercise]);

  // Update feedback messages
  useEffect(() => {
    setFeedback(postureFeedback);
  }, [postureFeedback]);

  return (
    <DashboardLayout title="Therapy Session">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Therapy Session</h1>
        <p className="text-neutral-600">
          Complete your prescribed exercises with real-time AI guidance and posture correction.
        </p>
      </div>

      <Tabs defaultValue="live" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="live">Live Session</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Motion Tracking</CardTitle>
                  <CardDescription>
                    Your camera will be used to track your movements and provide real-time feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="webcam-container mb-4">
                    <MotionTracker
                      onPoseDetected={handlePoseDetected}
                      autoStart={sessionStarted}
                      showControls={true}
                      showJointDetails={true}
                      width="100%"
                      height="auto"
                    />
                  </div>

                  {!sessionStarted ? (
                    <div className="flex justify-center mt-4">
                      <Button 
                        onClick={startSession} 
                        disabled={!sessionExercises || sessionExercises.length === 0}
                        size="lg"
                      >
                        Start Session
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg text-neutral-800">
                              {currentExercise?.name || "Exercise"}
                            </h3>
                            <p className="text-neutral-600 text-sm mt-1">
                              {currentExercise?.description}
                            </p>
                          </div>
                          <div className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                            Set {currentSet}/{currentExercise?.sets || 3}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">Repetitions</span>
                            <span className="text-neutral-800 font-medium">
                              {currentRep}/{currentExercise?.reps || 12} reps
                            </span>
                          </div>
                          <ProgressIndicator 
                            value={(currentRep / (currentExercise?.reps || 12)) * 100} 
                            color="green"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline" onClick={resetExercise}>
                          Reset
                        </Button>
                        <Button onClick={completeExercise}>
                          Complete Exercise
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Session Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {!loadingExercises && exercisesWithDetails ? (
                    <div className="space-y-4">
                      {exercisesWithDetails.map((ex, index) => (
                        <div 
                          key={ex.id}
                          className={`p-3 rounded-lg border ${
                            ex.exerciseId === activeExerciseId 
                              ? 'border-primary bg-primary/5' 
                              : ex.completed 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                              ex.exerciseId === activeExerciseId 
                                ? 'bg-primary text-white' 
                                : ex.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-500'
                            }`}>
                              {ex.exerciseId === activeExerciseId ? (
                                <Clock className="h-3 w-3" />
                              ) : ex.completed ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-800">
                                {ex.details?.name || `Exercise ${index + 1}`}
                              </p>
                              <p className="text-xs text-neutral-500 mt-1">
                                {ex.sets} sets • {ex.reps} reps
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-neutral-600">No exercises scheduled for today</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle>Posture Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {feedback.length > 0 ? (
                    <ul className="space-y-2">
                      {feedback.map((message, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />
                          <span>{message}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    sessionStarted ? (
                      <div className="flex items-center justify-center h-24">
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-neutral-600">Your posture looks good!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-24">
                        <p className="text-neutral-600">Start a session to see real-time feedback</p>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Schedule</CardTitle>
              <CardDescription>View your upcoming therapy sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions ? (
                  sessions.length > 0 ? (
                    sessions.map((session: SessionType) => {
                      const sessionDate = new Date(session.date);
                      const today = new Date();
                      const isToday = sessionDate.toDateString() === today.toDateString();
                      
                      return (
                        <div 
                          key={session.id}
                          className={`p-4 rounded-lg border ${
                            isToday ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium text-neutral-800">
                                  {isToday ? 'Today' : sessionDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                </h3>
                                {isToday && (
                                  <span className="ml-2 text-xs font-medium bg-primary text-white px-2 py-0.5 rounded-full">
                                    Today
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-600 mt-1">
                                {sessionDate.toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                                {session.startTime && ` • ${new Date(session.startTime).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit'
                                })}`}
                              </p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              session.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : session.status === 'missed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </div>
                          </div>
                          
                          {isToday && session.status === 'scheduled' && (
                            <div className="mt-3">
                              <Button onClick={startSession}>
                                Start Session
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <XCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <h3 className="font-medium text-neutral-800 mb-1">No Sessions Scheduled</h3>
                      <p className="text-neutral-600">
                        You don't have any therapy sessions scheduled.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="py-12 text-center text-neutral-600">
                    Loading sessions...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Review your completed therapy sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions ? (
                  sessions.filter((session: SessionType) => session.status === 'completed').length > 0 ? (
                    sessions
                      .filter((session: SessionType) => session.status === 'completed')
                      .map((session: SessionType) => {
                        const sessionDate = new Date(session.date);
                        
                        return (
                          <div 
                            key={session.id}
                            className="p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-neutral-800">
                                  Therapy Session
                                </h3>
                                <p className="text-sm text-neutral-600 mt-1">
                                  {sessionDate.toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                Completed
                              </div>
                            </div>
                            
                            <div className="mt-3 flex space-x-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-12">
                      <XCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <h3 className="font-medium text-neutral-800 mb-1">No Completed Sessions</h3>
                      <p className="text-neutral-600">
                        You haven't completed any therapy sessions yet.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="py-12 text-center text-neutral-600">
                    Loading session history...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Session;
