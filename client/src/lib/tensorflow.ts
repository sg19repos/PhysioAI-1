import * as tf from '@tensorflow/react';

// This is a simplified AI recommendation system for the MVP
// In a production application, this would be much more sophisticated

// Function to predict recovery timeline based on progress measurements
export async function predictRecoveryTimeline(
  progressData: Array<{
    date: Date;
    rangeOfMotion: {
      flexion: number;
      abduction: number;
      externalRotation: number;
      internalRotation: number;
    };
    postureQuality: number;
    painLevel: number;
  }>
) {
  // For the MVP, we'll use a simple linear progression model
  // In a real app, this would use TensorFlow.js for more sophisticated predictions
  
  if (progressData.length < 2) {
    return {
      estimatedFullRecovery: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks from now
      confidenceScore: 0.6,
      currentPhase: 'initial',
      nextMilestone: {
        name: 'Basic ROM Restored',
        estimatedDate: new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000) // 3 weeks from now
      }
    };
  }
  
  // Sort data by date
  const sortedData = [...progressData].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Calculate average improvement per week for ROM
  const firstMeasurement = sortedData[0];
  const latestMeasurement = sortedData[sortedData.length - 1];
  const weeksPassed = (latestMeasurement.date.getTime() - firstMeasurement.date.getTime()) / (7 * 24 * 60 * 60 * 1000);
  
  if (weeksPassed < 0.5) {
    return {
      estimatedFullRecovery: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks from now
      confidenceScore: 0.6,
      currentPhase: 'initial',
      nextMilestone: {
        name: 'Basic ROM Restored',
        estimatedDate: new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000) // 3 weeks from now
      }
    };
  }
  
  // Calculate ROM improvement rate (simplified)
  const flexionImprovement = (latestMeasurement.rangeOfMotion.flexion - firstMeasurement.rangeOfMotion.flexion) / weeksPassed;
  const abductionImprovement = (latestMeasurement.rangeOfMotion.abduction - firstMeasurement.rangeOfMotion.abduction) / weeksPassed;
  
  // Target values for full recovery (example values)
  const targetFlexion = 180;
  const targetAbduction = 180;
  
  // Estimate weeks to reach targets
  const weeksToFlexionTarget = (targetFlexion - latestMeasurement.rangeOfMotion.flexion) / flexionImprovement;
  const weeksToAbductionTarget = (targetAbduction - latestMeasurement.rangeOfMotion.abduction) / abductionImprovement;
  
  // Use the maximum of the two estimates
  const weeksToFullRecovery = Math.max(weeksToFlexionTarget, weeksToAbductionTarget);
  
  // Add buffer for unexpected delays
  const bufferedWeeks = weeksToFullRecovery * 1.2;
  
  // Calculate estimated full recovery date
  const estimatedFullRecovery = new Date(latestMeasurement.date.getTime() + bufferedWeeks * 7 * 24 * 60 * 60 * 1000);
  
  // Determine current phase
  let currentPhase = 'initial';
  let nextMilestone = {
    name: 'Basic ROM Restored',
    estimatedDate: new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000) // Default 3 weeks
  };
  
  const latestROM = latestMeasurement.rangeOfMotion;
  
  if (latestROM.flexion >= 120 && latestROM.abduction >= 120) {
    currentPhase = 'advanced_mobility';
    nextMilestone = {
      name: 'Full Recovery',
      estimatedDate: estimatedFullRecovery
    };
  } else if (latestROM.flexion >= 90 && latestROM.abduction >= 90) {
    currentPhase = 'strength_building';
    nextMilestone = {
      name: 'Advanced Mobility',
      estimatedDate: new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000) // 3 weeks from now
    };
  } else if (latestROM.flexion >= 60 && latestROM.abduction >= 60) {
    currentPhase = 'basic_rom_restored';
    nextMilestone = {
      name: 'Strength Building',
      estimatedDate: new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000) // 2 weeks from now
    };
  }
  
  // Calculate confidence score based on consistency of improvement
  const confidenceScore = calculateConfidenceScore(sortedData);
  
  return {
    estimatedFullRecovery,
    confidenceScore,
    currentPhase,
    nextMilestone
  };
}

// Helper function to calculate confidence score
function calculateConfidenceScore(progressData: any[]) {
  // Base confidence
  let confidenceScore = 0.7;
  
  // Higher confidence with more data points
  confidenceScore += Math.min(progressData.length * 0.03, 0.15);
  
  // Check for consistent improvement
  let consistentImprovement = true;
  for (let i = 1; i < progressData.length; i++) {
    const current = progressData[i];
    const previous = progressData[i-1];
    
    if (current.rangeOfMotion.flexion <= previous.rangeOfMotion.flexion ||
        current.rangeOfMotion.abduction <= previous.rangeOfMotion.abduction) {
      consistentImprovement = false;
      break;
    }
  }
  
  if (consistentImprovement) {
    confidenceScore += 0.1;
  } else {
    confidenceScore -= 0.1;
  }
  
  // Limit to valid range
  return Math.max(0.5, Math.min(0.95, confidenceScore));
}

// Function to recommend exercises based on patient progress
export async function recommendExercises(
  patientId: number,
  currentExercises: Array<{id: number; performance: number}>,
  bodyPart: string,
  progressData: any[]
) {
  // In a real application, this would use TensorFlow.js to analyze patterns
  // and recommend appropriate exercises based on ML models
  
  // For the MVP, we'll use simple rules-based recommendations
  const exerciseRecommendations = [];
  
  // Mock analysis of current performance and progress
  const averagePerformance = currentExercises.reduce((sum, ex) => sum + ex.performance, 0) / 
                            (currentExercises.length || 1);
  
  const recentProgress = progressData.length > 1 
    ? progressData[progressData.length - 1].postureQuality - progressData[0].postureQuality
    : 10;
  
  // Fetch available exercises from API
  try {
    const response = await fetch(`/api/exercises/body-part/${bodyPart}`);
    if (!response.ok) throw new Error('Failed to fetch exercises');
    
    const availableExercises = await response.json();
    
    // Filter out already assigned exercises
    const currentExerciseIds = currentExercises.map(e => e.id);
    const newExercises = availableExercises.filter((ex: any) => 
      !currentExerciseIds.includes(ex.id)
    );
    
    // Recommend based on performance
    if (averagePerformance > 80) {
      // Patient is doing well, recommend more challenging exercises
      const advancedExercises = newExercises.filter((ex: any) => ex.difficulty === 'advanced' || ex.difficulty === 'intermediate');
      if (advancedExercises.length > 0) {
        exerciseRecommendations.push({
          exercise: advancedExercises[0],
          confidence: 0.85,
          reason: 'High performance on current exercises suggests readiness for more challenge'
        });
      }
    } else if (averagePerformance < 60) {
      // Patient is struggling, recommend easier exercises
      const beginnerExercises = newExercises.filter((ex: any) => ex.difficulty === 'beginner');
      if (beginnerExercises.length > 0) {
        exerciseRecommendations.push({
          exercise: beginnerExercises[0],
          confidence: 0.9,
          reason: 'Additional foundational exercises will help improve performance'
        });
      }
    }
    
    // Add variety based on progress
    if (recentProgress > 15) {
      // Good progress, add complementary exercise
      const complementaryExercises = newExercises.filter((ex: any) => 
        !exerciseRecommendations.some(rec => rec.exercise.id === ex.id)
      );
      
      if (complementaryExercises.length > 0) {
        exerciseRecommendations.push({
          exercise: complementaryExercises[0],
          confidence: 0.75,
          reason: 'Good progress indicates readiness for complementary exercises'
        });
      }
    }
    
    // If no recommendations were made, add a default recommendation
    if (exerciseRecommendations.length === 0 && newExercises.length > 0) {
      exerciseRecommendations.push({
        exercise: newExercises[0],
        confidence: 0.7,
        reason: 'Recommended to provide exercise variety and maintain engagement'
      });
    }
    
    return exerciseRecommendations;
  } catch (error) {
    console.error('Error recommending exercises:', error);
    return [];
  }
}
