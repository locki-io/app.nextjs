'use client';
import React, {
  Fragment,
  ReactNode,
  forwardRef,
  useEffect,
  useState
} from 'react';
import { ExtendedDataNft } from '@/app/context/store';
import { Canvas } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Bounds,
  OrbitControls,
  View
} from '@react-three/drei';
import Model from './LoaderCanvas';
import { Vector3 } from 'three';

interface GeneralCanvasProps {
  background?: string;
  dataNfts: ExtendedDataNft[];
  dataNftCount: number;
  children: ReactNode;
}

const GeneralCanvas: React.FC<GeneralCanvasProps> = ({
  dataNfts,
  dataNftCount,
  children
}) => {
  const [libraryElement, setLibraryElement] = useState<
    HTMLDivElement | undefined
  >(undefined);

  useEffect(() => {
    const libraryElement = document.getElementById('Library');
    setLibraryElement(libraryElement as HTMLDivElement);
  }, []);

  const handleSelectionChange = (index: number, selected: boolean) => {
    const newDataNfts = [...dataNfts];
    newDataNfts[index].dataNftSelected = selected;
  };

  // Calculate the positions of the models based on the number of selected models
  const positions = calculateModelPositions(dataNftCount, 16);

  return (
    <div style={{ width: '100vw', height: '40vh' }} className='container'>
      <Canvas
        shadows
        frameloop='always'
        eventSource={libraryElement}
        className='canvas'
      >
        <View.Port />
      </Canvas>
      {/* <MainScene ref={viewAll}>
        <PerspectiveCamera makeDefault fov={50} position={[10, 10, 16]} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />
        <Bounds clip fit observe margin={1.2}>
          {dataNfts.map((dataNft, index) => (
            <Fragment key={index}>
              <Model
                index={index}
                dataNftRef={dataNft.tokenIdentifier}
                glbFileLink={dataNft.dataPreview}
                position={positions[index]}
                maxBoundSize={2}
                updateDataNftSelected={handleSelectionChange}
              />
            </Fragment>
          ))}
          {children}
        </Bounds>
        <OrbitControls />
      </MainScene> */}
    </div>
  );
};

const calculateModelPositions = (
  numSelectedModels: number,
  radius: number
): Vector3[] => {
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

export default GeneralCanvas;
