import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import MotionTracker from '@/components/session/MotionTracker';
import RealTimeFeedback from '@/components/session/RealTimeFeedback';
import ExerciseControls from '@/components/session/ExerciseControls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { completeExercise } from '@/lib/exercises';
import { useToast } from '@/hooks/use-toast';

const Session = () => {
  const { toast } = useToast();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [postureFeedback, setPostureFeedback] = useState<{ part: string; message: string; severity: string } | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([
    'Based on current progress, we recommend increasing resistance for shoulder external rotation.',
    'Consider incorporating prone scapular retraction to improve posture.'
  ]);

  // Fetch active session
  const { data: activeSession, isLoading: sessionLoading } = useQuery({
    queryKey: ['/api/therapists/1/active-sessions'],
    staleTime: 30000 // 30 seconds
  });
  
  // Fetch patient details
  const { data: patientData, isLoading: patientLoading } = useQuery({
    queryKey: ['/api/patients/1'],
    staleTime: 60000 // 1 minute
  });
  
  // Fetch patient exercises
  const { data: patientExercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ['/api/patients/1/exercises'],
    staleTime: 30000 // 30 seconds
  });
  
  // Process patient exercises data when it arrives
  useEffect(() => {
    if (patientExercises && patientExercises.length > 0) {
      const exercises = patientExercises.map((pe: any) => ({
        id: pe.id,
        name: pe.exerciseId === 1 ? 'Shoulder External Rotation' :
              pe.exerciseId === 2 ? 'Shoulder Flexion' :
              pe.exerciseId === 3 ? 'Prone Scapular Retraction' :
              pe.exerciseId === 4 ? 'Internal Rotation Stretch' : 
              `Exercise ${pe.exerciseId}`,
        completed: pe.completed,
        inProgress: false
      }));
      
      // Mark the current exercise as in progress
      exercises[currentExerciseIndex].inProgress = true;
      
      setExerciseList(exercises);
    } else {
      // If no exercises are available, create some placeholder data
      setExerciseList([
        { id: 1, name: 'Shoulder External Rotation', completed: true, inProgress: false },
        { id: 2, name: 'Shoulder Flexion', completed: true, inProgress: false },
        { id: 3, name: 'Shoulder External Rotation', completed: false, inProgress: true },
        { id: 4, name: 'Shoulder Internal Rotation', completed: false, inProgress: false }
      ]);
    }
  }, [patientExercises, currentExerciseIndex]);
  
  // Handle changing the current exercise
  const handleExerciseChange = (index: number) => {
    // Update the inProgress state for all exercises
    const updatedExercises = exerciseList.map((ex, i) => ({
      ...ex,
      inProgress: i === index
    }));
    
    setExerciseList(updatedExercises);
    setCurrentExerciseIndex(index);
  };
  
  // Handle completing an exercise
  const handleCompleteExercise = async (index: number) => {
    try {
      // In a real app, this would call the API to mark the exercise as completed
      // await completeExercise(exerciseList[index].id, 85, 'Completed with good form');
      
      const updatedExercises = [...exerciseList];
      updatedExercises[index] = {
        ...updatedExercises[index],
        completed: true
      };
      
      setExerciseList(updatedExercises);
      
      toast({
        title: "Exercise completed",
        description: `${exerciseList[index].name} marked as completed`,
      });
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast({
        title: "Error",
        description: "Failed to complete exercise. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle feedback from the pose analyzer
  const handlePoseAnalyzed = (feedback: any) => {
    if (feedback && feedback.issues && feedback.issues.length > 0) {
      setPostureFeedback(feedback.issues[0]);
    } else {
      setPostureFeedback(null);
    }
  };
  
  // Handle applying AI recommendations
  const handleApplyRecommendations = () => {
    toast({
      title: "Recommendations Applied",
      description: "Exercise plan updated with AI recommendations",
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Active Patient Session</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed Column */}
        <div className="lg:col-span-2">
          <MotionTracker
            patientId={1}
            patientName={patientData?.fullName || "John Doe"}
            condition={patientData?.condition || "Shoulder Rehabilitation"}
            exerciseId={exerciseList[currentExerciseIndex]?.id || 1}
            exerciseName={exerciseList[currentExerciseIndex]?.name || "No exercise selected"}
            onPoseAnalyzed={handlePoseAnalyzed}
          />
        </div>
        
        {/* Session Information Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Real-time Feedback */}
          <RealTimeFeedback postureFeedback={postureFeedback} />
          
          {/* Session Progress */}
          {exerciseList.length > 0 && (
            <ExerciseControls
              exercises={exerciseList}
              currentExerciseIndex={currentExerciseIndex}
              onExerciseChange={handleExerciseChange}
              onComplete={handleCompleteExercise}
            />
          )}
          
          {/* AI Recommendations */}
          <Card>
            <CardHeader className="flex justify-between items-center p-4 border-b border-neutral-100">
              <CardTitle className="text-lg font-medium">AI Recommendations</CardTitle>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-light bg-opacity-20 text-accent">
                Updated
              </span>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="bg-neutral-50 p-3 rounded-md border border-neutral-100">
                    <h4 className="font-medium text-neutral-900">
                      {index === 0 ? 'Adjust Exercise Intensity' : 'Add New Exercise'}
                    </h4>
                    <p className="mt-1 text-sm text-neutral-600">{rec}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-center text-primary border-primary"
                  onClick={handleApplyRecommendations}
                >
                  Apply Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Session;
