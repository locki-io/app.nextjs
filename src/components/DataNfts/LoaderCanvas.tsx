'use client';

import React, { useRef, useEffect, useState, RefObject } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, GroupProps, useLoader } from '@react-three/fiber';
import { Group, Box3, AnimationMixer, AnimationClip, Vector3 } from 'three';
import TextMesh from './TextMesh';
import { GLTFLoader } from 'three-stdlib';

interface ModelProps extends GroupProps {
  index: number;
  dataNftRef: string;
  glbFileLink: string;
  maxBoundSize: number;
  updateDataNftSelected: (index: number, selected: boolean) => void;
}

export default function Model({
  index,
  dataNftRef,
  glbFileLink,
  maxBoundSize,
  updateDataNftSelected,
  ...props
}: ModelProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Group>(null);
  const { scene, materials, animations } = useLoader(GLTFLoader, glbFileLink);
  const mixer = useRef<AnimationMixer>();
  const [objectHeight, setObjectHeight] = useState<number | null>(null);

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

    if (maxBoundSize !== 0) {
      // in the preview we don't rescale
      const box = new Box3().setFromObject(meshRef.current);
      const size = box.getSize(new Vector3());
      const maxBound = Math.max(size.x, size.y, size.z);
      const scaleFactor = maxBoundSize / maxBound;
      // Set the scale of the group to fit the maximum boundary box
      meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

      const height = size.y * scaleFactor;
      setObjectHeight(height + 1);
    } else {
      // in the preview the maxBound is 0
      const box = new Box3().setFromObject(meshRef.current);
      const size = box.getSize(new Vector3());
      const height = size.y;
      setObjectHeight(height);
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

  // useLayoutEffect(() => {
  //   if (scene && meshRef.current) {
  //     scene.traverse((object) => {
  //       if (object.isMesh && object.userData.dataNftIndex === index) {
  //         object.castShadow = true;
  //         // Set receive shadow property if needed
  //         // object.receiveShadow = true;
  //         // Set material-envMapIntensity property if needed
  //         // object.material.envMapIntensity = 0.1;
  //       }
  //     });
  //   }
  // }, [scene, index]);

  return (
    <group {...props} ref={groupRef} onClick={handleClick}>
      <primitive
        ref={meshRef}
        dataNftIndex={index}
        object={scene}
        materials={materials}
      />
      {objectHeight !== null && (
        <TextMesh text={dataNftRef} objectHeight={objectHeight} />
      )}
    </group>
  );
}

Model.preload = (glbFileLink: string) => {
  return useGLTF.preload(glbFileLink);
};
