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
import { ShootingMechanic } from './ShootingMechanic';
import HoverableObject from './HoverableObject';
import InteractiveCube from './InteractiveCube';
import { threshold } from 'three/webgpu';

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
  const color='grey'
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
      <meshStandardMaterial attach="material-1" color={color} side={THREE.DoubleSide}/> {/* Задняя сторона */}
      <meshStandardMaterial attach="material-2" color={color} side={THREE.DoubleSide}/> {/* Верхняя сторона */}
      <meshStandardMaterial attach="material-3" color={color} side={THREE.DoubleSide}/> {/* Нижняя сторона */}
      <meshStandardMaterial attach="material-4" color={color} side={THREE.DoubleSide}/> {/* Левая сторона */}
      <meshStandardMaterial attach="material-5" color={color} side={THREE.DoubleSide}/> {/* Правая сторона */}
    </mesh>
  );
};

const MovableCube = ({ position, rotationSpeed, playerSpeed, camera, isInventoryLocked, keys }) => {
  const ref = useRef();
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  useEffect(() => {
    if (isInventoryLocked) return;
    const pressedKeys = new Set();
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
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
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

const Couch = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/couch.glb');
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.add(gltf.scene.clone());
    }
  }, [gltf]);
  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Cup = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/cup.glb');
  const ref = useRef();
  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Pillow = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/pillow.glb');
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.add(gltf.scene.clone());
    }
  }, [gltf]);
  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Scene = ({addItemToInventory, isInventoryLocked, itemInHand, removeItemFromInventory}) => {
  const camera = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wardrobeActive, setWardrobeActive] = useState(false);
  const [changedWardrobePosition, setChangeWardrobePosition] = useState([11.3,0,0])
  const [keys, setKeys] = useState({ KeyW: false, KeyS: false, KeyA: false, KeyD: false, KeyE: false });
  const [minuteArrowSpawn, setMinuteArrowSpawn] = useState(false);
  const [clockModel, setClockModel] = useState('src/models/clock_closed.glb')
  const [gunInHand,setGunInHand] = useState(false);
  const [haveBullets,setHaveBullets] = useState(false);
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
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };
    document.body.addEventListener("click", handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.body.removeEventListener("click", handleClick);
    };
  }, [isInventoryLocked]);

    const handleWardrobeActivate = () =>
    {
      setWardrobeActive(true);
    }
    
    const handleChangeWardrobePosition = () =>
    {
      setChangeWardrobePosition(prev => {const newPosition = [...prev];
        newPosition[2] -= 3;
        return newPosition;})
      setTimeout(()=> {console.log('changedPosition: ' + changedWardrobePosition)},2000);
    }
    const handleMinuteArrowSpawn = () =>
    {
      setMinuteArrowSpawn((prev) => !prev);
    }
    const handleClockModelChange = () =>
    {
      setClockModel('src/models/clock_closed_witharrows.glb');
    }
    if(itemInHand){ 
      if(itemInHand.name=='Пистолет')
      {
        if(!gunInHand)
          setGunInHand(true);
      }
      else if (gunInHand) setGunInHand(false);
      if(itemInHand.name=='Патроны для пистолета')
        if(!haveBullets)
          setHaveBullets(true);
    }
    else if (gunInHand) setGunInHand(false);

  return (
    <>
    <Canvas shadows>
      <PerspectiveCamera ref={camera} makeDefault position={[0, 1, 10]} />
      {gunInHand && haveBullets && <ShootingMechanic camera={camera} />}
      <ambientLight intensity={0.6} />
      <spotLight 
        position={[0, 2, 0]} 
        intensity={5} 
        castShadow
      />
      <spotLight 
        ref={lightRef}
        position={[-10, 7, 10]} 
        intensity={100} 
        castShadow
        angle={Math.PI}
        penumbra={0.5}
      />
      <object3D ref={targetRef} position={[10, 10, 10]} />
      <Room />

      Шкаф в маленькой комнате пустой
      <IteractableItem 
      position={[8, 0, 13]} 
      size={1.5} 
      rotation={[0,-Math.PI/2,0]}
      threshold={3}
      cameraRef={camera}
      name='Ящик'
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'
      meshBeforeIteract='src/models/locker.glb'
      meshAfterIteract='src/models/locker_opened.glb'
      keyEPressed={keys['KeyE']}/>

      Шкаф в маленькой комнате c патронами
      <IteractableItem 
      position={[8, 0, 14]} 
      size={1.5} 
      rotation={[0,-Math.PI/2,0]}
      threshold={3}
      cameraRef={camera}
      name='Ящик'
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'
      meshBeforeIteract='src/models/locker.glb'
      meshAfterIteract='src/models/locker_opened.glb'
      keyEPressed={keys['KeyE']}/>

      <AddableItem 
      position={[8, 1.97, 14]} 
      size={1}
      rotation={[0,0,0]}
      name='Патроны для пистолета'
      description='Мягкие и безопасные для человека. Можно зарядить в игрушечный пистолет.'
      mesh='src/models/toygun_bulletbox.glb'
      image=''
      keyEPressed={keys['KeyE']}
      threshold={3}
      cameraRef={camera}
      addItemToInventory={addItemToInventory}/>

      Ящик за плакатом
      <BoxForItems position={[6,2,18.5]} scale={1} rotation={[0,Math.PI/2,0]}/>

      Стеллаж в маленькой комнате
      <Shlef position={[3.5,0,15]} scale={1.8} rotation={[0,Math.PI/2,0]}/>

      Подбираемая УФ лампочка
      <AddableItem 
      position={[3.5, 1.9, 15]} 
      cameraRef={camera} 
      rotation={[Math.PI/2,0,0]} 
      threshold={3} 
      image={'/images/уф лампа.jpg'} 
      mesh={'src/models/bulb.glb'} 
      description='Лампочка, способная излучать ультрафиолетовое свечение.' 
      addItemToInventory={addItemToInventory} 
      name={'уф лампа'} 
      keyEPressed={keys['KeyE']}/>

      Стол c лампой
      <Table position={[10, 0, 4]} scale={1.8} rotation={[0, -Math.PI/2,0]}/>

      Интерактивная лампа в которую вставляется УФ лампа
      <IteractableItem 
      position={[10,1.6,5]} 
      cameraRef={camera} 
      threshold={3} 
      name='Лампа'
      itemInHand={itemInHand} 
      descriptionBefore='Лампа обладает уникальным свечением, способным проявлять скрытые послания. Отсутствует лампочка, чтобы прибор работал нужна полная комплектация.'
      descriptionAfter='Ультрафиолетовая лампа обладает уникальным свечением, способным проявлять скрытые послания.' 
      removeItemFromInventory={removeItemFromInventory} 
      addItemToInventory={addItemToInventory} 
      activateItem={handleWardrobeActivate} 
      meshBeforeIteract='src/models/lamp_empty.glb' 
      meshAfterIteract='src/models/lamp_wbulb.glb'
      keyEPressed={keys['KeyE']}/>

      Шкаф который можно сдвинуть после активции подсказки
      <IteractableItem 
      position={changedWardrobePosition} 
      size={2} 
      cameraRef={camera} 
      threshold={3} 
      name='Шкаф' 
      descriptionBefore ='Место для хранения различных вещей. Почти всегда стоит на одном месте, хорошая причина спрятать за шкафом что-нибудь.'
      descriptionAfter='Больше нет смысла его пытаться двигать' 
      isActive={wardrobeActive} 
      meshBeforeIteract='src/models/wardrobe.glb' 
      meshAfterIteract='src/models/wardrobe.glb' 
      activateItem={handleChangeWardrobePosition}
      keyEPressed={keys['KeyE']}/>

      Ящик за шкафом
      <BoxForItems position={[12.5,2,0.5]} scale={1} rotation={[0,-Math.PI,0]}/>

      Стол c микроволновкой
      <Table position={[-7, 0, 10]} scale={1.6} rotation={[0,0,0]}/>
      Микроволоновка
      <IteractableItem 
      position={[-6.5,1.4,10]}
      size={1.5}
      rotation={[0,Math.PI,0]}
      cameraRef={camera}
      threshold={3}
      name='Микроволновка'
      descriptionBefore='Поможет быстро разогреть любой продукт. Не стоит пробовать разогревать несъедобные предметы.'
      descriptionAfter='Поможет быстро разогреть любой продукт. Не стоит пробовать разогревать несъедобные предметы.'
      meshBeforeIteract='src/models/microwave.glb'
      meshAfterIteract='src/models/microwave_enabled.glb'
      keyEPressed={keys['KeyE']}/>

      Холодильник
      <IteractableItem 
      position={[-11,0,11.5]} 
      size={1.5} 
      rotation={[0,Math.PI,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Холодильник'
      descriptionBefore='Хранилище для продуктов питания. Некоторую еду можно заморозить, тогда она будет оставаться свежей долгое время.' 
      descriptionAfter='Хранилище для продуктов питания. Некоторую еду можно заморозить, тогда она будет оставаться свежей долгое время.'
      meshBeforeIteract='src/models/fridge.glb' 
      meshAfterIteract='src/models/fridge_opened.glb'
      keyEPressed={keys['KeyE']}/>
      
      Стол c ящиком с подсказой для УФ лампы и кружкой внутри которой стрелка
      <IteractableItem 
      position={[-11.2, 0, 0]} 
      size={1.5} 
      rotation={[0,Math.PI/2,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Стол с замком'
      descriptionBefore='Для чего понадобилось запирать ящик на замок?' 
      descriptionAfter='Для чего понадобилось запирать ящик на замок?'
      meshBeforeIteract='src/models/desk_withlock.glb' 
      meshAfterIteract='src/models/desk_opened.glb'
      keyEPressed={keys['KeyE']}/>

      <InteractiveCube position={[10, 0.5, -5]} />

      Подсказка для УФ лампы
      <AddableItem 
      position={[-11.2, 1.43,-0.7]} 
      cameraRef={camera} 
      threshold={3} 
      image='/images/Листок до подсказки.jpg'
      mesh='src/models/paper1_notext.glb'
      description='Листок с изображением лампочки, возможно это намек чтобы воспользоваться чем то в комнате.' 
      addItemToInventory={addItemToInventory} 
      name='Листок с изображением лампочки' 
      keyEPressed={keys['KeyE']}/>
      
      Кружка
      <Cup position={[-11.2,1.4,1]} scale={1} rotation={[0,Math.PI/2,0]}/>
      
      Стрелка часовая
      <AddableItem 
      position={[-11.2,1.4,1]} 
      cameraRef={camera} 
      threshold={3} 
      image={''}
      mesh='src/models/arrow_hour.glb' 
      description='Одна из двух потерянных стрелок. Определяет какой сейчас час.' 
      addItemToInventory={addItemToInventory} 
      name='Часовая стрелка'
      keyEPressed={keys['KeyE']}/>
      
      Стол для аквариума
      <Table position={[-10.5, 0, -5]} scale={1.5} rotation={[0,Math.PI/2,0]}/>

      Аквариум
      <IteractableItem 
      position={[-10.5, 1.3, -5]} 
      cameraRef={camera} 
      threshold={3}
      size={2} 
      meshBeforeIteract='src/models/aquarium.glb'
      meshAfterIteract='src/models/aquarium.glb'
      descriptionBefore='Тут могут жить различные морские обитатели. Прямо сейчас аквариум занят опасной пираньей. Руки здесь лучше не мыть.'
      descriptionAfter='Тут могут жить различные морские обитатели. Прямо сейчас аквариум занят опасной пираньей. Руки здесь лучше не мыть.'
      name='Аквариум' 
      keyEPressed={keys['KeyE']}/>

      Стеллаж в рядом с часами
      <Shlef position={[-9,0,-11.5]} scale={1.8} rotation={[0,0,0]}/>
      
      Подсказка для часов
      <AddableItem 
      position={[-9,1.8,-11.5]} 
      rotation={[0,0,0]} 
      cameraRef={camera} 
      threshold={3} 
      image='/images/Листок для часов.jpg'
      mesh='src/models/paper2.glb'
      description='Листок с запиской. Содержание: Если кто найдет стрелки, установите время в часах на полдевятого – начало моего рабочего дня. Заведующий кабинетом' 
      addItemToInventory={addItemToInventory}
      name='Листок с неким текстом'
      keyEPressed={keys['KeyE']}/>
      
      Часы
      <IteractableItem 
      position={[-6,3,-11.8]} 
      size={2} 
      rotation={[0,0,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Часы' 
      descriptionBefore='В современное время не часто можно увидеть такие громоздкие приспособления. Может они не только время показывать умеют. Прямо сейчас в часах нет стрелок, без них от устройства нет смысла.'
      descriptionAfter='В современное время не часто можно увидеть такие громоздкие приспособления. Может они не только время показывать умеют.'
      meshBeforeIteract={clockModel} 
      meshAfterIteract='src/models/clock_opened_solved.glb'
      keyEPressed={keys['KeyE']}
      removeItemFromInventory={removeItemFromInventory}
      itemInHand={itemInHand}
      activateItem={handleClockModelChange}/>
      
      Диван
      <Couch position={[-2,0,-11]} scale={1.3} rotation={[0,0,0]} />
      Подушка
      <Pillow position={[-3.2,1,-10.8]} scale={1.2} rotation={[0,0,0]} />

      Пистолет
      <AddableItem 
      position={[-2.7,0.9,-10.6]}
      size={1}
      rotation={[Math.PI/2,0,0]}
      cameraRef={camera}
      threshold={3}
      name='Пистолет'
      image='images/пистолет.jpg'
      description='С этой игрушкой можно чувствовать себе увереннее. Отлично подходит для сбивания пустых банок или бутылок. Не работает без патронов.'
      mesh='src/models/toygun.glb'
      addItemToInventory={addItemToInventory}
      keyEPressed={keys['KeyE']}/>

      Колонна
      <mesh position={[-1,0,-1]} rotation={[0,0,0]}>
        <boxGeometry args={[1,20,1]}/>
        <meshStandardMaterial color="grey" transparent={true} />
      </mesh>
      
      Ящик со стрелкой
      <IteractableItem 
      position={[-1,0,-2.1]} 
      size={2} rotation={[0,Math.PI,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Ящик' 
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'  
      meshBeforeIteract='src/models/nightstand.glb' 
      meshAfterIteract='src/models/nightstand_opened.glb'
      keyEPressed={keys['KeyE']}
      activateItem={handleMinuteArrowSpawn}/>

      {minuteArrowSpawn && <AddableItem 
      position={[-1,1.4,-3]}
      size={2}
      rotation={[Math.PI/2,0,Math.PI/2]}
      cameraRef={camera}
      threshold={3}
      name='Минутная стрелка'
      image=''
      addItemToInventory={addItemToInventory}
      mesh={'src/models/arrow_minute.glb'}
      description='Одна из двух потерянных стрелок. Определяет какая сейчас минута.'
      keyEPressed={keys['KeyE']}/>}
      
      Шкаф у колонны с телефоном
      <IteractableItem 
      position={[-1,0,0]} 
      size={1.5} 
      rotation={[0,0,0]}
      threshold={3}
      cameraRef={camera}
      name='Ящик'
      isActive={false}
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'
      meshBeforeIteract='src/models/locker.glb'
      meshAfterIteract='src/models/locker_opened.glb'
      keyEPressed={keys['KeyE']}/>
      
      <MovableCube 
        position={[0, 0.5, 0]} 
        rotationSpeed={0.005} 
        playerSpeed={0.1} 
        camera={camera}
        isInventoryLocked={isInventoryLocked} 
        keys={keys}
      />
      
    </Canvas>
    </>
  );
};
export default Scene;