'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GroupProps, MeshProps } from '@react-three/fiber';

interface ModelProps extends GroupProps {
  glbFileLink: string;
  onClick?: () => void;
}

export default function Model({ glbFileLink, ...props }: ModelProps) {
  const meshRef = useRef<THREE.Group>();
  const { scene , animations } = useGLTF(glbFileLink);
  const { actions, mixer } = useAnimations(animations, meshRef);
  useFrame(() => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.rotation.z += 0.01
  })
  // useEffect(() => {
  //   actions.actionName.play()
  // }, [])
  return (
    <>
      <primitive object={scene} ref={meshRef}/>
    </>
  );
}

Model.preload = (glbFileLink: string) => {
  return useGLTF.preload(glbFileLink);
};
