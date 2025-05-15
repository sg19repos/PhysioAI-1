import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ExerciseCard from '@/components/exercise/ExerciseCard';
import { Search, Filter, Activity, ArrowRight } from 'lucide-react';
import { Exercise } from '@shared/schema';
import { getRecommendedExercises } from '@/lib/recommendation-engine';

const ExercisesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const userId = 1; // This would come from authentication context

  // Fetch all exercises
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['/api/exercises'],
  });

  // Filter exercises by search term and difficulty
  const filteredExercises = exercises?.filter(exercise => {
    const matchesSearch = 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.targetArea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedFilter === 'all' || exercise.difficulty === selectedFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  // Group exercises by target area
  const groupedExercises = filteredExercises?.reduce<Record<string, Exercise[]>>((acc, exercise) => {
    if (!acc[exercise.targetArea]) {
      acc[exercise.targetArea] = [];
    }
    acc[exercise.targetArea].push(exercise);
    return acc;
  }, {});

  // Get recommended exercises based on user's progress
  const recommendedExercises = exercises ? getRecommendedExercises(exercises, userId, 5) : [];

  return (
    <DashboardLayout title="Exercises">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Exercises Library</h1>
        <p className="text-neutral-600">
          Browse and explore exercises recommended by your physiotherapist
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          <Input
            placeholder="Search exercises..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={selectedFilter === 'easy' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('easy')}
            size="sm"
          >
            Easy
          </Button>
          <Button 
            variant={selectedFilter === 'medium' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('medium')}
            size="sm"
          >
            Medium
          </Button>
          <Button 
            variant={selectedFilter === 'hard' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('hard')}
            size="sm"
          >
            Hard
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recommended">
        <TabsList className="mb-4">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="all">All Exercises</TabsTrigger>
          <TabsTrigger value="byArea">By Target Area</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p>Loading exercises...</p>
            ) : recommendedExercises.length > 0 ? (
              recommendedExercises.map((exercise) => (
                <Dialog key={exercise.id}>
                  <DialogTrigger asChild>
                    <div onClick={() => setSelectedExercise(exercise)}>
                      <ExerciseCard 
                        exercise={exercise}
                        isNew={exercise.id % 2 === 0} // Just for demonstration
                      />
                    </div>
                  </DialogTrigger>
                  {selectedExercise && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{selectedExercise.name}</DialogTitle>
                        <DialogDescription>
                          {selectedExercise.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Exercise Details</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Target Area</span>
                              <span className="font-medium">{selectedExercise.targetArea}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Difficulty</span>
                              <Badge variant="outline" className={
                                selectedExercise.difficulty === 'easy' 
                                  ? 'bg-green-100 text-green-800 border-none' 
                                  : selectedExercise.difficulty === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 border-none'
                                  : 'bg-red-100 text-red-800 border-none'
                              }>
                                {selectedExercise.difficulty.charAt(0).toUpperCase() + selectedExercise.difficulty.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Sets</span>
                              <span className="font-medium">{selectedExercise.sets}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Repetitions</span>
                              <span className="font-medium">{selectedExercise.reps}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Instructions</h3>
                          <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                            <li>Start by standing straight with your arms by your sides.</li>
                            <li>Slowly raise your arm forward and upward to shoulder height.</li>
                            <li>Hold the position for a few seconds.</li>
                            <li>Slowly lower your arm back to the starting position.</li>
                            <li>Repeat for the recommended number of repetitions.</li>
                          </ol>
                        </div>

                        <div className="flex justify-end">
                          <Button>
                            Start Exercise <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              ))
            ) : (
              <p>No recommended exercises found. Try browsing all exercises.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p>Loading exercises...</p>
            ) : filteredExercises && filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <Dialog key={exercise.id}>
                  <DialogTrigger asChild>
                    <div onClick={() => setSelectedExercise(exercise)}>
                      <ExerciseCard exercise={exercise} />
                    </div>
                  </DialogTrigger>
                  {selectedExercise && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{selectedExercise.name}</DialogTitle>
                        <DialogDescription>
                          {selectedExercise.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Exercise Details</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Target Area</span>
                              <span className="font-medium">{selectedExercise.targetArea}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Difficulty</span>
                              <Badge variant="outline" className={
                                selectedExercise.difficulty === 'easy' 
                                  ? 'bg-green-100 text-green-800 border-none' 
                                  : selectedExercise.difficulty === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 border-none'
                                  : 'bg-red-100 text-red-800 border-none'
                              }>
                                {selectedExercise.difficulty.charAt(0).toUpperCase() + selectedExercise.difficulty.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Sets</span>
                              <span className="font-medium">{selectedExercise.sets}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Repetitions</span>
                              <span className="font-medium">{selectedExercise.reps}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Instructions</h3>
                          <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                            <li>Start by standing straight with your arms by your sides.</li>
                            <li>Slowly raise your arm forward and upward to shoulder height.</li>
                            <li>Hold the position for a few seconds.</li>
                            <li>Slowly lower your arm back to the starting position.</li>
                            <li>Repeat for the recommended number of repetitions.</li>
                          </ol>
                        </div>

                        <div className="flex justify-end">
                          <Button>
                            Start Exercise <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Activity className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-medium text-neutral-800 mb-1">No Exercises Found</h3>
                <p className="text-neutral-600">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="byArea">
          {isLoading ? (
            <p>Loading exercises...</p>
          ) : groupedExercises && Object.keys(groupedExercises).length > 0 ? (
            Object.entries(groupedExercises).map(([targetArea, areaExercises]) => (
              <div key={targetArea} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 capitalize">{targetArea} Exercises</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {areaExercises.map((exercise) => (
                    <Dialog key={exercise.id}>
                      <DialogTrigger asChild>
                        <div onClick={() => setSelectedExercise(exercise)}>
                          <ExerciseCard exercise={exercise} />
                        </div>
                      </DialogTrigger>
                      {selectedExercise && (
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>{selectedExercise.name}</DialogTitle>
                            <DialogDescription>
                              {selectedExercise.description}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium">Exercise Details</h3>
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-neutral-600">Target Area</span>
                                  <span className="font-medium">{selectedExercise.targetArea}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-600">Difficulty</span>
                                  <Badge variant="outline" className={
                                    selectedExercise.difficulty === 'easy' 
                                      ? 'bg-green-100 text-green-800 border-none' 
                                      : selectedExercise.difficulty === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800 border-none'
                                      : 'bg-red-100 text-red-800 border-none'
                                  }>
                                    {selectedExercise.difficulty.charAt(0).toUpperCase() + selectedExercise.difficulty.slice(1)}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-600">Sets</span>
                                  <span className="font-medium">{selectedExercise.sets}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-600">Repetitions</span>
                                  <span className="font-medium">{selectedExercise.reps}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-medium mb-2">Instructions</h3>
                              <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                                <li>Start by standing straight with your arms by your sides.</li>
                                <li>Slowly raise your arm forward and upward to shoulder height.</li>
                                <li>Hold the position for a few seconds.</li>
                                <li>Slowly lower your arm back to the starting position.</li>
                                <li>Repeat for the recommended number of repetitions.</li>
                              </ol>
                            </div>

                            <div className="flex justify-end">
                              <Button>
                                Start Exercise <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-medium text-neutral-800 mb-1">No Exercises Found</h3>
              <p className="text-neutral-600">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ExercisesPage;
