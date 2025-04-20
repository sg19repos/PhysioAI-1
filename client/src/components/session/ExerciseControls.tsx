import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Exercise {
  id: number;
  name: string;
  completed: boolean;
  inProgress: boolean;
}

interface ExerciseControlsProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  onExerciseChange: (index: number) => void;
  onComplete: (index: number) => void;
}

const ExerciseControls: React.FC<ExerciseControlsProps> = ({
  exercises,
  currentExerciseIndex,
  onExerciseChange,
  onComplete
}) => {
  const currentExercise = exercises[currentExerciseIndex];
  const progress = `${exercises.filter(e => e.completed).length}/${exercises.length}`;
  const progressPercentage = (exercises.filter(e => e.completed).length / exercises.length) * 100;
  
  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      onExerciseChange(currentExerciseIndex + 1);
    }
  };
  
  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      onExerciseChange(currentExerciseIndex - 1);
    }
  };
  
  const completeExercise = () => {
    onComplete(currentExerciseIndex);
    
    // Automatically move to next exercise if available
    if (currentExerciseIndex < exercises.length - 1) {
      setTimeout(() => nextExercise(), 500);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-neutral-900">{progress}</div>
            <div className="text-sm text-neutral-500">exercises completed</div>
          </div>
          <div className="w-20 h-20 relative">
            <svg className="transform -rotate-90" width="80" height="80">
              <circle
                className="text-neutral-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="32"
                cx="40"
                cy="40"
              />
              <circle
                className="text-primary"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="32"
                cx="40"
                cy="40"
                strokeDasharray="201"
                strokeDashoffset={201 - (201 * progressPercentage / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <div 
                key={exercise.id} 
                className={cn(
                  "flex items-center justify-between text-sm p-2 rounded cursor-pointer",
                  exercise.inProgress && "bg-blue-50",
                  exercise.completed && "bg-green-50"
                )}
                onClick={() => onExerciseChange(index)}
              >
                <span className={cn(
                  "text-neutral-600",
                  exercise.inProgress && "text-blue-600 font-medium",
                  exercise.completed && "text-green-600 font-medium"
                )}>
                  {exercise.name}
                </span>
                <span className="font-medium">
                  {exercise.completed ? (
                    <Badge variant="success" className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : exercise.inProgress ? (
                    <Badge variant="default" className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  ) : (
                    <span className="text-neutral-400">Upcoming</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={previousExercise}
            disabled={currentExerciseIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={completeExercise}
            disabled={exercises[currentExerciseIndex].completed}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" /> 
            {exercises[currentExerciseIndex].completed ? 'Completed' : 'Complete Exercise'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={nextExercise}
            disabled={currentExerciseIndex === exercises.length - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseControls;
