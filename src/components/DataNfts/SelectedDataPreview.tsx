'use client';
import React, { useContext, useState } from "react";
import { DataNftsContext } from "@/app/context/store";
import {  Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import Model from "./LoaderCanvas";
import { Vector3 } from "three";

import tunnel from 'tunnel-rat';

const SelectedDataPreview = () => {
  const [selectionKey, setSelectionKey] = useState(0); 
  const dataNfts = useContext(DataNftsContext);

  // Filter the dataNfts array to include only selected dataNfts
  const selectedDataNfts = dataNfts.filter(
    dataNft => dataNft.dataNftSelected
    );
  
  const ui = tunnel();

  const handleSelectionChange = () => {
    // Update the selection key to trigger remount
    setSelectionKey(prevKey => prevKey + 1);
    console.log(selectionKey);
  };

  // Calculate the positions of the models based on the number of selected models
  const positions = calculateModelPositions(selectedDataNfts.length);

  return selectedDataNfts.length > 0 ? (    
    <div style={{ width: "100vw", height: "40vh" }}>
        <Canvas flat linear camera={{ position: [1, 1, 20] }}>
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} />
          {
          selectedDataNfts.map((dataNft, index) => (
            <>              
              <Model
                index={index}  
                key={`${selectionKey}-${index}`}
                dataNftRef={dataNft.tokenIdentifier}
                glbFileLink={dataNft.dataPreview}
                position={positions[index]}
                handleSelectionChange={handleSelectionChange} 
                />
            </>
          ))
          }
          <OrbitControls />
        </Canvas>
      </div>
  ): null;
};

// Function to calculate model positions based on the number of selected models
const calculateModelPositions = (numSelectedModels: number): Vector3[] => {
  const center: Vector3 = new Vector3(0, 0, 0);
  const spacing: Vector3 = new Vector3(10, 0, 0); // Adjust as needed
  const positions: Vector3[] = [];

  if (numSelectedModels === 1) {
    // If only one model selected, position it at the center
    positions.push(center);
  } else if (numSelectedModels === 2) {
    // If two models selected, position them on the left and right sides
    positions.push(spacing.clone().negate());
    positions.push(spacing.clone());
  } else {
    // Handle other cases as needed
    // For example, distribute models evenly in a circular pattern
    // Or position them along a line, etc.
  }

  return positions;
};

export default SelectedDataPreview;