import React, { useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {  Group } from 'three';

interface GltfCanvasProps {
    glbFileLink: string;
  }
  
  const GltfCanvas: React.FC<GltfCanvasProps> = ({ glbFileLink }) => {
    const gltf = useLoader(GLTFLoader, glbFileLink)    
    const meshRef = useRef<Group | null>(null);

    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }) 

    return (
      <Canvas camera={{ position: [3, 2, 10] }}>
          <ambientLight intensity={0.3} />
          <directionalLight color="white" position={[0, 0, 5]} />
          <group>
            <mesh>
              <boxGeometry />
              <meshStandardMaterial />
            </mesh>
            <primitive object={gltf.scene} ref={meshRef} />
          </group>
      </Canvas>
    );
  };

  export default GltfCanvas;