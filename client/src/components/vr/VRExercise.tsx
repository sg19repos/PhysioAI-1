import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR, useController } from '@react-three/xr';
import { Text, Sphere, Box, Line, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ExerciseConfig, ExerciseType, GameTheme } from '@/pages/vr-therapy';

interface VRExerciseProps {
  config: ExerciseConfig;
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

// Simplified mock of exercise targets and movement patterns
const VRExercise: React.FC<VRExerciseProps> = ({ config, onScoreUpdate, onProgressUpdate }) => {
  const { scene, clock } = useThree();
  const { player, isPresenting } = useXR();
  const rightController = useController('right');
  const leftController = useController('left');
  
  const [targetPositions, setTargetPositions] = useState<THREE.Vector3[]>([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [exerciseStartTime, setExerciseStartTime] = useState<number | null>(null);
  const [completedReps, setCompletedReps] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('green');
  
  const targetRef = useRef<THREE.Mesh>(null);
  const targetTrailRef = useRef<THREE.Line>(null);
  const handPositionRef = useRef(new THREE.Vector3());
  
  // Set up the exercise based on the type
  useEffect(() => {
    // Reset exercise state
    setCurrentTargetIndex(0);
    setCompletedReps(0);
    setCurrentScore(0);
    setExerciseStartTime(clock.getElapsedTime());
    
    // Generate target positions based on exercise type
    const newTargets: THREE.Vector3[] = [];
    
    switch (config.type) {
      case 'shoulderFlexion':
        // Create a vertical path for shoulder flexion (raising arm)
        for (let i = 0; i < 10; i++) {
          newTargets.push(new THREE.Vector3(
            0.3, // slightly to the right of center
            0.8 + (i * 0.2), // start at shoulder height, move upward
            -0.5 - (i * 0.05) // slightly forward
          ));
        }
        break;
        
      case 'shoulderRotation':
        // Create a circular path for shoulder rotation
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          newTargets.push(new THREE.Vector3(
            0.3 + Math.cos(angle) * 0.4,
            1.2, // at shoulder height
            -0.5 + Math.sin(angle) * 0.4
          ));
        }
        break;
        
      case 'kneeFlexion':
        // Create a path for knee bending exercise
        for (let i = 0; i < 8; i++) {
          newTargets.push(new THREE.Vector3(
            0.2, // slightly to the right
            0.5 - (i * 0.06), // move downward for knee bending
            -0.4 - (i * 0.05) // slightly forward
          ));
        }
        // Add return path (straightening leg)
        for (let i = 7; i >= 0; i--) {
          newTargets.push(new THREE.Vector3(
            0.2,
            0.5 - (i * 0.06),
            -0.4 - (i * 0.05)
          ));
        }
        break;
        
      case 'balanceTraining':
        // Create targets at different positions for balance training
        for (let i = 0; i < 16; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.3 + (i % 2) * 0.2; // alternate between two radii
          newTargets.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            1.0 + (Math.sin(i) * 0.1), // slight height variation
            -0.5 + Math.sin(angle) * radius
          ));
        }
        break;
        
      default:
        // Default exercise pattern
        for (let i = 0; i < 8; i++) {
          newTargets.push(new THREE.Vector3(
            0.3 * Math.sin(i),
            1.0 + (i * 0.1),
            -0.5 - (i * 0.05)
          ));
        }
    }
    
    // Scale difficulty based on the setting
    if (config.difficulty === 'medium') {
      // Add more points and make the movement more complex
      newTargets.forEach((target, i) => {
        if (i % 2 === 0) {
          target.x += 0.1 * Math.sin(i);
          target.y += 0.05 * Math.cos(i);
        }
      });
    } else if (config.difficulty === 'hard') {
      // Even more complex movement and faster timing
      newTargets.forEach((target, i) => {
        target.x += 0.15 * Math.sin(i * 2);
        target.y += 0.1 * Math.cos(i * 2);
        target.z += 0.05 * Math.sin(i);
      });
    }
    
    setTargetPositions(newTargets);
  }, [config.type, config.difficulty, clock]);
  
  // Update hand position from controllers
  useFrame(() => {
    if (!isPresenting) return;
    
    // Update hand position from controllers
    const activeController = config.requiresBothHands ? 
      (rightController && leftController ? 'both' : null) : 
      (rightController ? 'right' : (leftController ? 'left' : null));
    
    if (activeController === 'right' && rightController) {
      handPositionRef.current.copy(rightController.controller.position);
    } else if (activeController === 'left' && leftController) {
      handPositionRef.current.copy(leftController.controller.position);
    } else if (activeController === 'both' && rightController && leftController) {
      // Average position of both hands for two-handed exercises
      handPositionRef.current.copy(rightController.controller.position)
        .add(leftController.controller.position)
        .multiplyScalar(0.5);
    } else {
      // If no controllers, use a mouse-based approximation for testing
      return;
    }
    
    // Check if the current target is reached
    if (targetPositions.length > 0 && currentTargetIndex < targetPositions.length) {
      const currentTarget = targetPositions[currentTargetIndex];
      const distance = handPositionRef.current.distanceTo(currentTarget);
      
      // If close enough to the target
      if (distance < 0.15) {
        // Move to next target
        setCurrentTargetIndex(prev => prev + 1);
        
        // Add to score based on accuracy
        const accuracyScore = Math.max(10 - Math.floor(distance * 50), 1);
        setCurrentScore(prev => prev + accuracyScore);
        onScoreUpdate(accuracyScore);
        
        // Show feedback
        if (accuracyScore > 8) {
          showSuccess("Perfect!");
        } else if (accuracyScore > 5) {
          showSuccess("Great!");
        } else {
          showSuccess("Good");
        }
        
        // Check if completed a repetition
        if (currentTargetIndex === targetPositions.length - 1) {
          setCurrentTargetIndex(0); // reset for next rep
          setCompletedReps(prev => prev + 1);
          showSuccess("Repetition Complete!", "gold");
        }
      }
    }
    
    // Update progress percentage
    if (targetPositions.length > 0) {
      const totalPoints = targetPositions.length * config.reps;
      const completedPoints = (completedReps * targetPositions.length) + currentTargetIndex;
      const progressPercent = (completedPoints / totalPoints) * 100;
      onProgressUpdate(progressPercent);
      
      // Check if exercise is complete
      if (completedReps >= config.reps) {
        onProgressUpdate(100);
        showSuccess("Exercise Complete!", "gold");
      }
    }
    
    // Check for time-based progression
    if (exerciseStartTime !== null) {
      const elapsed = clock.getElapsedTime() - exerciseStartTime;
      
      // If we've reached the time limit
      if (elapsed >= config.duration) {
        onProgressUpdate(100);
        showSuccess("Time Complete!", "gold");
      }
    }
  });
  
  // Function to show feedback messages
  const showSuccess = (message: string, color = "green") => {
    setFeedbackMessage(message);
    setFeedbackColor(color);
    setShowFeedback(true);
    
    // Hide after a short delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 1500);
  };
  
  return (
    <group>
      {/* Current target sphere */}
      {targetPositions.length > 0 && currentTargetIndex < targetPositions.length && (
        <Sphere
          ref={targetRef}
          position={targetPositions[currentTargetIndex]}
          args={[0.1, 16, 16]}
        >
          <meshStandardMaterial color="#00ff00" emissive="#88ff88" emissiveIntensity={0.5} />
        </Sphere>
      )}
      
      {/* Path visualization (line showing exercise path) */}
      {targetPositions.length > 0 && (
        <Line
          ref={targetTrailRef}
          points={targetPositions}
          color={
            config.type === 'shoulderFlexion' ? 'blue' :
            config.type === 'shoulderRotation' ? 'purple' :
            config.type === 'kneeFlexion' ? 'orange' :
            'green'
          }
          lineWidth={1}
          dashed={true}
        />
      )}
      
      {/* Exercise instructions */}
      <Text
        position={[0, 1.7, -1.5]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {config.type === 'shoulderFlexion' 
          ? 'Raise your arm upward following the path' 
          : config.type === 'shoulderRotation'
          ? 'Rotate your shoulder in a circular motion'
          : config.type === 'kneeFlexion'
          ? 'Bend and straighten your knee'
          : 'Follow the targets with smooth movements'}
      </Text>
      
      {/* Exercise progress indicators */}
      <Text
        position={[1.2, 1.5, -1.5]}
        fontSize={0.1}
        color="white"
        anchorX="left"
        anchorY="middle"
      >
        {`Reps: ${completedReps}/${config.reps}`}
      </Text>
      
      <Text
        position={[1.2, 1.3, -1.5]}
        fontSize={0.1}
        color="white"
        anchorX="left"
        anchorY="middle"
      >
        {`Score: ${currentScore}`}
      </Text>
      
      {/* Visual feedback message */}
      {showFeedback && (
        <Text
          position={[0, 1.3, -1]}
          fontSize={0.2}
          color={feedbackColor}
          anchorX="center"
          anchorY="middle"
        >
          {feedbackMessage}
        </Text>
      )}
    </group>
  );
};

export { VRExercise };
export default VRExercise;