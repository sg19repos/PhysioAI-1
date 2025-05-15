import React, { useState } from 'react';
import { Text, Box, Cylinder, Sphere } from '@react-three/drei';
import { useXREvent, useController } from '@react-three/xr';
import { useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { ExerciseType, GameTheme } from '@/pages/vr-therapy';

interface ExerciseControlsProps {
  onExerciseChange: (type: ExerciseType) => void;
  onThemeChange: (theme: GameTheme) => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onStart: () => void;
  onStop: () => void;
}

const ExerciseControls: React.FC<ExerciseControlsProps> = ({
  onExerciseChange,
  onThemeChange,
  onDifficultyChange,
  onStart,
  onStop
}) => {
  const { camera } = useThree();
  const rightController = useController('right');
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'exercise' | 'theme' | 'difficulty'>('exercise');
  
  // Position the control panel in front of the player
  const getControlPosition = () => {
    const position = new THREE.Vector3();
    position.copy(camera.position);
    
    // Offset in front of the camera
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.multiplyScalar(1.5); // 1.5 units in front
    
    position.add(forward);
    position.y -= 0.3; // Slightly lower than eye level
    
    return position;
  };
  
  // Handle button press events from controllers
  useXREvent('select', () => {
    if (rightController) {
      // Toggle menu with the controller
      setMenuOpen(!menuOpen);
    }
  });
  
  // Allow clicking UI elements
  const handleButtonClick = (action: string, value?: string) => {
    switch (action) {
      case 'toggleMenu':
        setMenuOpen(!menuOpen);
        break;
      case 'changeTab':
        if (value === 'exercise' || value === 'theme' || value === 'difficulty') {
          setActiveTab(value);
        }
        break;
      case 'selectExercise':
        if (value) {
          onExerciseChange(value as ExerciseType);
        }
        break;
      case 'selectTheme':
        if (value) {
          onThemeChange(value as GameTheme);
        }
        break;
      case 'selectDifficulty':
        if (value === 'easy' || value === 'medium' || value === 'hard') {
          onDifficultyChange(value);
        }
        break;
      case 'start':
        onStart();
        setMenuOpen(false);
        break;
      case 'stop':
        onStop();
        break;
    }
  };
  
  // Create a clickable button
  const ControlButton = ({ 
    position, 
    label, 
    color = '#4a4a9c', 
    width = 0.3,
    action,
    value
  }: {
    position: [number, number, number];
    label: string;
    color?: string;
    width?: number;
    action: string;
    value?: string;
  }) => (
    <group position={position}>
      <Box 
        args={[width, 0.12, 0.05]} 
        onClick={() => handleButtonClick(action, value)}
      >
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.05}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
  
  if (!menuOpen) {
    // Just show a floating button when menu is closed
    return (
      <group position={getControlPosition()}>
        <Cylinder 
          args={[0.05, 0.05, 0.02, 32]} 
          rotation={[Math.PI/2, 0, 0]}
          onClick={() => setMenuOpen(true)}
        >
          <meshStandardMaterial color="#2a2a7c" />
        </Cylinder>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.02}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Menu
        </Text>
      </group>
    );
  }
  
  return (
    <group position={getControlPosition()}>
      {/* Menu background panel */}
      <Box args={[1.2, 0.8, 0.05]} position={[0, 0, -0.025]}>
        <meshStandardMaterial color="#1a1a3a" opacity={0.8} transparent />
      </Box>
      
      {/* Menu header */}
      <Text
        position={[0, 0.32, 0]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Exercise Controls
      </Text>
      
      {/* Menu tabs */}
      <group position={[0, 0.22, 0]}>
        <ControlButton 
          position={[-0.4, 0, 0]} 
          label="Exercise" 
          color={activeTab === 'exercise' ? '#4a6afc' : '#4a4a9c'}
          width={0.25}
          action="changeTab"
          value="exercise"
        />
        <ControlButton 
          position={[0, 0, 0]} 
          label="Theme" 
          color={activeTab === 'theme' ? '#4a6afc' : '#4a4a9c'}
          width={0.25}
          action="changeTab"
          value="theme"
        />
        <ControlButton 
          position={[0.4, 0, 0]} 
          label="Difficulty" 
          color={activeTab === 'difficulty' ? '#4a6afc' : '#4a4a9c'}
          width={0.25}
          action="changeTab"
          value="difficulty"
        />
      </group>
      
      {/* Tab content */}
      <group position={[0, 0, 0]}>
        {activeTab === 'exercise' && (
          <group>
            <ControlButton 
              position={[-0.4, 0.1, 0]} 
              label="Shoulder Flexion" 
              action="selectExercise"
              value="shoulderFlexion"
            />
            <ControlButton 
              position={[0.4, 0.1, 0]} 
              label="Shoulder Rotation" 
              action="selectExercise"
              value="shoulderRotation"
            />
            <ControlButton 
              position={[-0.4, -0.1, 0]} 
              label="Knee Flexion" 
              action="selectExercise"
              value="kneeFlexion"
            />
            <ControlButton 
              position={[0.4, -0.1, 0]} 
              label="Balance Training" 
              action="selectExercise"
              value="balanceTraining"
            />
          </group>
        )}
        
        {activeTab === 'theme' && (
          <group>
            <ControlButton 
              position={[-0.4, 0.1, 0]} 
              label="Underwater" 
              color="#0077be"
              action="selectTheme"
              value="underwater"
            />
            <ControlButton 
              position={[0.4, 0.1, 0]} 
              label="Space" 
              color="#000066"
              action="selectTheme"
              value="space"
            />
            <ControlButton 
              position={[-0.4, -0.1, 0]} 
              label="Forest" 
              color="#228B22"
              action="selectTheme"
              value="forest"
            />
            <ControlButton 
              position={[0.4, -0.1, 0]} 
              label="Mountains" 
              color="#708090"
              action="selectTheme"
              value="mountains"
            />
          </group>
        )}
        
        {activeTab === 'difficulty' && (
          <group>
            <ControlButton 
              position={[-0.4, 0, 0]} 
              label="Easy" 
              color="#4caf50"
              action="selectDifficulty"
              value="easy"
            />
            <ControlButton 
              position={[0, 0, 0]} 
              label="Medium" 
              color="#ff9800"
              action="selectDifficulty"
              value="medium"
            />
            <ControlButton 
              position={[0.4, 0, 0]} 
              label="Hard" 
              color="#f44336"
              action="selectDifficulty"
              value="hard"
            />
          </group>
        )}
      </group>
      
      {/* Action buttons */}
      <group position={[0, -0.3, 0]}>
        <ControlButton 
          position={[-0.3, 0, 0]} 
          label="Start" 
          color="#4caf50"
          action="start"
        />
        <ControlButton 
          position={[0.3, 0, 0]} 
          label="Stop" 
          color="#f44336"
          action="stop"
        />
      </group>
      
      {/* Close button */}
      <Sphere 
        position={[0.55, 0.35, 0]} 
        args={[0.04, 16, 16]}
        onClick={() => setMenuOpen(false)}
      >
        <meshStandardMaterial color="#f44336" />
      </Sphere>
      <Text
        position={[0.55, 0.35, 0.05]}
        fontSize={0.04}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>
    </group>
  );
};

export default ExerciseControls;