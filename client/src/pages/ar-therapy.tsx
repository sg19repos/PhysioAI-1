import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton } from '@react-three/xr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Slider } from '@/components/ui/slider';
import { Camera, Tablet, RotateCw, ZoomIn, Share2 } from 'lucide-react';

// AR exercise types
type ARExerciseType = 'rangeOfMotion' | 'postureCorrection' | 'balanceTraining' | 'walkingGait';

const ARTherapy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('intro');
  const [selectedExercise, setSelectedExercise] = useState<ARExerciseType>('rangeOfMotion');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [isARActive, setIsARActive] = useState<boolean>(false);
  const [deviceOrientation, setDeviceOrientation] = useState<string>('portrait');
  
  // Check if AR is supported on the device
  useEffect(() => {
    // Basic check for WebXR support
    if ('xr' in navigator) {
      // @ts-ignore - TS doesn't have proper types for the WebXR API
      navigator.xr?.isSessionSupported('immersive-ar')
        .then((supported) => {
          setIsARSupported(supported);
        })
        .catch(() => {
          setIsARSupported(false);
        });
    } else {
      setIsARSupported(false);
    }
    
    // Check device orientation
    const checkOrientation = () => {
      setDeviceOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };
    
    window.addEventListener('resize', checkOrientation);
    checkOrientation();
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);
  
  // Fetch user's assigned exercises
  const { data: exercises = [] } = useQuery<any[]>({
    queryKey: ['/api/exercises'],
  });

  // Get therapist-assigned exercise data
  const assignedExercises = exercises ? exercises.filter((exercise: any) => 
    exercise.type === 'mobility' || exercise.type === 'balance'
  ) : [];
  
  const handleARStart = () => {
    setIsARActive(true);
    setActiveTab('arView');
  };
  
  const handleAREnd = () => {
    setIsARActive(false);
  };
  
  return (
    <DashboardLayout title="AR Therapy">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AR Therapy Exercises</h1>
        <p className="text-neutral-600">
          Use augmented reality on your mobile device to follow guided exercises in your real environment.
        </p>
      </div>
      
      <Tabs defaultValue="intro" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="arView">AR Experience</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="intro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with AR Therapy</CardTitle>
              <CardDescription>
                Experience guided physiotherapy exercises in your real environment using augmented reality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <h3 className="text-lg font-medium mb-3">How AR Therapy Works</h3>
                  <p className="mb-3">
                    AR Therapy uses your device's camera to overlay exercise guides, targets, and feedback
                    in your real-world environment, making rehabilitation more engaging and effective.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Camera className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Camera Access</h4>
                        <p className="text-sm text-neutral-600">
                          You'll need to grant camera access to use AR features
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Tablet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Device Requirements</h4>
                        <p className="text-sm text-neutral-600">
                          Works best on newer smartphones and tablets
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <RotateCw className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Exercise Tracking</h4>
                        <p className="text-sm text-neutral-600">
                          AI algorithms track your movement accuracy
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <ZoomIn className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Calibration</h4>
                        <p className="text-sm text-neutral-600">
                          You'll be guided through a brief calibration process
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 bg-gray-100 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">AR Compatibility</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>Device Support:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        isARSupported === true ? 'bg-green-100 text-green-800' :
                        isARSupported === false ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {isARSupported === true ? 'AR Supported' :
                         isARSupported === false ? 'AR Not Supported' :
                         'Checking...'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span>Orientation:</span>
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {deviceOrientation}
                      </span>
                    </div>
                    
                    <div className="text-sm text-neutral-600 mt-4">
                      {isARSupported === false ? (
                        <p>Your device does not appear to support WebXR for AR experiences. 
                        You can still view demonstration videos and guides.</p>
                      ) : (
                        <p>For the best AR experience, make sure you're in a well-lit area 
                        with enough space to move freely.</p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleARStart} 
                    disabled={isARSupported === false}
                    className="w-full"
                  >
                    {isARSupported === null ? 'Checking AR Support...' :
                     isARSupported === false ? 'View Demo Only' :
                     'Start AR Experience'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommended Exercises</CardTitle>
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
                          setSelectedExercise(
                            exercise.targetArea?.toLowerCase().includes('shoulder') ? 'rangeOfMotion' :
                            exercise.targetArea?.toLowerCase().includes('back') ? 'postureCorrection' :
                            exercise.targetArea?.toLowerCase().includes('leg') ? 'walkingGait' :
                            'balanceTraining'
                          );
                          handleARStart();
                        }}
                      >
                        Start in AR
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
        </TabsContent>
        
        <TabsContent value="arView" className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className={`relative aspect-[9/16] md:aspect-[16/9] bg-black`}>
                {isARSupported !== false ? (
                  // AR Canvas Container
                  <div className="absolute inset-0">
                    <Canvas>
                      {/* AR content will go here */}
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                    </Canvas>
                    
                    {/* AR Button */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Button 
                        className="px-4 py-2 bg-primary text-white rounded-lg"
                        onClick={() => setIsARActive(!isARActive)}
                      >
                        {isARActive ? 'Exit AR' : 'Enter AR'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Fallback for non-AR devices
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <h3 className="text-xl font-medium mb-4">AR Not Available</h3>
                      <p className="mb-6">
                        Your device doesn't support AR features. Here's a video demonstration instead.
                      </p>
                      <div className="border-2 border-white/20 p-4 rounded-lg">
                        <p>Video demonstration would appear here</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Exercise info overlay */}
                <div className="absolute top-4 left-4 right-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {selectedExercise === 'rangeOfMotion' ? 'Range of Motion Exercise' :
                       selectedExercise === 'postureCorrection' ? 'Posture Correction' :
                       selectedExercise === 'balanceTraining' ? 'Balance Training' :
                       'Walking Gait Analysis'}
                    </h3>
                    <span className="px-2 py-1 bg-primary/80 rounded text-xs">
                      Level {difficulty}
                    </span>
                  </div>
                </div>
                
                {/* Controls overlay */}
                <div className="absolute bottom-20 left-4 right-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg text-white">
                  <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" className="text-white border-white/50 hover:bg-white/20 hover:text-white flex-1">
                      Pause
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white/50 hover:bg-white/20 hover:text-white flex-1">
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white/50 hover:bg-white/20 hover:text-white flex-1">
                      Guide
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Exercise Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Exercise Type</label>
                    <Select
                      value={selectedExercise}
                      onValueChange={(value) => setSelectedExercise(value as ARExerciseType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rangeOfMotion">Range of Motion</SelectItem>
                        <SelectItem value="postureCorrection">Posture Correction</SelectItem>
                        <SelectItem value="balanceTraining">Balance Training</SelectItem>
                        <SelectItem value="walkingGait">Walking Gait Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Difficulty Level: {difficulty}
                    </label>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[difficulty]}
                      onValueChange={(value) => setDifficulty(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Easy</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>AR Guidance Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 text-primary">1</span>
                    Find a well-lit area with enough space to move
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 text-primary">2</span>
                    Point your camera at a flat surface to establish the AR environment
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 text-primary">3</span>
                    Follow the virtual targets and guides for proper form
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 text-primary">4</span>
                    Move slowly and focus on accurate movement patterns
                  </li>
                </ul>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share Session</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>
                Browse available AR-enabled exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Range of Motion Exercises</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Guided exercises to improve joint mobility and flexibility
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedExercise('rangeOfMotion');
                      handleARStart();
                    }}
                  >
                    Start Exercise
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Posture Correction</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Real-time feedback to improve standing and sitting posture
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedExercise('postureCorrection');
                      handleARStart();
                    }}
                  >
                    Start Exercise
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Balance Training</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Games and exercises to improve stability and balance
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedExercise('balanceTraining');
                      handleARStart();
                    }}
                  >
                    Start Exercise
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Walking Gait Analysis</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Analysis and correction of walking patterns
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedExercise('walkingGait');
                      handleARStart();
                    }}
                  >
                    Start Exercise
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AR Settings</CardTitle>
              <CardDescription>
                Customize your AR therapy experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Visual Settings</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Guide Opacity
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={10}
                          defaultValue={[70]}
                          className="py-4"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Guide Size
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={10}
                          defaultValue={[50]}
                          className="py-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Movement Path</label>
                        <input type="checkbox" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Real-time Feedback</label>
                        <input type="checkbox" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Performance Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">High-Quality Rendering</label>
                        <input type="checkbox" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Battery Saver Mode</label>
                        <input type="checkbox" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Record Sessions</label>
                        <input type="checkbox" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Share Progress with Therapist</label>
                        <input type="checkbox" defaultChecked />
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
    </DashboardLayout>
  );
};

export default ARTherapy;