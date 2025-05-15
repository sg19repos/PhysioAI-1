import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, useTexture } from '@react-three/drei';
import { GameTheme } from '@/pages/vr-therapy';
import * as THREE from 'three';

interface TherapyRoomProps {
  theme: GameTheme;
}

const TherapyRoom: React.FC<TherapyRoomProps> = ({ theme }) => {
  const roomRef = useRef<THREE.Group>(null);
  
  // Apply theme-specific settings
  const getThemeSettings = () => {
    switch(theme) {
      case 'underwater':
        return {
          fogColor: new THREE.Color(0x0077be),
          floorColor: new THREE.Color(0x006994),
          particleColor: new THREE.Color(0x80c9ff),
          skyboxColor: new THREE.Color(0x003366),
          ambientLight: 0.3,
          objectsToGenerate: 15
        };
      case 'space':
        return {
          fogColor: new THREE.Color(0x000020),
          floorColor: new THREE.Color(0x0a0a2a),
          particleColor: new THREE.Color(0xffffff),
          skyboxColor: new THREE.Color(0x000011),
          ambientLight: 0.1,
          objectsToGenerate: 25
        };
      case 'forest':
        return {
          fogColor: new THREE.Color(0x2e8b57),
          floorColor: new THREE.Color(0x228B22),
          particleColor: new THREE.Color(0xffff99),
          skyboxColor: new THREE.Color(0x87ceeb),
          ambientLight: 0.6,
          objectsToGenerate: 10
        };
      case 'mountains':
        return {
          fogColor: new THREE.Color(0xb0c4de),
          floorColor: new THREE.Color(0xa9a9a9),
          particleColor: new THREE.Color(0xffffff),
          skyboxColor: new THREE.Color(0x4682b4),
          ambientLight: 0.7,
          objectsToGenerate: 8
        };
      default:
        return {
          fogColor: new THREE.Color(0xcccccc),
          floorColor: new THREE.Color(0xeeeeee),
          particleColor: new THREE.Color(0xffffff),
          skyboxColor: new THREE.Color(0x87ceeb),
          ambientLight: 0.5,
          objectsToGenerate: 10
        };
    }
  };

  const settings = getThemeSettings();
  
  // Generate theme-specific objects
  const generateObjects = () => {
    const objects = [];
    for (let i = 0; i < settings.objectsToGenerate; i++) {
      const position = [
        (Math.random() - 0.5) * 20,
        (Math.random() * 5) + 1,
        (Math.random() - 0.5) * 20
      ];
      
      // Different objects based on the theme
      if (theme === 'underwater') {
        // Bubbles or fish
        objects.push(
          <Sphere 
            key={`object-${i}`}
            position={position as [number, number, number]} 
            args={[Math.random() * 0.3 + 0.1, 16, 16]}
          >
            <meshStandardMaterial 
              color={new THREE.Color(0x80c9ff)} 
              transparent 
              opacity={0.7} 
            />
          </Sphere>
        );
      } else if (theme === 'space') {
        // Stars
        objects.push(
          <Sphere 
            key={`object-${i}`}
            position={position as [number, number, number]} 
            args={[Math.random() * 0.1 + 0.05, 8, 8]}
          >
            <meshStandardMaterial 
              color={new THREE.Color(0xffffff)} 
              emissive={new THREE.Color(0xffffcc)}
              emissiveIntensity={0.5} 
            />
          </Sphere>
        );
      } else if (theme === 'forest') {
        // Tree-like structures
        objects.push(
          <group key={`object-${i}`} position={position as [number, number, number]}>
            <Box args={[0.3, 2, 0.3]} position={[0, 0, 0]}>
              <meshStandardMaterial color={new THREE.Color(0x8B4513)} />
            </Box>
            <Sphere args={[1, 16, 16]} position={[0, 1.5, 0]}>
              <meshStandardMaterial color={new THREE.Color(0x228B22)} />
            </Sphere>
          </group>
        );
      } else if (theme === 'mountains') {
        // Mountain peaks
        objects.push(
          <Box 
            key={`object-${i}`}
            position={position as [number, number, number]} 
            args={[
              Math.random() * 2 + 1, 
              Math.random() * 4 + 2, 
              Math.random() * 2 + 1
            ]}
          >
            <meshStandardMaterial color={new THREE.Color(0x808080)} />
          </Box>
        );
      }
    }
    return objects;
  };

  // Animation for objects
  useFrame((state) => {
    if (roomRef.current) {
      // Slightly rotate the environment
      roomRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      
      // Make particles or objects "float" based on theme
      if (theme === 'underwater' || theme === 'space') {
        roomRef.current.children.forEach((child, index) => {
          if (child.type === 'Mesh') {
            // Make objects float upward
            child.position.y += Math.sin(state.clock.getElapsedTime() * 0.5 + index) * 0.005;
            
            // Reset if they go too high
            if (child.position.y > 10) {
              child.position.y = -2;
            }
          }
        });
      }
    }
  });

  return (
    <group ref={roomRef}>
      {/* Environment fog */}
      <fog attach="fog" args={[settings.fogColor, 5, 30]} />
      
      {/* Floor */}
      <Box position={[0, -0.1, 0]} args={[30, 0.2, 30]}>
        <meshStandardMaterial color={settings.floorColor} />
      </Box>
      
      {/* Skybox */}
      <Box position={[0, 0, 0]} args={[50, 50, 50]} scale={[-1, 1, 1]}>
        <meshBasicMaterial color={settings.skyboxColor} side={THREE.BackSide} />
      </Box>
      
      {/* Theme-specific objects */}
      {generateObjects()}
      
      {/* Instructional text */}
      <Text
        position={[0, 2, -3]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {theme === 'underwater' 
          ? 'Underwater Therapy Session' 
          : theme === 'space' 
          ? 'Space Rehabilitation Environment'
          : theme === 'forest'
          ? 'Forest Healing Zone'
          : 'Mountain Recovery Area'}
      </Text>
      
      {/* Exercise zone marker */}
      <Sphere 
        position={[0, 0.1, 0]} 
        args={[2, 32, 32]}
        scale={[1, 0.01, 1]}
      >
        <meshStandardMaterial 
          color={new THREE.Color(0xffffff)} 
          transparent 
          opacity={0.2} 
        />
      </Sphere>
      
      {/* Additional lighting based on the theme */}
      <ambientLight intensity={settings.ambientLight} />
      
      {theme === 'underwater' && (
        <pointLight position={[5, 8, 5]} intensity={1} color={new THREE.Color(0x80c9ff)} />
      )}
      
      {theme === 'space' && (
        <>
          <pointLight position={[10, 5, 0]} intensity={1} color={new THREE.Color(0x0000ff)} />
          <pointLight position={[-10, 5, 0]} intensity={1} color={new THREE.Color(0xff0000)} />
        </>
      )}
      
      {theme === 'forest' && (
        <directionalLight position={[5, 10, 5]} intensity={0.8} color={new THREE.Color(0xffff99)} />
      )}
      
      {theme === 'mountains' && (
        <directionalLight position={[5, 10, 5]} intensity={1} color={new THREE.Color(0xffffff)} />
      )}
    </group>
  );
};

export default TherapyRoom;