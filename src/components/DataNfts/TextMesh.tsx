'use Client';
import React, { useRef, useEffect } from 'react';
import { extend, Object3DNode, MeshProps } from '@react-three/fiber';
import  Roboto from './Roboto.json';
import { MeshBasicMaterial, Group } from 'three';
import { RefObject } from 'react';
import { FontLoader, } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three-stdlib';


import { Mesh } from 'three';

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

const TextMesh: React.FC<{ text: string; index: number; objectHeight: number }> = ({ text, index, objectHeight }) => {
  const textRef = useRef<Mesh | Group>(); 
  const textGeometryRef = useRef<TextGeometry>(null);

  // parse JSON file with Three
  const font : any = new FontLoader().parse(Roboto);

  // configure font geometry
  const textOptions = {
    font: font,
    size: 0.5,
    height: 0.1
  };

  // Create a blue material
  const material = new MeshBasicMaterial({ color: 'blue' });

   // Calculate the text geometry width and adjust its position
  useEffect(() => {
    if (textGeometryRef.current && textRef.current) {
      textGeometryRef.current.computeBoundingBox();
      const boundingBox = textGeometryRef.current.boundingBox;
      if (boundingBox) {
        const width = boundingBox.max.x - boundingBox.min.x;
        const newXPosition = -width / 2; // Centering along the x-axis
        textRef.current.position.setX(newXPosition);
      }
    }
  }, [text]);
  return (
    <mesh ref={textRef as RefObject<Mesh>} position={[0, -2 - (objectHeight ?? 0) / 2 , 0]} material={material}>
      <textGeometry ref={textGeometryRef} attach='geometry' args={[text, textOptions]} />
    </mesh>
  )
}

export default TextMesh;