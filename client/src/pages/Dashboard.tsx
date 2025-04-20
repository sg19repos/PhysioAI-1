import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PatientSummaryCard from '@/components/dashboard/PatientSummaryCard';
import {
  RangeOfMotionChart,
  PostureQualityChart,
  RecoveryTimeline
} from '@/components/dashboard/ProgressCharts';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import GutrehaBSection from '@/components/gutrehaB/GutrehaBSection';
import { Exercise } from '@shared/schema';
import { getAIRecommendations } from '@/lib/exercises';

const Dashboard = () => {
  // State for loading the recovery data
  const [loading, setLoading] = useState(true);
  
  // Fetch active patients for the therapist
  const { data: patients } = useQuery({
    queryKey: ['/api/therapists/1/patients'],
    staleTime: 60000 // 1 minute
  });
  
  // Fetch active sessions
  const { data: sessions } = useQuery({
    queryKey: ['/api/therapists/1/active-sessions'],
    staleTime: 30000 // 30 seconds
  });
  
  // Fetch unresolved alerts
  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    staleTime: 30000 // 30 seconds
  });
  
  // Fetch progress data for the selected patient
  const { data: progressData } = useQuery({
    queryKey: ['/api/patients/1/progress'],
    staleTime: 60000 // 1 minute
  });
  
  // State for exercise recommendations
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);
  
  // Mock data for charts (in a production app, this would come from the API)
  const rangeOfMotionData = {
    dates: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    flexion: [90, 100, 105, 115, 125, 140, 150],
    abduction: [80, 85, 90, 100, 105, 120, 130]
  };
  
  const postureQualityData = {
    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    scores: [30, 50, 60, 70, 80, 90]
  };
  
  const recoveryPhases = [
    { title: 'Initial Assessment', date: '4 weeks ago', completed: true, current: false },
    { title: 'Basic ROM Restored', date: '2 weeks ago', completed: true, current: false },
    { title: 'Strength Building', date: 'Current Phase', completed: false, current: true },
    { title: 'Advanced Mobility', date: 'Est. 3 weeks', completed: false, current: false },
    { title: 'Full Recovery', date: 'Est. 8 weeks', completed: false, current: false }
  ];
  
  // Fetch exercise recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // In a real app, these parameters would come from the selected patient
        const recommendations = await getAIRecommendations(1, 'shoulder', [4]);
        if (recommendations && recommendations.length > 0) {
          const exercises = recommendations.map((rec: any) => rec.exercise);
          setRecommendedExercises(exercises);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    
    fetchRecommendations();
  }, []);
  
  // Handle assigning an exercise to a patient
  const handleAssignExercise = (exercise: Exercise) => {
    // In a real app, this would open a dialog to set reps/sets and then make an API call
    alert(`Exercise ${exercise.name} would be assigned to the patient`);
  };
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Therapist Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Monitor patient progress and exercise adherence
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button className="inline-flex items-center">
            <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
            Add New Patient
          </Button>
          
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search patient..." 
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <PatientSummaryCard
          title="Active Patients"
          subtitle="Total patients under care"
          value={patients?.length || 24}
          unit="of 30 target"
          percentage={80}
          badgeText="+12% this month"
          badgeColor="green"
          linkText="View all patients"
          linkHref="/patients"
        />
        
        <PatientSummaryCard
          title="Sessions Today"
          subtitle="Scheduled for today"
          value={sessions?.length || 8}
          unit="sessions"
          percentage={60}
          badgeText="3 upcoming"
          badgeColor="blue"
          linkText="View schedule"
          linkHref="/session"
        />
        
        <PatientSummaryCard
          title="Alerts"
          subtitle="Needs your attention"
          value={alerts?.length || 5}
          unit="issues"
          badgeText="2 critical"
          badgeColor="red"
          linkText="Address alerts"
          linkHref="/patients"
          items={[
            { color: "bg-red-500", text: "2 missed sessions" },
            { color: "bg-yellow-500", text: "3 form corrections needed" }
          ]}
        />
      </div>

      {/* Patient Progress Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-neutral-900">Patient Progress Dashboard</h2>
        
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RangeOfMotionChart data={rangeOfMotionData} />
          <PostureQualityChart data={postureQualityData} />
          <RecoveryTimeline phases={recoveryPhases} />
        </div>
      </div>

      {/* Exercise Recommendations */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-neutral-900">AI Exercise Recommendations</h2>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedExercises.length > 0 ? (
            recommendedExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isRecommended={true}
                onAssign={handleAssignExercise}
              />
            ))
          ) : (
            // Fallback to display example exercises if recommendations aren't available
            <>
              <ExerciseCard
                exercise={{
                  id: 1,
                  name: "External Rotation with Band",
                  description: "Targets rotator cuff muscles to improve shoulder stability",
                  imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                  difficulty: "intermediate",
                  bodyPart: "shoulder",
                  instructions: "Stand with elbow at side, bent to 90 degrees. Hold resistance band and rotate arm outward."
                } as Exercise}
                isRecommended={true}
                onAssign={handleAssignExercise}
              />
              
              <ExerciseCard
                exercise={{
                  id: 2,
                  name: "Wall Slides",
                  description: "Improves shoulder mobility and posture",
                  imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                  difficulty: "beginner",
                  bodyPart: "shoulder",
                  instructions: "Stand with back against wall, arms up in 'W' position."
                } as Exercise}
                onAssign={handleAssignExercise}
              />
              
              <ExerciseCard
                exercise={{
                  id: 3,
                  name: "Prone Scapular Retraction",
                  description: "Strengthens middle back muscles to improve posture",
                  imageUrl: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                  difficulty: "intermediate",
                  bodyPart: "shoulder",
                  instructions: "Lie on stomach with arms at sides, squeeze shoulder blades together."
                } as Exercise}
                isRecommended={true}
                onAssign={handleAssignExercise}
              />
              
              <ExerciseCard
                exercise={{
                  id: 4,
                  name: "Internal Rotation Stretch",
                  description: "Increases range of motion for internal shoulder rotation",
                  imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                  difficulty: "beginner",
                  bodyPart: "shoulder",
                  instructions: "Place hand behind lower back, gently pull elbow forward."
                } as Exercise}
                onAssign={handleAssignExercise}
              />
            </>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/exercises">
            <a className="text-primary hover:underline font-medium">
              View All Exercises
            </a>
          </Link>
        </div>
      </div>

      {/* GutrehaB Section */}
      <div id="gutrehab-section" className="mt-12">
        <GutrehaBSection />
      </div>
    </div>
  );
};

export default Dashboard;
