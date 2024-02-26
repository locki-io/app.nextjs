'use client';

import React, { useRef, useEffect, useState, RefObject } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, GroupProps } from '@react-three/fiber';
import { Group, Box3, AnimationMixer, AnimationClip, Vector3 } from 'three';
import TextMesh from './TextMesh';


interface ModelProps extends GroupProps {
  index: number;
  dataNftRef: string;
  glbFileLink: string;
  maxBoundSize: number;
  handleSelectionChange: (index: number, selected: boolean) => void;   
}

export default function Model({index, dataNftRef, glbFileLink, maxBoundSize, handleSelectionChange, ...props }: ModelProps) {
  const meshRef = useRef<THREE.Group>();
  const { scene, animations } = useGLTF(glbFileLink);
  const mixer = useRef<AnimationMixer>();
  const [objectHeight, setObjectHeight] = useState<number | null>(null);

  const handleClick = () => {
    // Call the handleSelectionChange function when the model is clicked
    handleSelectionChange(index, true);
  };

  useFrame((_, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  useEffect(() => {
    if (!scene || !meshRef.current) return;

    const box = new Box3().setFromObject(meshRef.current);
    const size = box.getSize(new Vector3())
    const maxBound = Math.max(size.x, size.y, size.z)
    const scaleFactor = maxBoundSize / maxBound
    //const height = box.max.y - box.min.y ;

    // Set the scale of the group to fit the maximum boundary box
    meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const height = size.y * scaleFactor;
    setObjectHeight(height);

    // Create a mixer and add the animation clips to it
    if (animations && animations.length) {
      mixer.current = new AnimationMixer(meshRef.current);
      animations.forEach((clip: AnimationClip) => {
        const action = mixer.current?.clipAction(clip);
        if (action) {
          action.play();
        }
      });
    }
  }, [scene, animations, maxBoundSize]);

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
