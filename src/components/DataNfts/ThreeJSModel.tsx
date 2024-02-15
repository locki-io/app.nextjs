// components/ThreeJSModel.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ThreeJSModelProps {
  glbFileLink: string;
}

const ThreeJSModel: React.FC<ThreeJSModelProps> = ({ glbFileLink }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 0.5, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(100, 100);

    const loader = new GLTFLoader();
    loader.load(
      glbFileLink,
      (gltf) => {
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading GLB file:', error);
      }
    );

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();


    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up Three.js scene when component unmounts
      renderer.dispose();
    };
  }, [glbFileLink]);

  return <canvas ref={canvasRef} />;
};

export default ThreeJSModel;
