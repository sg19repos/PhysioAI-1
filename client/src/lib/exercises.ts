import { Exercise } from "@shared/schema";
import { apiRequest } from './queryClient';

// Function to fetch all exercises from the API
export async function fetchAllExercises(): Promise<Exercise[]> {
  try {
    const response = await fetch('/api/exercises');
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}

// Function to fetch exercises by body part
export async function fetchExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
  try {
    const response = await fetch(`/api/exercises/body-part/${bodyPart}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for ${bodyPart}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching exercises for ${bodyPart}:`, error);
    throw error;
  }
}

// Function to fetch exercise by ID
export async function fetchExerciseById(id: number): Promise<Exercise> {
  try {
    const response = await fetch(`/api/exercises/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch exercise with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching exercise with ID ${id}:`, error);
    throw error;
  }
}

// Function to fetch exercises assigned to a patient
export async function fetchPatientExercises(patientId: number): Promise<any[]> {
  try {
    const response = await fetch(`/api/patients/${patientId}/exercises`);
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for patient ${patientId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching exercises for patient ${patientId}:`, error);
    throw error;
  }
}

// Function to assign an exercise to a patient
export async function assignExerciseToPatient(
  patientId: number,
  exerciseId: number,
  sets: number,
  reps: number,
  durationSeconds?: number
): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/patient-exercises', {
      patientId,
      exerciseId,
      sets,
      reps,
      durationSeconds,
      assigned: true
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error assigning exercise:', error);
    throw error;
  }
}

// Function to mark an exercise as completed
export async function completeExercise(
  patientExerciseId: number,
  performance: number,
  feedback?: string
): Promise<any> {
  try {
    const response = await apiRequest(
      'PATCH',
      `/api/patient-exercises/${patientExerciseId}/complete`,
      { performance, feedback }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error completing exercise:', error);
    throw error;
  }
}

// Function to get AI exercise recommendations
export async function getAIRecommendations(
  patientId: number,
  bodyPart: string,
  currentExerciseIds: number[]
): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/ai/recommend-exercises', {
      patientId,
      bodyPart,
      currentExerciseIds
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
}

// Helper function to get difficulty label and color
export function getDifficultyInfo(difficulty: string): { label: string; color: string } {
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  
  const colorMap: Record<string, string> = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800"
  };
  
  return {
    label,
    color: colorMap[difficulty] || "bg-gray-100 text-gray-800"
  };
}

// Exercise difficulty expectations based on body part
export const exerciseExpectations: Record<string, Record<string, any>> = {
  shoulder: {
    // Expected angle ranges for shoulder exercises
    externalRotation: {
      rightElbowFlexion: [80, 100], // Elbow should be at ~90 degrees
      rightShoulderFlexion: [80, 100], // Shoulder should be neutral
      // For external rotation, the angle is measured between forearm and torso
    },
    flexion: {
      rightShoulderFlexion: [150, 180], // Arm should be raised high
      rightElbowFlexion: [160, 180], // Elbow should be straight
    },
    abduction: {
      rightShoulderFlexion: [80, 100], // Shoulder neutral
      // Additional geometric calculations would be needed for actual abduction
    }
  },
  knee: {
    extension: {
      rightKneeFlexion: [160, 180], // Knee should be straight
    },
    flexion: {
      rightKneeFlexion: [30, 90], // Knee should be bent
    }
  }
};
