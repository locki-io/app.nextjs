'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GroupProps } from '@react-three/fiber';
import { Group, Box3 } from 'three';
import { RefObject } from 'react';
import TextMesh from './TextMesh';


interface ModelProps extends GroupProps {
  index: number;
  dataNftRef: string;
  glbFileLink: string;
  handleSelectionChange: () => void;   
}

export default function Model({ dataNftRef, glbFileLink, handleSelectionChange, ...props }: ModelProps) {
  const meshRef = useRef<THREE.Group>();
  const { scene } = useGLTF(glbFileLink);
  // const { bg_scene } = useLoader(GLTFLoader, '/assets/itheum_scene.glb')
  // const { actions, mixer } = useAnimations(animations, meshRef);
  const [objectHeight, setObjectHeight] = useState<number | null>(null);

  const handleClick = () => {
    // Call the handleSelectionChange function when the model is clicked
    handleSelectionChange();
  };

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.rotation.y += 0.01
  })


  useEffect(() => {
    if (meshRef.current) {
      const box = new Box3().setFromObject(meshRef.current);
      const height = box.max.y - box.min.y ;
      setObjectHeight(height);
    }
  }, [scene]);

  return (
    <group {...props} onClick={handleClick}>
      <primitive ref={meshRef as RefObject<Group>} object={scene} />
      {objectHeight !== null && <TextMesh text={dataNftRef} objectHeight={objectHeight}/>}
    </group>
  );
}

Model.preload = (glbFileLink: string) => {
  return useGLTF.preload(glbFileLink);
};
