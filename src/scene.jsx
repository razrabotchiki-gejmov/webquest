import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Plane, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';

const Room = () => {
  //console.log('Room загружается');
  return (
    <mesh receiveShadow castShadow>
      <boxGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color="pink" side={THREE.DoubleSide} />
    </mesh>
  );
};

const Item = ({ position = [0, 0, 0], cameraRef, threshold = 2, image, addItemToInventory  }) => {
  const ref = useRef();
  const [isDeleted, setIsDeleted] = useState(false);
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
    if (isDeleted || !cameraRef?.current || !ref.current) return; 
      // Создаем луч из камеры в направлении ее взгляда
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: 0, y: 0 }, cameraRef.current); // Центр экрана (x=0, y=0)
      const intersects = raycaster.intersectObject(ref.current);

      // Меняем состояние видимости на основе расстояния
      if (!isDeleted && intersects.length > 0 &&
        intersects[0].distance < threshold && keys['KeyE'] && addItemToInventory) {  
        console.log('Предмет добавлен')      
        addItemToInventory({name : 'Пистолет', imageUrl : image})
        setIsDeleted(true) 
      }    
  });
  if (isDeleted) return null;
  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
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
  const [yaw, setYaw] = useState(0); // Угол наклона по горизонтали
  const [pitch, setPitch] = useState(0); // Угол наклона по вертикали
  const [keys, setKeys] = useState({ KeyW: false, KeyS: false, KeyA: false, KeyD: false });

  useEffect(() => {
    if (isInventoryLocked) return;
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
        const deltaPitch = THREE.MathUtils.clamp(e.movementY, -50, 50);
        setYaw((prevYaw) => {
          const newYaw = prevYaw - delta * rotationSpeed;
          return newYaw % (2 * Math.PI); 
        });
        setPitch((prevPitch) => {
          const newPitch = prevPitch - deltaPitch * rotationSpeed;
          return THREE.MathUtils.clamp(newPitch, -Math.PI / 6, Math.PI / 6); // Ограничение наклона (-30° до +30°)
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
    //console.log('isInventoryLocked block movement:', isInventoryLocked);
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
          Math.sin(pitch) * -distance + height,
          Math.cos(yaw) * distance + ref.current.position.z
        );

      // Камера всегда смотрит на куб
      camera.current.lookAt(ref.current.position.x, height, ref.current.position.z);
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" transparent={true} opacity={0} />
    </mesh>
  );
};

const Model = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
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

const Scene = ({addItemToInventory, isInventoryLocked }) => {
  const camera = useRef();

  const lightRef = useRef();
  const targetRef = useRef();
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
    const handleClick = () => {
      document.body.requestPointerLock();
    };
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [isInventoryLocked]);
  // console.log('Scene загружается');
  // console.log(typeof setIsInventoryLocked);
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

      <Model position={[10, 2.5, 8]} scale={2}/>

      <Item position={[15, 1, 0]} cameraRef={camera} threshold={3} image={`/images/пистолет.jpg`} addItemToInventory={addItemToInventory} />

      <MovableCube 
        position={[0, 0.5, 0]} 
        rotationSpeed={0.005} 
        playerSpeed={0.1} 
        camera={camera}
        isInventoryLocked={isInventoryLocked} 
      />
    </Canvas>
    </>
  );
};

export default Scene;
