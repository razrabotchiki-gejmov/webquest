import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useLoader } from '@react-three/fiber';
import './scene.css'
import AddableItem from './AddableItem.jsx'
import IteractableItem from './IteractableItem.jsx';
import HoverableObject from './HoverableObject';

const size = 24;
const color = 'pink'; // Цвет стен
const floorColor = 'gray'; // Цвет пола
const smallRoomSize = size / 2;

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
      {/* Передняя стена */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -size / 2]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Правая стена (с отверстием для двери) */}
      {/* Левая часть */}
      <mesh rotation={[0, -Math.PI, 0]} position={[-size / 6, 0, size / 2]}>
        <planeGeometry args={[4.5 * size / 6, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Правая часть*/}
      <mesh rotation={[0, -Math.PI, 0]} position={[size / 2, 0, size / 2]}>
        <planeGeometry args={[size /  2.5, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Верхняя часть*/}
      <mesh rotation={[0, -Math.PI, 0]} position={[0, 11, size / 2]}>
        <planeGeometry args={[size, size/1.6]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Задняя стена */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-size / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Правая стена с потайным отверстием */}
      {/* Левая часть*/}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[size / 2, 0, -size/4]}>
        <planeGeometry args={[size/2, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Правая часть*/}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[size / 2, 0, size/4+1]}>
        <planeGeometry args={[size/2, size]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Нижняя часть*/}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[size / 2, 0, 0]}>
        <planeGeometry args={[size, size/8]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Верхняя часть*/}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[size / 2, 5, 0]}>
        <planeGeometry args={[size, 1.05*size/5]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/*Побочная комната*/}
      {/* Правая стена */}
      <mesh rotation={[0, Math.PI/2, 0]} position={[3, 0, 5*smallRoomSize/4]}>
        <planeGeometry args={[smallRoomSize/2, smallRoomSize]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Левая стена */}
      <mesh rotation={[0, Math.PI/2, 0]} position={[9, 0, 5*smallRoomSize/4]}>
        <planeGeometry args={[smallRoomSize/2, smallRoomSize]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Задняя стена */}
      {/* Левая часть */}
      <mesh rotation={[0, 0, 0]} position={[8, 0, 3*smallRoomSize/2]}>
        <planeGeometry args={[smallRoomSize/4, smallRoomSize]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Правая часть */}
      <mesh rotation={[0, 0, 0]} position={[4, 0, 3*smallRoomSize/2]}>
        <planeGeometry args={[smallRoomSize/4, smallRoomSize]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Нижняя часть */}
      <mesh rotation={[0, 0, 0]} position={[6, 0, 3*smallRoomSize/2]}>
        <planeGeometry args={[smallRoomSize, smallRoomSize/4]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Верхняя часть */}
      <mesh rotation={[0, 0, 0]} position={[6, 5.5, 3*smallRoomSize/2]}>
        <planeGeometry args={[smallRoomSize, smallRoomSize/2]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
const BoxForItems = ({position=[0,0,0], scale = 1, rotation =[0,0,0]}) => {
  const ref=useRef();
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      {/* Геометрия коробки */}
      <boxGeometry args={[scale,scale,scale]}/>
      {/* Материалы для каждой стороны */}
      <meshStandardMaterial
        attach="material-0" // Передняя сторона (индекс 0)
        color="red"
        transparent={true}
        opacity={0} // Прозрачность
        depthWrite={false}
      />
      <meshStandardMaterial attach="material-1" color="blue" side={THREE.DoubleSide}/> {/* Задняя сторона */}
      <meshStandardMaterial attach="material-2" color="green" side={THREE.DoubleSide}/> {/* Верхняя сторона */}
      <meshStandardMaterial attach="material-3" color="yellow" side={THREE.DoubleSide}/> {/* Нижняя сторона */}
      <meshStandardMaterial attach="material-4" color="orange" side={THREE.DoubleSide}/> {/* Левая сторона */}
      <meshStandardMaterial attach="material-5" color="purple" side={THREE.DoubleSide}/> {/* Правая сторона */}
    </mesh>
  );
};


const MovableCube = ({ position, rotationSpeed, playerSpeed, camera, isInventoryLocked }) => {
  const ref = useRef();
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [keys, setKeys] = useState({ KeyW: false, KeyS: false, KeyA: false, KeyD: false });
  useEffect(() => {
    if (isInventoryLocked) return;
    const pressedKeys = new Set();
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };
    const handleMouseMove = (e) => {
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
    if (camera.current) {
      const distance = 1; 
      const height = 2; 
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
  
const Desk = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
    const gltf = useLoader(GLTFLoader, 'src/models/desk.glb');
    const ref = useRef();
    useEffect(() => {
      if (ref.current) {
        ref.current.add(gltf.scene.clone());
      }
    }, [gltf]);
    return (
      <group
        ref={ref}
        object={gltf.scene}
        position={position}
        rotation={rotation}
        scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      />
    );
};
  
const Table = ({ position = [0, 0, 0], scale = 1, rotation = 0}) => {
    const gltf = useLoader(GLTFLoader, 'src/models/table.glb');
    const ref = useRef();
    useEffect(() => {
      if (ref.current) {
        ref.current.add(gltf.scene.clone());
      }
    }, [gltf]);
    return (
      <group
        ref={ref}
        object={gltf.scene}
        position={position}
        rotation={rotation}
        scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      />
    );
};

const Shlef = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/shelf.glb');
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.add(gltf.scene.clone());
    }
  }, [gltf]);
  return (
    <group
      ref={ref}
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Locker = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/locker.glb');
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.add(gltf.scene.clone());
    }
  }, [gltf]);
  return (
    <group
      ref={ref}
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Projectile = ({ position, direction }) => {
  const ref = useRef();
  const [hit, setHit] = useState(false);
  const { scene } = useThree(); // Получаем доступ к сцене через useThree

  useFrame(() => {
    if (hit || !ref.current) return;
    
    ref.current.position.x += direction.x * 0.5;
    ref.current.position.y += direction.y * 0.5;
    ref.current.position.z += direction.z * 0.5;
    
    const raycaster = new THREE.Raycaster();
    raycaster.set(ref.current.position, direction);
    
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0 && intersects[0].distance < 1) {
      const hitObject = intersects[0].object;
      if (hitObject !== ref.current) {
        console.log("Попадание в:", hitObject.name || "неизвестный объект");
        setHit(true);
      }
    }
  });

  return hit ? null : (
    <mesh ref={ref} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
};

const ShootingMechanic = ({ camera }) => {
  const [projectiles, setProjectiles] = useState([]);
  const handleShoot = (event) => {
    if (!camera.current) return;
    const direction = new THREE.Vector3();
    camera.current.getWorldDirection(direction);
    setProjectiles(prev => [...prev, {
      id: Math.random(),
      position: camera.current.position.clone(),
      direction: direction.normalize()
    }]);
  };

  useEffect(() => {
    window.addEventListener('click', handleShoot);
    return () => window.removeEventListener('click', handleShoot);
  }, [camera]);
  return projectiles.map(proj => (
    <Projectile
      key={proj.id}
      position={proj.position}
      direction={proj.direction}
    />
  ));
};

const Scene = ({addItemToInventory, isInventoryLocked, itemInHand, removeItemFromInventory}) => {
  const camera = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wardrobeActive, setWardrobeActive] = useState(false);
  const [changedWardrobePosition, setChangeWardrobePosition] = useState([11.3,0,0])
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
      Шкаф в маленькой комнате пустой
      <Locker position={[8, 0, 13]} scale={1.5} rotation={[0,-Math.PI/2,0]}/>
      Шкаф в маленькой комнате c патронами
      <Locker position={[8, 0, 14]} scale={1.5} rotation={[0,-Math.PI/2,0]}/>
      Ящик за плакатом
      <BoxForItems position={[6,2,18.5]} scale={1} rotation={[0,Math.PI/2,0]}/>
      Стеллаж в маленькой комнате
      <Shlef position={[3.5,0,15]} scale={1.8} rotation={[0,Math.PI/2,0]}/>
      Подбираемая УФ лампочка
      <AddableItem position={[3.5, 1.9, 15]} cameraRef={camera} rotation={[Math.PI/2,0,0]} threshold={3} image={'/images/уф лампа.jpg'} mesh={'src/models/bulb.glb'} description='ДОПОЛНИТЬ' addItemToInventory={addItemToInventory} name={'уф лампа'} />

      Стол c лампой
      <Table position={[10, 0, 4]} scale={1.8} rotation={[0, -Math.PI/2,0]}/>
      Интерактивная лампа в которую вставляется УФ лампа
      <IteractableItem position={[10,1.6,5]} cameraRef={camera} threshold={3} name={'Лампа'} itemInHand={itemInHand} description={'Лампа, проявляет скрытое'} removeItemFromInventory={removeItemFromInventory} addItemToInventory={addItemToInventory} activateItem={handleWardrobeActivate} meshBeforeIteract='src/models/lamp_empty.glb' meshAfterIteract='src/models/lamp_wbulb.glb'/>
      Шкаф который можно сдвинуть после активции подсказки
      <IteractableItem position={changedWardrobePosition} size={2} cameraRef={camera} threshold={3} name={'Шкаф'} description='Выглядит так что можно сдвинуть' isActive={wardrobeActive} meshBeforeIteract='src/models/wardrobe.glb' meshAfterIteract='src/models/wardrobe.glb' activateItem={handleChangeWardrobePosition}/>
      Ящик за шкафом
      <BoxForItems position={[12.5,2,0.5]} scale={1} rotation={[0,-Math.PI,0]}/>

      Стол c микроволновкой
      <Table position={[-7, 0, 10]} scale={1.8} rotation={[0,0,0]}/>
      Микроволоновка
      positiion=-6,1,9
      Холодильник
      <IteractableItem position={[-11,0,11.5]} size={2} rotation={[0,Math.PI,0]} cameraRef={camera} threshold={3} name={'Холодильник'} description='Внутри лежат колбаса, сыр и мясо' meshBeforeIteract='src/models/fridge.glb' meshAfterIteract='src/models/fridge.glb'/>
      
      Стол c ящиком с подсказой для УФ лампы и кружкой внутри которой стрелка
      <Desk position={[-11.2, 0, 0]} scale={1.5} rotation={[0,Math.PI/2,0]}/>
      Подсказка для УФ лампы
      <AddableItem position={[-11.2, 1.43,-0.7]} cameraRef={camera} threshold={3} image={'/images/Листок до подсказки.jpg'} mesh={'src/models/paper1_notext.glb'} description='ДОПОЛНИТЬ' addItemToInventory={addItemToInventory} name={'Листок с изображением лампочки'} />
      Стрелка часовая
      <AddableItem position={[-11.2,1.4,1]} cameraRef={camera} threshold={3} image={''} mesh={'src/models/arrow_hour.glb'} description='ДОПОЛНИТЬ' addItemToInventory={addItemToInventory} name={'Часовая стрелка'}/>
      Стол для аквариума
      <Table position={[-10.5, 0, -5]} scale={1.5} rotation={[0,Math.PI/2,0]}/>
      Стеллаж в рядом с часами
      <Shlef position={[-9,0,-11.5]} scale={1.8} rotation={[0,0,0]}/>
      Подсказка для часов
      <AddableItem position={[-9,1.8,-11.5]} rotation={[0,0,0]} cameraRef={camera} threshold={3} image={'/images/Листок для часов.jpg'} mesh={'src/models/paper2.glb'} description='ДОПОЛНИТЬ' addItemToInventory={addItemToInventory} name={'Листок с неким текстом'}/>
      Часы
      <IteractableItem position={[-6,3,-11.5]} size={2} rotation={[0,0,0]} cameraRef={camera} threshold={3} name={'Часы'} description='Не хватает стрелок' meshBeforeIteract='src/models/clock_closed.glb' meshAfterIteract='src/models/clock_opened.glb'/>
      Диван
      Колонна
      <mesh position={[-1,0,-1]} rotation={[0,0,0]}>
        <boxGeometry args={[1,20,1]}/>
        <meshStandardMaterial color="grey" transparent={true} />
      </mesh>
      Ящик со стрелкой
      <IteractableItem position={[-1,0,-2.1]} size={2} rotation={[0,Math.PI,0]} cameraRef={camera} threshold={3} name='Ящик со стрелкой' description='ДОПОЛНИТЬ' meshBeforeIteract='src/models/nightstand.glb' meshAfterIteract='src/models/nightstand.glb'/>
      Шкаф у колонны с телефоном
      <Locker position={[-1,0,0]} scale={1.5} rotation={[0,0,0]}/>
      
      <MovableCube 
        position={[0, 0.5, 0]} 
        rotationSpeed={0.005} 
        playerSpeed={0.1} 
        camera={camera}
        isInventoryLocked={isInventoryLocked} 
      />
      <ShootingMechanic camera={camera} />
    </Canvas>
    </>
  );
};
export default Scene;