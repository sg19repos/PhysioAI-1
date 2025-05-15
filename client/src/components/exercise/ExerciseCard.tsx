import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight, Award, Clock, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exercise } from '@shared/schema';

interface ExerciseCardProps {
  exercise: Exercise;
  isNew?: boolean;
  onClick?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  isNew = false,
  onClick 
}) => {
  return (
    <Card 
      className="exercise-card p-3 border rounded-lg mb-3 hover:border-primary cursor-pointer transition-transform duration-200 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-neutral-800">{exercise.name}</h3>
          <p className="text-sm text-neutral-600 mt-1">{exercise.description}</p>
          <div className="flex items-center flex-wrap mt-2 gap-2">
            <span className="text-xs font-medium bg-blue-100 text-primary px-2 py-1 rounded flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {exercise.sets} sets
            </span>
            <span className="text-xs font-medium bg-blue-100 text-primary px-2 py-1 rounded flex items-center">
              <BarChart className="h-3 w-3 mr-1" />
              {exercise.reps} reps
            </span>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded flex items-center",
              exercise.difficulty === "easy" 
                ? "bg-green-100 text-green-700" 
                : exercise.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            )}>
              {exercise.difficulty}
            </span>
            {isNew && (
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded flex items-center">
                <Award className="h-3 w-3 mr-1" />
                New
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-400" />
      </div>
    </Card>
  );
};

export default ExerciseCard;
