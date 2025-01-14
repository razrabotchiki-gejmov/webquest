import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const HoverableObject = ({ position, geometry, material, hoverMaterial }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.material = hovered ? hoverMaterial : material;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      geometry={geometry}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
};

export default HoverableObject;