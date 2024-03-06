import { ExtendedDataNft } from '@/app/context/store';
import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';

interface ModelProps {
  index: number;
  dataNft: ExtendedDataNft;
}

const Model: React.FC<ModelProps> = ({ index, dataNft, ...props }) => {
  const { scene } = useGLTF(dataNft.dataPreview);
  const modelRef = useRef<THREE.Object3D | undefined>();

  return <primitive object={scene} ref={modelRef} id={index} {...props} />;
};

export default Model;
