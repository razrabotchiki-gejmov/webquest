import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Plane, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three'
import Inventory from './Inventory';

const Room = () => {
  console.log('Room загружается');
  return (
    <mesh>
      <boxGeometry args={[10, 10, 10]} />
      <meshBasicMaterial color="pink" side={THREE.DoubleSide} />
    </mesh>
  );
};

const PlaneFloor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[50, 50]} />
    <meshBasicMaterial color="#808080" />
  </mesh>
);

const MovableCube = ({ position, rotationSpeed, playerSpeed, camera, isInventoryLocked }) => {
  console.log('Cube загружается');
  const ref = useRef();
  const [yaw, setYaw] = useState(0);
  const [keys, setKeys] = useState({ KeyW: false, KeyS: false, KeyA: false, KeyD: false });
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };
    const handleMouseMove = (e) => {
      if (document.pointerLockElement) {
        setYaw((prevYaw) => prevYaw - e.movementX * rotationSpeed);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [rotationSpeed, isInventoryLocked]);

  useFrame(() => {
    if (!ref.current) return;

    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);
    ref.current.rotation.y = yaw;
    if (!isInventoryLocked) {
    if (keys["KeyW"]) 
      ref.current.translateOnAxis(forward, playerSpeed);
    if (keys["KeyS"]) 
      ref.current.translateOnAxis(forward, -playerSpeed);
    if (keys["KeyA"]) 
      ref.current.translateOnAxis(right, -playerSpeed);
    if (keys["KeyD"]) 
      ref.current.translateOnAxis(right, playerSpeed);
    if (camera.current) {
      const distance = 5; // Фиксированное расстояние камеры от куба
      const height = 2; // Камера будет немного выше куба

      // Камера должна следовать за кубом, но вращаться относительно его позиции
      camera.current.position.set(
        Math.sin(yaw) * distance + ref.current.position.x, // Камера позади куба, по оси X
        height,                        // Камера чуть выше куба
        Math.cos(yaw) * distance + ref.current.position.z   // Камера позади куба, по оси Z
      );

      // Камера всегда смотрит на куб
      camera.current.lookAt(ref.current.position.x, height, ref.current.position.z);
    }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="green" />
    </mesh>
  );
};

const Scene = () => {
  const camera = useRef();
  useEffect(() => {
    const handleClick = () => {
      document.body.requestPointerLock();
    };

    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);
  console.log('Scene загружается');
  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  return (
    <Canvas>
      {/* Камера */}
      <PerspectiveCamera ref={camera} makeDefault position={[0, 1, 10]} />
      
      {/* Освещение */}
      <ambientLight intensity={0.5} />
      
      {/* Плоскость */}
      <PlaneFloor />
      
      {/* Комната */}
      <Room />
      
      {/* Движущийся куб */}
      <MovableCube position={[0, 0.5, 0]} rotationSpeed={0.005} playerSpeed={0.1} camera={camera} isInventoryLocked={isInventoryLocked}/>
    </Canvas>
  );
};

export default Scene;
