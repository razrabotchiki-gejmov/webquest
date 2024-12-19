import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Plane, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Inventory from './Inventory';
import CustomCursor from './CustomCursor';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';

const Room = () => {
  console.log('Room загружается');
  return (
    <mesh receiveShadow castShadow>
      <boxGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color="pink" side={THREE.DoubleSide} />
    </mesh>
  );
};

const Item = ({ position = [0, 0, 0], cameraRef, threshold = 2 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(true);
  let flag = true
  const [keys, setKeys] = useState({KeyE : false});
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  });
  useFrame(() => {
    if (cameraRef?.current && ref.current) {
      // Вычисляем расстояние между камерой и Item
      const cameraPos = new THREE.Vector3().setFromMatrixPosition(cameraRef.current.matrixWorld);
      const itemPos = new THREE.Vector3(...position);
      const distance = cameraPos.distanceTo(itemPos);

      // Меняем состояние видимости на основе расстояния
      if (flag && (distance < threshold) && keys['KeyE']) {
        flag = false
        setIsVisible(false) 
      }
    }
  });

  return (
    <mesh ref={ref} position={position} visible={isVisible} receiveShadow castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
};

const Pager = ({ position = [0, 0, 0], cameraRef, threshold = 2 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(true);
  let flag = true
  const [keys, setKeys] = useState({KeyE : false});
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  });
  useFrame(() => {
    if (cameraRef?.current && ref.current) {
      // Вычисляем расстояние между камерой и Item
      const cameraPos = new THREE.Vector3().setFromMatrixPosition(cameraRef.current.matrixWorld);
      const itemPos = new THREE.Vector3(...position);
      const distance = cameraPos.distanceTo(itemPos);

      // Меняем состояние видимости на основе расстояния
      if (flag && (distance < threshold) && keys['KeyE']) {
        flag = false
        setIsVisible(false) 
      }
    }
  });

  return (
    <mesh ref={ref} position={position} visible={isVisible} receiveShadow castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
};

const PlaneFloor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="#808080" />
  </mesh>
);

const MovableCube = ({ position, rotationSpeed, playerSpeed, camera, isInventoryLocked }) => {
  //console.log('Cube загружается');
  const ref = useRef();
  const [yaw, setYaw] = useState(0);
  const [keys, setKeys] = useState({ KeyW: false, KeyS: false, KeyA: false, KeyD: false });

  useEffect(() => {
    if (isInventoryLocked) {
      document.body.classList.remove('pointer-locked');
    } else {
      document.body.classList.add('pointer-locked');
    }
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };
    const handleMouseMove = (e) => {
      //console.log('isInventoryLocked blocks rotation on inventory lock:', isInventoryLocked);
      if (isInventoryLocked || !document.pointerLockElement) return; 
        const delta = THREE.MathUtils.clamp(e.movementX, -50, 50);
        setYaw((prevYaw) => {
          const newYaw = prevYaw - delta * rotationSpeed;
          return newYaw % (2 * Math.PI); 
        });
      }    
    
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
    // console.log('isInventoryLocked block movement:', isInventoryLocked);
    if (isInventoryLocked) return;
    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);
    ref.current.rotation.y = yaw;
    
    if (keys["KeyW"]) 
      ref.current.translateOnAxis(forward, playerSpeed);
    if (keys["KeyS"]) 
      ref.current.translateOnAxis(forward, -playerSpeed);
    if (keys["KeyA"]) 
      ref.current.translateOnAxis(right, -playerSpeed);
    if (keys["KeyD"]) 
      ref.current.translateOnAxis(right, playerSpeed);
    if (camera.current) {
      const distance = 1; // Фиксированное расстояние камеры от куба
      const height = 2; // Камера будет немного выше куба

        camera.current.position.set(
          Math.sin(yaw) * distance + ref.current.position.x,
          height,
          Math.cos(yaw) * distance + ref.current.position.z
        );

      // Камера всегда смотрит на куб
      camera.current.lookAt(ref.current.position.x, height, ref.current.position.z);
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

const Closet = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/wardrobe.glb');

  return (
    <primitive
      object={gltf.scene}
      position={position}
      rotation={[0,80,0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Chair = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/chair.glb');

  return (
    <primitive
      object={gltf.scene}
      position={position}
      rotation={[0,80,0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Desk = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/desk.glb');

  return (
    <primitive
      object={gltf.scene}
      position={position}
      rotation={[0,80,0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Nightstand = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/nightstand.glb');

  return (
    <primitive
      object={gltf.scene}
      position={position}
      rotation={[0,80,0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Table = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/table.glb');

  return (
    <primitive
      object={gltf.scene}
      position={position}
      rotation={[0,80,0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};


const Scene = () => {
  const camera = useRef();
  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  const lightRef = useRef();
  const targetRef = useRef();
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
    const handleClick = () => {
      if(isInventoryLocked) return;
      document.body.requestPointerLock();
    };
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);

  console.log(typeof setIsInventoryLocked);
  return (
    <>
    <Canvas shadows>
      <PerspectiveCamera ref={camera} makeDefault position={[0, 1, 10]} />

      <ambientLight intensity={0.5} />
      <spotLight 
        position={[0, 2, 0]} 
        intensity={5} 
        castShadow
      />
      <spotLight 
        ref={lightRef}
        position={[-10, 7, 10]} 
        intensity={80} 
        castShadow
        angle={Math.PI / 2.5}
        penumbra={0.5}
      />
      <object3D ref={targetRef} position={[10, 10, 10]} />
      <PlaneFloor />
      <Room />

      <Closet position={[10, 2.5, 8]} scale={2}/>
      <Chair position={[10, 1, 12]} scale={2}/>
      <Desk position={[10, 1.5, 15]} scale={2}/>
      <Nightstand position={[10, 1, 19]} scale={2}/>
      <Table position={[10, 1, 4]} scale={2}/>

      <Item position={[15, 1, 0]} cameraRef={camera} threshold={3} />
      <Pager position={[15, 1, -5]} cameraRef={camera} threshold={3} />

      <MovableCube 
        position={[0, 0.5, 0]} 
        rotationSpeed={0.005} 
        playerSpeed={0.1} 
        camera={camera}
        isInventoryLocked={isInventoryLocked} 
      />
    </Canvas>
    <Inventory setIsInventoryLocked={setIsInventoryLocked} />
    {isInventoryLocked && <CustomCursor />}
    </>
  );
};

export default Scene;
