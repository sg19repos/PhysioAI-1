import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Exercise } from "@shared/schema";

interface ExerciseCardProps {
  exercise: Exercise;
  isRecommended?: boolean;
  onAssign: (exercise: Exercise) => void;
  alreadyAssigned?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isRecommended = false,
  onAssign,
  alreadyAssigned = false
}) => {
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800"
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-neutral-200 relative">
        {exercise.imageUrl ? (
          <img 
            src={exercise.imageUrl} 
            alt={exercise.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image available
          </div>
        )}
        
        {isRecommended && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            Recommended
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-neutral-900">{exercise.name}</h3>
        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
          {exercise.description}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-neutral-500">
            <span>3 sets &times; 12 reps</span>
          </div>
          <div className="flex items-center">
            <Badge className={difficultyColor[exercise.difficulty as keyof typeof difficultyColor]}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </Badge>
          </div>
        </div>
        <Button 
          variant={alreadyAssigned ? "outline" : (isRecommended ? "default" : "outline")}
          className="mt-4 w-full"
          onClick={() => onAssign(exercise)}
          disabled={alreadyAssigned}
        >
          {alreadyAssigned ? 'Already Assigned' : 'Assign Exercise'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
