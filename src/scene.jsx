import React, { useRef, useState, useEffect } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Box, Plane, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';
import './scene.css'
import AddableItem from './AddableItem.jsx'
import IteractableItem from './IteractableItem.jsx';
import HoverableObject from './HoverableObject';

const size = 35;
const color = 'pink'; // Цвет стен
const floorColor = 'gray'; // Цвет пола
const doorSize = 5;
const smallRoomSize = 17.5;

const Room = () => {
  //console.log('Room загружается');
  return (
    <>
      {/* Пол */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[size*2, size*2]} />
        <meshStandardMaterial color={floorColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Потолок */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, size / 4, 0]}>
        <planeGeometry args={[size*2, size*2]} />
        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
      </mesh>

      {/* Задняя стена */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -size / 2]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Передняя стена (с отверстием для двери) */}
      {/* Левая часть передней стены */}
      <mesh rotation={[0, -Math.PI, 0]} position={[-size / 6, 0, size / 2]}>
        <planeGeometry args={[5 * size / 6, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Правая часть передней стены */}
      <mesh rotation={[0, -Math.PI, 0]} position={[size / 2, 0, size / 2]}>
        <planeGeometry args={[size /  2.5, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Верхняя часть передней стены */}
      <mesh rotation={[0, -Math.PI, 0]} position={[0, 15, size / 2]}>
        <planeGeometry args={[size, size/1.6]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Левая стена */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-size / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Правая стена */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[size / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>


      {/*Побочная комната*/}

      {/* Правая стена */}
      //8.75 1/4 стены
      <mesh rotation={[0, Math.PI/2, 0]} position={[5.5, 0, 5*smallRoomSize/4]}>
        <planeGeometry args={[smallRoomSize/2, smallRoomSize]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Левая стена */}
      <mesh rotation={[0, Math.PI/2, 0]} position={[11.5, 0, 5*smallRoomSize/4]}>
        <planeGeometry args={[smallRoomSize/2, smallRoomSize]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Задняя стена */}
      <mesh rotation={[0, 0, 0]} position={[8, 0, 3*smallRoomSize/2]}>
        <planeGeometry args={[smallRoomSize/2, smallRoomSize]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

const Modal = ({ onClose }) => {
  useEffect(() => {
    // Добавляем обработчик клика на документ
    const handleOutsideClick = (event) => {
      onClose(); // Закрыть модальное окно
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      // Удаляем обработчик при размонтировании компонента
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.25)",
        zIndex: 1000,
      }}
    >
      <p>1 + 1 = ?</p>
      <p>Закрыть</p>
    </div>
  );
};

const Pager = ({ position = [0, 0, 0], cameraRef, threshold = 2, onActivate }) => {
  const handleHoverChange = (isHovered) => {
    console.log(isHovered ? "Hovered" : "Not Hovered");
  };
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const [keys, setKeys] = useState({ KeyE: false });

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (cameraRef?.current && ref.current) {
      const cameraPos = new THREE.Vector3().setFromMatrixPosition(cameraRef.current.matrixWorld);
      const itemPos = new THREE.Vector3(...position);
      const distance = cameraPos.distanceTo(itemPos);

      if (isVisible && distance < threshold && keys["KeyE"]) {
        setIsVisible(false);
        onActivate(); // Вызов callback для открытия окна
      }
    }
  });

  return (
    <HoverableObject
      cameraRef={cameraRef}
      onHoverChange={handleHoverChange}
      scaleOnHover={1}
      colorOnHover="yellow"
      baseColor="red"
    >
    <mesh ref={ref} position={position} visible={isVisible} receiveShadow castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
    </HoverableObject>
  );
};

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
          return THREE.MathUtils.clamp(newPitch, -Math.PI / 3, Math.PI / 3); // Ограничение наклона (-30° до +30°)
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
    const halfSize = size / 2 - 0.6;
    ref.current.position.x = Math.max(-halfSize, Math.min(halfSize, ref.current.position.x));
    //ref.current.position.z = Math.max(-halfSize, Math.min(halfSize, ref.current.position.z));
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

// const Pager = ({ position = [0, 0, 0], cameraRef, threshold = 2 }) => {
//   const ref = useRef();
//   const [isVisible, setIsVisible] = useState(true);
//     let flag = true
//     const [keys, setKeys] = useState({KeyE : false});
//     useEffect(() => {
//       const handleKeyDown = (event) => {
//         setKeys((prev) => ({ ...prev, [event.code]: true }));
//       };
//       const handleKeyUp = (event) => {
//         setKeys((prev) => ({ ...prev, [event.code]: false }));
//       };
//       document.addEventListener('keydown', handleKeyDown);
//       document.addEventListener('keyup', handleKeyUp);
//     });
//     useFrame(() => {
//       if (cameraRef?.current && ref.current) {
//         // Вычисляем расстояние между камерой и Item
//         const cameraPos = new THREE.Vector3().setFromMatrixPosition(cameraRef.current.matrixWorld);
//         const itemPos = new THREE.Vector3(...position);
//         const distance = cameraPos.distanceTo(itemPos);
  
//         // Меняем состояние видимости на основе расстояния
//         if (flag && (distance < threshold) && keys['KeyE']) {
//           flag = false
//           setIsVisible(false) 
//         }
//       }
//     });
  
//     return (
//       <mesh ref={ref} position={position} visible={isVisible} receiveShadow castShadow>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshStandardMaterial color="red" side={THREE.DoubleSide} />
//       </mesh>
//     );
// };
  
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
  
const Scene = ({addItemToInventory, isInventoryLocked, itemInHand, removeItemFromInventory}) => {
  const camera = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wardrobeActive, setWardrobeActive] = useState(false);
  const [changedWardrobePosition, setChangeWardrobePosition] = useState([10,2.5,0])
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const lightRef = useRef();
  const targetRef = useRef();
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
    if(isInventoryLocked) return;
    const handleClick = () => {
      document.body.requestPointerLock();
    };
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [isInventoryLocked]);

    const handleWardrobeActivate = () =>
    {
      setWardrobeActive(true);
      setTimeout(()=> {console.log('wardrobeActive: ' + wardrobeActive)},2000);
    }
    
    const handleChangeWardrobePosition = () =>
    {
      setChangeWardrobePosition(prev => {const newPosition = [...prev];
        newPosition[2] -= 3;
        return newPosition;})
      setTimeout(()=> {console.log('changedPosition: ' + changedWardrobePosition)},2000);
    }
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
      <Room />

      <Chair position={[10, 1, 12]} scale={2}/>
      <Desk position={[10, 1.5, 15]} scale={2}/>
      <Nightstand position={[10, 1, 19]} scale={2}/>
      //Стол с лампой
      <Table position={[10, 1, 4]} scale={2}/>
      //Подбираемая УФ лампа
      <AddableItem position={[15, 1, 0]} cameraRef={camera} threshold={3} image={'/images/уф лампа.jpg'} addItemToInventory={addItemToInventory} name={'уф лампа'} />
      //Подсказка для УФ лампы
      <AddableItem position={[10,2,4]} cameraRef={camera} threshold={3} image={'/images/Листок до подсказки.jpg'} addItemToInventory={addItemToInventory} name={'Листок с подсказкой'} />
      //Интерактивная лампа в которую вставляется УФ лампа
      <IteractableItem position={[11,2.5,4]} cameraRef={camera} threshold={3} name={'Лампа'} itemInHand={itemInHand} description={'Лампа, проявляет скрытое'} removeItemFromInventory={removeItemFromInventory} addItemToInventory={addItemToInventory} activateItem={handleWardrobeActivate}/>
      //Шкаф который можно сдвинуть после активции подсказки
      <IteractableItem position={changedWardrobePosition} size={2} cameraRef={camera} threshold={3} name={'Шкаф'} description='Выглядит так что можно сдвинуть' isActive={wardrobeActive} meshBeforeIteract='/src/models/wardrobe.glb' meshAfterIteract='/src/models/wardrobe.glb' activateItem={handleChangeWardrobePosition}/>
      <Pager 
        position={[15, 1, -10]} 
        cameraRef={camera} 
        threshold={3} 
        onActivate={() => setIsModalOpen(true)}
      />
      <MovableCube 
        position={[0, 0.5, 0]} 
        rotationSpeed={0.005} 
        playerSpeed={0.1} 
        camera={camera}
        isInventoryLocked={isInventoryLocked} 
      />
    </Canvas>
    {isModalOpen && <Modal onClose={handleModalClose} />}
    </>
  );
};

export default Scene;
