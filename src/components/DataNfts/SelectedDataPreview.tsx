'use client';
import React, { Fragment, useContext } from "react";
import { DataNftsContext } from "@/app/context/store";
import {  Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Bounds, OrbitControls } from '@react-three/drei'
import Model from "./LoaderCanvas";
import {  Vector3 } from "three";

const SelectedDataPreview = () => {
  const dataNfts = useContext(DataNftsContext);

  const handleSelectionChange = (index: number, selected: boolean) => {
    const newDataNfts = [...dataNfts];
    newDataNfts[index].dataNftSelected = selected;
    // Update the context or any other state management approach here
  };

  // Filter the dataNfts array to include only selected dataNfts
  const selectedDataNfts = dataNfts.filter(dataNft => dataNft.dataNftSelected);

  // Calculate the positions of the models based on the number of selected models
  const positions = calculateModelPositions(selectedDataNfts.length, 8);

  return selectedDataNfts.length > 0 ? (    
    <div style={{ width: "100vw", height: "40vh" }}>
        <Canvas flat linear>
          <PerspectiveCamera
                  makeDefault
                  fov={50}
                  position={[5, 5, 8]}
                />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} />
          <Bounds clip fit observe margin={1.2}> 
          {
          selectedDataNfts.map((dataNft, index) => (
            <Fragment key={index}>                          
              <Model
                index={index}  
                dataNftRef={dataNft.tokenIdentifier}
                glbFileLink={dataNft.dataPreview}
                position={positions[index]}
                maxBoundSize={4}
                handleSelectionChange={handleSelectionChange} 
                  />

            </Fragment>
          ))
          }
          </Bounds>
          <OrbitControls />
        </Canvas>
      </div>
  ): null;
};

const calculateModelPositions = (numSelectedModels: number, radius: number): Vector3[] => {
  const center: Vector3 = new Vector3(0, 0, 0);
  const positions: Vector3[] = [];

  if (numSelectedModels === 1) {
    // If only one model selected, position it at the center
    positions.push(center);
  } else {
    // Calculate the angle between each model
    const angleStep = (2 * Math.PI) / numSelectedModels;

    // Generate positions in a circular pattern
    for (let i = 0; i < numSelectedModels; i++) {
      const angle = i * angleStep;
      const x = center.x + radius * Math.cos(angle);
      const z = center.z + radius * Math.sin(angle);
      positions.push(new Vector3(x, 0, z));
    }
  }

  return positions;
};

export default SelectedDataPreview;