'use client';
import React, { useContext, useEffect, useState } from 'react';
import { DataNftsContext } from '@/app/context/store';
import { Canvas } from '@react-three/fiber';

import { PerspectiveCamera, OrbitControls, Plane } from '@react-three/drei';
import Model from './LoaderCanvas';
import { Vector3, DoubleSide } from 'three';

const SelectedDataPreview = () => {
  const dataNfts = useContext(DataNftsContext);
  const [rerenderKey, setRerenderKey] = useState(0);

  // useEffect to trigger rerender whenever DataNftsContext changes
  useEffect(() => {
    setRerenderKey((prevKey) => prevKey + 1);
  }, [dataNfts]);

  const handleSelectionChange = (index: number, selected: boolean) => {
    const newDataNfts = [...dataNfts];
    newDataNfts[index].dataNftSelected = selected;
    // Update the context or any other state management approach here
  };

  // Filter the dataNfts array to include only selected dataNfts
  const selectedDataNfts = dataNfts.filter(
    (dataNft) => dataNft.dataNftSelected
  );

  // Calculate the positions of the models based on the number of selected models
  const positions = calculateModelPositions(selectedDataNfts.length, 12);

  return selectedDataNfts.length > 0 ? (
    <div style={{ width: '100%', height: '40vh' }}>
      <Canvas flat linear shadows>
        <PerspectiveCamera makeDefault fov={50} position={[10, 10, 16]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          intensity={8}
          position={[0, 100, 100]}
          shadow-mapSize-height={512}
          shadow-mapSize-width={512}
          castShadow
        />
        {/* <Box castShadow position={[0, 0.5, 0]}></Box> */}
        <Plane
          args={[1024, 1024]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -3, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            attach='material'
            color={0x0f0537}
            shadowSide={DoubleSide}
          />
        </Plane>

        {selectedDataNfts.map((dataNft, index) => (
          <Model
            key={`${rerenderKey}-${index}`}
            index={index}
            dataNftRef={dataNft.tokenIdentifier}
            glbFileLink={dataNft.dataPreview}
            position={positions[index]}
            maxBoundSize={0}
            updateDataNftSelected={handleSelectionChange}
            castShadow
            receiveShadow
          />
        ))}

        <OrbitControls />
      </Canvas>
    </div>
  ) : null;
};

const calculateModelPositions = (
  numSelectedModels: number,
  radius: number
): Vector3[] => {
  const center: Vector3 = new Vector3(0, 0, 0);
  const positions: Vector3[] = [];

  if (numSelectedModels === 1) {
    // If only one model selected, position it at the center
    positions.push(new Vector3(0, 5, 0));
  } else {
    // Calculate the angle between each model
    const angleStep = (2 * Math.PI) / numSelectedModels;

    // Generate positions in a circular pattern
    for (let i = 0; i < numSelectedModels; i++) {
      const angle = i * angleStep;
      const x = center.x + radius * Math.cos(angle);
      const z = center.z + radius * Math.sin(angle);
      const y = 5;
      positions.push(new Vector3(x, y, z));
    }
  }

  return positions;
};

export default SelectedDataPreview;
