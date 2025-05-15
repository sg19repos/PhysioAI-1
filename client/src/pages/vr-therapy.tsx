import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

// Exercise configuration types
export type ExerciseType = 'shoulderFlexion' | 'shoulderRotation' | 'kneeFlexion' | 'balanceTraining';
export type GameTheme = 'underwater' | 'space' | 'forest' | 'mountains';

export interface ExerciseConfig {
  type: ExerciseType;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: GameTheme;
  duration: number; // in seconds
  reps: number;
  requiresBothHands: boolean;
}

const VRTherapy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('immersive');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('shoulderFlexion');
  const [gameTheme, setGameTheme] = useState<GameTheme>('underwater');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [duration, setDuration] = useState<number>(120); // 2 minutes by default
  const [isInSession, setIsInSession] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Exercise configurations
  const exerciseConfig: ExerciseConfig = {
    type: selectedExercise,
    difficulty: difficulty,
    theme: gameTheme,
    duration: duration,
    reps: 10,
    requiresBothHands: selectedExercise === 'shoulderRotation'
  };

  // Fetch user's exercise history
  const { data: exercises = [] } = useQuery<any[]>({
    queryKey: ['/api/exercises'],
  });

  // Get exercises assigned to the user
  const assignedExercises = exercises.filter((exercise: any) => 
    exercise.targetArea?.toLowerCase().includes('shoulder') || 
    exercise.targetArea?.toLowerCase().includes('knee')
  );

  const handleStartSession = () => {
    setIsInSession(true);
    setScore(0);
    setProgress(0);
  };

  const handleEndSession = () => {
    setIsInSession(false);
    // Save session data to the backend - would be implemented in a real application
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(prevScore => prevScore + newScore);
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <DashboardLayout title="VR Therapy Session">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">VR/AR Therapy</h1>
        <p className="text-neutral-600">
          Experience immersive rehabilitation exercises in virtual reality with gamified elements to enhance your recovery.
        </p>
      </div>

      <Tabs defaultValue="immersive" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="immersive">Immersive VR</TabsTrigger>
          <TabsTrigger value="ar">AR Exercises</TabsTrigger>
          <TabsTrigger value="settings">Settings & Customization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="immersive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>VR Exercise Environment</CardTitle>
                  <CardDescription>
                    Enter an immersive virtual environment for your rehabilitation exercises
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="vr-container relative aspect-[16/9] bg-black rounded-lg overflow-hidden">
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <div className={`h-full w-full p-8 flex flex-col items-center justify-center ${
                        gameTheme === 'underwater' ? 'bg-blue-900' : 
                        gameTheme === 'space' ? 'bg-indigo-900' : 
                        gameTheme === 'forest' ? 'bg-green-900' : 
                        'bg-gray-700'
                      }`}>
                        <div className="text-white text-center mb-8">
                          <h3 className="text-xl font-bold mb-2">
                            {gameTheme === 'underwater' ? 'Underwater Therapy Environment' :
                             gameTheme === 'space' ? 'Space Rehabilitation Zone' :
                             gameTheme === 'forest' ? 'Forest Healing Sanctuary' :
                             'Mountain Recovery Area'}
                          </h3>
                          <p>
                            {isInSession ? 
                              `Current exercise: ${selectedExercise}` : 
                              'Start a session to begin exercises'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center mb-8">
                          <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                            isInSession ? 'animate-pulse' : ''
                          }`} style={{
                            backgroundColor: isInSession ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                          }}>
                            <div className={`w-24 h-24 rounded-full ${
                              selectedExercise === 'shoulderFlexion' ? 'bg-blue-500' :
                              selectedExercise === 'shoulderRotation' ? 'bg-purple-500' :
                              selectedExercise === 'kneeFlexion' ? 'bg-orange-500' :
                              'bg-green-500'
                            } flex items-center justify-center`}>
                              <span className="text-white font-bold">
                                {isInSession ? 'ACTIVE' : 'READY'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="flex justify-center">
                        <Button 
                          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                          onClick={isInSession ? handleEndSession : handleStartSession}
                        >
                          {isInSession ? 'Stop VR Session' : 'Start VR Session'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">{exercises.find((e: any) => e.name?.toLowerCase().includes(selectedExercise))?.name || 'Shoulder Flexion Exercise'}</h3>
                        <p className="text-sm text-neutral-600">Follow the guide and complete the movement pattern</p>
                      </div>
                      
                      {!isInSession ? (
                        <Button onClick={handleStartSession}>Start Session</Button>
                      ) : (
                        <Button variant="destructive" onClick={handleEndSession}>End Session</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Session Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Score</h3>
                      <div className="text-3xl font-bold text-primary">{score}</div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Current Exercise</h3>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={selectedExercise}
                          onValueChange={(value) => setSelectedExercise(value as ExerciseType)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Exercise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shoulderFlexion">Shoulder Flexion</SelectItem>
                            <SelectItem value="shoulderRotation">Shoulder Rotation</SelectItem>
                            <SelectItem value="kneeFlexion">Knee Flexion</SelectItem>
                            <SelectItem value="balanceTraining">Balance Training</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Theme</h3>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={gameTheme}
                          onValueChange={(value) => setGameTheme(value as GameTheme)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="underwater">Underwater World</SelectItem>
                            <SelectItem value="space">Space Adventure</SelectItem>
                            <SelectItem value="forest">Forest Retreat</SelectItem>
                            <SelectItem value="mountains">Mountain Journey</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Difficulty</h3>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={difficulty}
                          onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AR Exercises</CardTitle>
              <CardDescription>Use your device's camera to experience AR-based exercise guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-lg font-medium mb-2">AR Mode Coming Soon</h3>
                <p className="text-neutral-600 mb-4">
                  AR support for mobile devices is in development. This will allow you to use your camera 
                  to see exercise guides overlaid on your real environment.
                </p>
                <Button onClick={() => window.location.href = '/ar-therapy'} variant="outline">Try AR Therapy Beta</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Customization</CardTitle>
              <CardDescription>Personalize your VR/AR therapy experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Session Duration (seconds)</h3>
                    <input 
                      type="range" 
                      min="60" 
                      max="600" 
                      step="30" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span>1 min</span>
                      <span>{Math.round(duration / 60)} min</span>
                      <span>10 min</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Feedback Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="audioFeedback" className="mr-2" defaultChecked />
                        <label htmlFor="audioFeedback">Audio Feedback</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="hapticsEnabled" className="mr-2" defaultChecked />
                        <label htmlFor="hapticsEnabled">Haptic Feedback (when available)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="visualCues" className="mr-2" defaultChecked />
                        <label htmlFor="visualCues">Visual Exercise Guides</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Avatar Customization</h3>
                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                      <p className="text-sm text-neutral-600 mb-2">
                        Choose how your avatar appears in multiplayer therapy sessions
                      </p>
                      <Button variant="outline" size="sm">Customize Avatar</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Device Settings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>VR Quality</span>
                        <Select defaultValue="medium">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Audio Volume</span>
                        <input type="range" min="0" max="100" defaultValue="80" className="w-32" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full">Save Settings</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Exercises</CardTitle>
          <CardDescription>Exercises assigned by your therapist for VR/AR practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignedExercises.length > 0 ? (
              assignedExercises.slice(0, 3).map((exercise: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{exercise.name}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{exercise.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (exercise.targetArea?.toLowerCase().includes('shoulder')) {
                        setSelectedExercise('shoulderFlexion');
                      } else if (exercise.targetArea?.toLowerCase().includes('knee')) {
                        setSelectedExercise('kneeFlexion');
                      }
                      setActiveTab('immersive');
                      handleStartSession();
                    }}
                  >
                    Practice in VR
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-neutral-600">
                  No exercises have been assigned yet. Please check back later or contact your therapist.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default VRTherapy;