import { Exercise } from '@shared/schema';
import { getExerciseDifficulty } from './exercise-analyzer';

// Get personalized exercise recommendations
export function getRecommendedExercises(
  allExercises: Exercise[],
  userId: number,
  count: number = 3
): Exercise[] {
  if (!allExercises || allExercises.length === 0) {
    return [];
  }

  // In a real application, we would:
  // 1. Use the user's progress history to determine which joints need most work
  // 2. Consider the user's pain levels and range of motion
  // 3. Factor in previous exercise performance
  // 4. Include physician/therapist input

  // For this demo, we'll implement a simplified recommendation algorithm:

  // 1. Score exercises based on various factors
  const scoredExercises = allExercises.map(exercise => {
    let score = 0;

    // Prioritize shoulder exercises for this user (assuming shoulder rehab)
    if (exercise.targetArea.toLowerCase().includes('shoulder')) {
      score += 5;
    }

    // Adjust score based on difficulty (prefer medium difficulty)
    if (exercise.difficulty === 'easy') {
      score += 3;
    } else if (exercise.difficulty === 'medium') {
      score += 5;
    } else if (exercise.difficulty === 'hard') {
      score += 2;
    }

    // Add some variability with a random factor
    score += Math.random() * 3;

    return { exercise, score };
  });

  // 2. Sort by score (descending)
  scoredExercises.sort((a, b) => b.score - a.score);

  // 3. Return the top 'count' exercises
  return scoredExercises.slice(0, count).map(item => item.exercise);
}

// Get exercises for a specific rehabilitation phase
export function getExercisesForPhase(
  allExercises: Exercise[],
  phase: 'initial' | 'middle' | 'advanced',
  targetArea?: string
): Exercise[] {
  if (!allExercises || allExercises.length === 0) {
    return [];
  }

  // Filter by target area if provided
  let filteredExercises = targetArea
    ? allExercises.filter(ex => ex.targetArea.toLowerCase() === targetArea.toLowerCase())
    : [...allExercises];

  // Filter by appropriate difficulty for the rehabilitation phase
  switch (phase) {
    case 'initial':
      filteredExercises = filteredExercises.filter(ex => ex.difficulty === 'easy');
      break;
    case 'middle':
      filteredExercises = filteredExercises.filter(ex => ex.difficulty === 'medium');
      break;
    case 'advanced':
      filteredExercises = filteredExercises.filter(ex => ex.difficulty === 'hard');
      break;
  }

  return filteredExercises;
}

// Predict recovery time based on progress data
export function predictRecoveryTimeline(
  currentRangeOfMotion: number,
  targetRangeOfMotion: number,
  progressRate: number, // degrees improved per week
  painLevel: number // 0-10 scale
): { weeksRemaining: number; predictedDate: Date } {
  // Calculate base recovery time
  const motionGapRemaining = targetRangeOfMotion - currentRangeOfMotion;
  let weeksRemaining = motionGapRemaining / progressRate;
  
  // Adjust based on pain level (higher pain might slow recovery)
  if (painLevel > 5) {
    weeksRemaining *= 1.3; // 30% longer if pain is significant
  }
  
  // Calculate predicted full recovery date
  const today = new Date();
  const predictedDate = new Date();
  predictedDate.setDate(today.getDate() + Math.round(weeksRemaining * 7));
  
  return {
    weeksRemaining: Math.round(weeksRemaining),
    predictedDate
  };
}

// Check if exercise should be progressed based on performance
export function shouldProgressExercise(
  currentExercise: Exercise,
  performanceQuality: number, // 0-100 scale
  consecutiveSuccesses: number
): boolean {
  // Criteria for progression:
  // 1. User has performed exercise with good form for several sessions
  // 2. Performance quality is high (>85%)
  // 3. User has had at least 3 consecutive successful sessions
  
  if (performanceQuality >= 85 && consecutiveSuccesses >= 3) {
    return true;
  }
  
  return false;
}

// Adapt exercise difficulty based on user performance
export function adaptExerciseDifficulty(
  exercise: Exercise,
  performanceQuality: number // 0-100 scale
): 'decrease' | 'maintain' | 'increase' {
  if (performanceQuality < 50) {
    return 'decrease'; // User is struggling, make it easier
  } else if (performanceQuality > 85) {
    return 'increase'; // User is doing well, make it more challenging
  } else {
    return 'maintain'; // User is performing adequately, maintain difficulty
  }
}
