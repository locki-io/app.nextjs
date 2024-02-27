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
  updateDataNftSelected: (index: number, selected: boolean) => void;   
}

export default function Model({index, dataNftRef, glbFileLink, maxBoundSize, updateDataNftSelected, ...props }: ModelProps) {
  const meshRef = useRef<THREE.Group>();
  const { scene, animations } = useGLTF(glbFileLink);
  const mixer = useRef<AnimationMixer>();
  const [objectHeight, setObjectHeight] = useState<number | null>(null);

  // State to store size for each DataNft object
  const [objectSizes, setObjectSizes] = useState<Vector3[]>([]);

  const handleClick = () => {
    // Call the handleSelectionChange function when the model is clicked
    updateDataNftSelected(index, true);
  };

  useFrame((_, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });



  useEffect(() => {
    if (!scene || !meshRef.current) return;

        // Store the size for all DataNft object
    setObjectSizes(prevSizes => {
      const defaultsize = new Vector3(1, 1, 1);
      if (!meshRef.current) return [defaultsize];
      const box = new Box3().setFromObject(meshRef.current);
      const size = box.getSize(new Vector3())
      const newSizes = [...prevSizes];
      const index = meshRef.current.userData.dataNftIndex;
      newSizes[index] = size;
      console.log(newSizes);
      return newSizes;
    });

    if (maxBoundSize !== 0) { // in the preview we don't rescale
      const box = new Box3().setFromObject(meshRef.current);
      const size = box.getSize(new Vector3())
      const maxBound = Math.max(size.x, size.y, size.z)
      const scaleFactor = maxBoundSize / maxBound
      // Set the scale of the group to fit the maximum boundary box
      meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

      const height = size.y * scaleFactor;
      setObjectHeight(height);
    } else {
      const box = new Box3().setFromObject(meshRef.current);
      const size = box.getSize(new Vector3())
      const height = size.y;
      setObjectHeight(height);
      // const box = new Box3().setFromObject(meshRef.current);
      // const size = box.getSize(new Vector3())
      // const maxBound = Math.max(size.x, size.y, size.z)
      // const scaleFactor = getMinValues(objectSizes) / maxBound
      // meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
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
      <primitive ref={meshRef as RefObject<Group>} dataNftIndex={index} object={scene} />
      {objectHeight !== null && <TextMesh text={dataNftRef} objectHeight={objectHeight}/>}
    </group>
  );
}

Model.preload = (glbFileLink: string) => {
  return useGLTF.preload(glbFileLink);
};

const getMinValues = (vectors: Vector3[]): number => {
  // Initialize min values with positive infinity
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;

  // Iterate over each vector
  vectors.forEach(vector => {
    // Update min values if current vector's components are smaller
    minX = Math.min(minX, vector.x);
    minY = Math.min(minY, vector.y);
    minZ = Math.min(minZ, vector.z);
  });

  // Return a new Vector3 instance with the min values
  return Math.max(minX, minY);
};