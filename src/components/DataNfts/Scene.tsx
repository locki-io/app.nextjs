import React, { forwardRef, ReactNode } from 'react';
import { Center, useGLTF, View } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  background?: string;
  children?: ReactNode;
}

function Scene({ background = 'white', children, ...props }: SceneProps) {
  const { nodes, materials } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bricks/model.gltf'
  );
  return (
    <>
      <color attach='background' args={[background]} />
      <ambientLight />
      <directionalLight
        position={[10, 10, -15]}
        castShadow
        shadow-mapSize={1024}
      />

      <group
        matrixAutoUpdate={false}
        onUpdate={(self) => (self.matrix = new THREE.Matrix4())}
        {...props}
      >
        <Center>
          <mesh
            castShadow
            geometry={nodes.bricks.geometry}
            material={materials['Stone.014']}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color='goldenrod'
              roughness={0}
              metalness={1}
            />
          </mesh>
        </Center>
        {children}
      </group>
    </>
  );
}

export const MainPanel = forwardRef<HTMLDivElement, MainPanelProps>(
  ({ children, ...props }, fref) => {
    return (
      <div ref={fref} className='panel' style={{ gridArea: 'main' }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          track={undefined}
        >
          {children}
        </View>
      </div>
    );
  }
);

export default Scene;
