import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, PlusCircle, BarChart2 } from "lucide-react";
import ExerciseCard from '@/components/exercises/ExerciseCard';
import { Exercise } from '@shared/schema';
import { getAIRecommendations, assignExerciseToPatient } from '@/lib/exercises';
import { useToast } from '@/hooks/use-toast';

const Exercises = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);
  const [assignedExercises, setAssignedExercises] = useState<number[]>([]);
  
  // Fetch all exercises
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['/api/exercises'],
    staleTime: 300000 // 5 minutes
  });
  
  // Fetch patient exercises for the active patient
  const { data: patientExercises } = useQuery({
    queryKey: ['/api/patients/1/exercises'],
    staleTime: 60000 // 1 minute
  });
  
  // Update assigned exercises when patient exercises are loaded
  useEffect(() => {
    if (patientExercises) {
      const assignedIds = patientExercises.map((pe: any) => pe.exerciseId);
      setAssignedExercises(assignedIds);
    }
  }, [patientExercises]);
  
  // Fetch AI recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendations = await getAIRecommendations(1, 'shoulder', assignedExercises);
        if (recommendations && recommendations.length > 0) {
          const exercises = recommendations.map((rec: any) => rec.exercise);
          setRecommendedExercises(exercises);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    
    if (assignedExercises.length > 0) {
      fetchRecommendations();
    }
  }, [assignedExercises]);
  
  // Filter exercises based on search, tab, and difficulty
  const filteredExercises = exercises?.filter((exercise: Exercise) => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by body part tab
    const matchesTab = activeTab === 'all' || exercise.bodyPart === activeTab;
    
    // Filter by difficulty
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    
    return matchesSearch && matchesTab && matchesDifficulty;
  }) || [];
  
  // Handle assigning an exercise
  const handleAssignExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowAssignDialog(true);
  };
  
  // Submit exercise assignment
  const handleSubmitAssignment = async () => {
    if (!selectedExercise) return;
    
    try {
      // Call API to assign exercise
      await assignExerciseToPatient(1, selectedExercise.id, 3, 12);
      
      // Add to assigned exercises
      setAssignedExercises([...assignedExercises, selectedExercise.id]);
      
      // Close dialog and show success toast
      setShowAssignDialog(false);
      
      toast({
        title: "Exercise Assigned",
        description: `${selectedExercise.name} has been assigned to the patient.`,
      });
    } catch (error) {
      console.error('Error assigning exercise:', error);
      toast({
        title: "Assignment Failed",
        description: "There was a problem assigning the exercise. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate counts for difficulty badges
  const difficultyCount = {
    beginner: exercises?.filter((e: Exercise) => e.difficulty === 'beginner').length || 0,
    intermediate: exercises?.filter((e: Exercise) => e.difficulty === 'intermediate').length || 0,
    advanced: exercises?.filter((e: Exercise) => e.difficulty === 'advanced').length || 0
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Exercise Library</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Browse and assign exercises to patients
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button className="inline-flex items-center">
            <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
            Create New Exercise
          </Button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Input 
            type="text" 
            placeholder="Search exercises..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-500">Difficulty:</span>
          <select 
            className="bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>
      
      {/* Difficulty Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className={filterDifficulty === 'all' ? 'bg-neutral-100' : ''}>
          All ({exercises?.length || 0})
        </Badge>
        <Badge 
          variant="outline" 
          className={`bg-green-50 text-green-700 border-green-200 ${filterDifficulty === 'beginner' ? 'bg-green-100' : ''}`}
          onClick={() => setFilterDifficulty(filterDifficulty === 'beginner' ? 'all' : 'beginner')}
        >
          Beginner ({difficultyCount.beginner})
        </Badge>
        <Badge 
          variant="outline" 
          className={`bg-blue-50 text-blue-700 border-blue-200 ${filterDifficulty === 'intermediate' ? 'bg-blue-100' : ''}`}
          onClick={() => setFilterDifficulty(filterDifficulty === 'intermediate' ? 'all' : 'intermediate')}
        >
          Intermediate ({difficultyCount.intermediate})
        </Badge>
        <Badge 
          variant="outline" 
          className={`bg-purple-50 text-purple-700 border-purple-200 ${filterDifficulty === 'advanced' ? 'bg-purple-100' : ''}`}
          onClick={() => setFilterDifficulty(filterDifficulty === 'advanced' ? 'all' : 'advanced')}
        >
          Advanced ({difficultyCount.advanced})
        </Badge>
      </div>
      
      {/* Exercise Tabs */}
      <Tabs 
        defaultValue="all" 
        className="mt-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Exercises</TabsTrigger>
          <TabsTrigger value="shoulder">Shoulder</TabsTrigger>
          <TabsTrigger value="back">Back</TabsTrigger>
          <TabsTrigger value="knee">Knee</TabsTrigger>
          <TabsTrigger value="ankle">Ankle</TabsTrigger>
          <TabsTrigger value="hip">Hip</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {/* AI Recommendations */}
          {recommendedExercises.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <BarChart2 className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-medium">AI Recommended Exercises</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendedExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    isRecommended={true}
                    onAssign={handleAssignExercise}
                    alreadyAssigned={assignedExercises.includes(exercise.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All Exercises */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <p className="col-span-full text-center py-8">Loading exercises...</p>
            ) : filteredExercises.length === 0 ? (
              <p className="col-span-full text-center py-8">No exercises found matching your criteria</p>
            ) : (
              filteredExercises.map((exercise: Exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isRecommended={recommendedExercises.some(rec => rec.id === exercise.id)}
                  onAssign={handleAssignExercise}
                  alreadyAssigned={assignedExercises.includes(exercise.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Body Part Specific Tabs */}
        {['shoulder', 'back', 'knee', 'ankle', 'hip'].map(bodyPart => (
          <TabsContent key={bodyPart} value={bodyPart} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <p className="col-span-full text-center py-8">Loading exercises...</p>
              ) : filteredExercises.length === 0 ? (
                <p className="col-span-full text-center py-8">No {bodyPart} exercises found matching your criteria</p>
              ) : (
                filteredExercises.map((exercise: Exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    isRecommended={recommendedExercises.some(rec => rec.id === exercise.id)}
                    onAssign={handleAssignExercise}
                    alreadyAssigned={assignedExercises.includes(exercise.id)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Exercise</DialogTitle>
            <DialogDescription>
              Set repetitions and sets for this exercise
            </DialogDescription>
          </DialogHeader>
          
          {selectedExercise && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded bg-neutral-100 flex items-center justify-center overflow-hidden">
                  {selectedExercise.imageUrl ? (
                    <img 
                      src={selectedExercise.imageUrl} 
                      alt={selectedExercise.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <BarChart2 className="h-8 w-8 text-neutral-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedExercise.name}</h3>
                  <p className="text-sm text-neutral-500">{selectedExercise.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sets</label>
                  <Input type="number" defaultValue="3" min="1" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Repetitions</label>
                  <Input type="number" defaultValue="12" min="1" className="mt-1" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Additional Instructions</label>
                <Input type="text" placeholder="Any specific guidance for this patient" className="mt-1" />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAssignment}>
              Assign to Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exercises;
