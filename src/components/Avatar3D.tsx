'use client';
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  measurements: {
    height: number;
    weight: number;
    waist: number;
    chest: number;
    hips: number;
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    scarf: string;
    gender: string;
  };
  style: {
    style: string;
    color: string;
  };
}

function AvatarModel({ measurements, style }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/base-avatar.glb');

  // Ölçülere göre modeli ölçeklendir
  useEffect(() => {
    if (group.current) {
      const height = measurements.height / 170; // 170cm referans boy
      group.current.scale.set(height, height, height);
    }
  }, [measurements.height]);

  // Modeli döndür
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function Avatar3D({ measurements, style }: AvatarProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <AvatarModel measurements={measurements} style={style} />
        <OrbitControls enablePan={false} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
} 