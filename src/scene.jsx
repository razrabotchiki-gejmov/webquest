import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';
import './scene.css'
import AddableItem from './AddableItem.jsx'
import IteractableItem from './IteractableItem.jsx';
import { ShootingMechanic } from './ShootingMechanic';

const size = 24;
const color = 'pink'; // Цвет стен
const floorColor = 'gray'; // Цвет пола
const smallRoomSize = size / 2;

const Room = ({scale = 1}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/room.glb');
  return (
    <primitive
      object={gltf.scene}
      position={[-5,0,0]}
      rotation={[0,Math.PI/2,0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};


const MovableCube = ({ position, rotationSpeed, playerSpeed, camera, isInventoryLocked, keys }) => {
  const ref = useRef();
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  useEffect(() => {
    if (isInventoryLocked) return;
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
    //console.log(ref.current.position);
    if (camera.current) {
      const distance = 1; 
      const height = 1.5; 
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
  
const Phone = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
    const gltf = useLoader(GLTFLoader, 'src/models/phone_3_empty.glb');
    return (
      <primitive
        object={gltf.scene}
        position={position}
        rotation={rotation}
        scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      />
    );
};

const Books = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/books_ondesk.glb');
  return (
    <primitive
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const BoxUndertable = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/box_undertable.glb');
  return (
    <primitive
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
};

const Cup2 = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/cup2.glb');
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
    const gltf = useLoader(GLTFLoader, 'src/models/table_thin.glb');
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

const Shlef = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0], type = 1}) => {
  let gltf
  if(type == 1)
  {
    gltf = useLoader(GLTFLoader, 'src/models/shelf_wbox.glb');
  }
  else
  {
    gltf = useLoader(GLTFLoader, 'src/models/shelf_wbooks.glb');
  }
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

const ShlefCorner = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/shelf_corner.glb');
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

const Piranha = ({startPosition = [0, 0, 0], movementSpeed = 0.005, goDown}) => {
  const ref = useRef();
  const [direction, setDirection] = useState(1); // 1 - вправо, -1 - влево
  const [stopMove, setStopMove] = useState(false);
  const model = useLoader(GLTFLoader, 'src/models/piranha.glb');
  let rotation = [0,direction*Math.PI/2,stopMove*Math.PI/2]
  useFrame(() => {
    if (!ref.current) return;
      const position = ref.current.position;

      if (!goDown) {
        position.z += direction * movementSpeed;
        if (position.z > startPosition[2] + 0.3 || position.z < startPosition[2]-0.3) {
          setDirection((prev) => -prev);
        }
    } else {
      position.y -= movementSpeed/5;
      if (position.y <= 1.22) {
        ref.current.position.y = 1.22;
      }
      if(!stopMove)
      {
        if (position.z > -2 || position.z < -2)
          setDirection((prev) => -prev)
        position.z += direction * movementSpeed
        if (position.z >= 2- 1e03 || position.z <= 2 + 1e03) {
          setStopMove(true)
        }
      }
    }
  });

  return <primitive ref={ref} object={model.scene} position={startPosition} rotation={rotation}/>;
};

const Meat = ({startPosition = [0, 0, 0], movementSpeed = 0.005, isActive}) => {
  const ref = useRef();
  const [direction, setDirection] = useState(1); // 1 - вправо, -1 - влево

  const model = useLoader(GLTFLoader, 'src/models/meat.glb');
  const rotation = [0,Math.PI/2,0]
  useFrame(() => {
    if (!ref.current) return;
      const position = ref.current.position;
    if (isActive) {
      position.y -= movementSpeed;
      if (position.y <= 1.1) {
        ref.current.position.y = 1.1;
      }
    }
  });
  return <primitive ref={ref} object={model.scene} position={startPosition} rotation={rotation}/>;
};

const HintBlue = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/s_blue_book.glb');
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

const HintRed = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/s_red_bell.glb');
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

const HintYellow = ({ position = [0, 0, 0], scale = 1, rotation = [0,0,0]}) => {
  const gltf = useLoader(GLTFLoader, 'src/models/s_yellow_diplom.glb');
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

const Scene = ({addItemToInventory,
  isInventoryLocked,
  itemInHand,
  removeItemFromInventory,
  setQuestionType,
  setActiveQuestion,
  activeQuestion,
  setInteractionMessage,
  setInteractionItemName,
  setInteractionItemDescription,
}) => {
  const camera = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lampModel, setLampModel] = useState('src/models/lamp_empty.glb')
  const [wardrobeActive, setWardrobeActive] = useState(false);
  const [changedWardrobePosition, setChangeWardrobePosition] = useState([4.27,0,-3.5])
  const [keys, setKeys] = useState({ KeyW: false, KeyS: false, KeyA: false, KeyD: false, KeyE: false, Escape: false });
  const [minuteArrowSpawn, setMinuteArrowSpawn] = useState(false);
  const [clockModel, setClockModel] = useState('src/models/clock_closed.glb')
  const [gunInHand,setGunInHand] = useState(false);
  const [haveBullets,setHaveBullets] = useState(false);
  const [aquariumActive,setAquariumActive] = useState(false);
  const [piranhaFollowMeat, setPiranhaFollowMeat] = useState(false);
  const [spawn2Telephone, setSpawn2Telephone] = useState(false);
  const [spawn3Telephone, setSpawn3Telephone] = useState(true);
  const [spawn4Telephone, setSpawn4Telephone] = useState(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const lightRef = useRef();
  const targetRef = useRef();
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
    if(isInventoryLocked || activeQuestion) return;
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
  }, [isInventoryLocked, activeQuestion]);

    const handleLampAction = () =>
    {
      if(lampModel=='src/models/lamp_empty.glb')
        setLampModel('src/models/lamp_wbulb_off.glb')
      else
        setWardrobeActive(true);
    }
    
    const handleChangeWardrobePosition = () =>
    {
      setChangeWardrobePosition(prev => {const newPosition = [...prev];
        newPosition[2] -= 1.1;
        return newPosition;})
      setTimeout(()=> {console.log('changedPosition: ' + changedWardrobePosition)},2000);
    }
    const handleMinuteArrowSpawn = () =>
    {
      setMinuteArrowSpawn((prev) => !prev);
    }
    const handleClockAction = () =>
    {
      if(clockModel!='src/models/clock_closed_witharrows.glb')
        setClockModel('src/models/clock_closed_witharrows.glb');
      else
        handle4TelephoneSpawn();
    }
    const handleAquariumActive = () =>
    {
      setAquariumActive(true);
    }
    const handleAquariumAction = () =>
    {
      if(!piranhaFollowMeat)
        setPiranhaFollowMeat(true);
      else
      {
        if (addItemToInventory) {
          setSpawn3Telephone(false);
          addItemToInventory({ name: 'Телефон', imageUrl: 'images/Телефон 3.png', description: 'Специальное устройство, на которое записан учебный вопрос. На задней стороне есть номер – 3. На экране выводится значение – 2.'});
          console.log('Ответ появляется')
          setActiveQuestion(true);
          setQuestionType('checkbox')
        }
      }
    }
    const handle2TelephoneSpawn = () =>
    {
      setSpawn2Telephone(true);
    }
    const handle4TelephoneSpawn = () =>
    {
      setSpawn4Telephone(true);
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
      position={[3.5, 0, 7]} 
      size={1} 
      rotation={[0,-Math.PI/2,0]}
      threshold={3}
      cameraRef={camera}
      name='Ящик'
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'
      meshBeforeIteract='src/models/locker.glb'
      meshAfterIteract='src/models/locker_opened.glb'
      keys={keys}/>

      Шкаф в маленькой комнате c патронами
      <IteractableItem 
      position={[3.5, 0, 8]} 
      size={1} 
      rotation={[0,-Math.PI/2,0]}
      threshold={3}
      cameraRef={camera}
      name='Ящик'
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'
      meshBeforeIteract='src/models/locker.glb'
      meshAfterIteract='src/models/locker_opened.glb'
      keys={keys}/>

      Подсказка для УФ лампы
      <AddableItem
      position={[-4.75, 1, 1.2]}
      size={1.3}
      cameraRef={camera}
      threshold={3}
      image='images/Подсказка.png'
      mesh='src/models/paper1_notext.glb'
      description='Листок с изображением лампочки, возможно это намек чтобы воспользоваться чем то в комнате.'
      addItemToInventory={addItemToInventory}
      name='Листок с изображением лампочки'
      keys={keys}
      setInteractionTextVisible={setInteractionMessage} // Передано в AddableItem
      setInteractionMessage={setInteractionMessage} // Передача функции
      setInteractionItemName={setInteractionItemName}
      setInteractionItemDescription={setInteractionItemDescription} // Passed function for item description
      />

      Карта
      <IteractableItem 
      position={[2, 1.6, 10.33]}
      size={1.1}
      rotation={[0,Math.PI/2,0]}
      cameraRef={camera}
      threshold={2}
      name='Карта'
      descriptionBefore='Обычная карта мира, но зачем ее вешать в подсобке?'
      meshBeforeIteract='src/models/map.glb'
      meshAfterIteract='src/models/dot.glb'
      keys={keys}/>

      Пирамида в потайном ящике
      <IteractableItem 
      position={[2, 1.2, 11]} 
      size={1.1} 
      rotation={[0,0,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Пирамида'
      meshBeforeIteract='src/models/can_pyramid.glb' 
      meshAfterIteract='src/models/can_pyramid_fallen.glb'/>

      Подсказка
      <HintBlue position={[2, 1.5, 11.2]}
      scale={0.6}
      rotation={[0,0,0]}/>

      Стеллаж в маленькой комнате
      <Shlef position={[0.4, 0, 8]} scale={1} rotation={[0,Math.PI/2,0]}/>

      Подбираемая УФ лампочка
      <AddableItem 
      position={[0.4, 1.48, 8.1]} 
      size={1}
      cameraRef={camera} 
      rotation={[Math.PI/2,0,0]} 
      threshold={3} 
      image={'images/Лампочка.png'} 
      mesh={'src/models/bulb.glb'} 
      description='Лампочка, способная излучать ультрафиолетовое свечение.' 
      addItemToInventory={addItemToInventory} 
      name={'уф лампа'} 
      keys={keys}/>

      Стол c лампой
      <Table position={[3.9, 0, 0.4]} scale={1} rotation={[0, Math.PI/2,0]}/>

      Ящики под столом
      <BoxUndertable position={[3.9, 0.1, 0.2]} scale={1} rotation={[0, Math.PI/2,0]}/>

      Интерактивная лампа в которую вставляется УФ лампа
      <IteractableItem 
      position={[3.7, 0.9, 1]} 
      size={1}
      cameraRef={camera} 
      threshold={3} 
      name='Лампа'
      itemInHand={itemInHand} 
      descriptionBefore='Лампа обладает уникальным свечением, способным проявлять скрытые послания. Отсутствует лампочка, чтобы прибор работал нужна полная комплектация.'
      descriptionAfter='Ультрафиолетовая лампа обладает уникальным свечением, способным проявлять скрытые послания.' 
      removeItemFromInventory={removeItemFromInventory} 
      addItemToInventory={addItemToInventory} 
      activateItem={handleLampAction} 
      meshBeforeIteract={lampModel} 
      meshAfterIteract='src/models/lamp_wbulb_on.glb'
      keys={keys}/>

      Шкаф который можно сдвинуть после активции подсказки
      <IteractableItem 
      position={changedWardrobePosition} 
      size={1} 
      cameraRef={camera} 
      threshold={3} 
      name='Шкаф' 
      descriptionBefore ='Место для хранения различных вещей. Почти всегда стоит на одном месте, хорошая причина спрятать за шкафом что-нибудь.'
      descriptionAfter='Больше нет смысла его пытаться двигать' 
      isActive={wardrobeActive} 
      meshBeforeIteract='src/models/wardrobe.glb' 
      meshAfterIteract='src/models/wardrobe.glb' 
      activateItem={handleChangeWardrobePosition}
      keys={keys}/>

      Телефон 1
      <AddableItem 
      position={[4.7,1.4,-3.5]}
      rotation={[0,Math.PI/2,0]} 
      size={1}
      cameraRef={camera} 
      threshold={3} 
      image='images/Телефон 1.png'
      mesh='src/models/phone_1_empty.glb'
      description='Специальное устройство, на которое записан учебный вопрос. На задней стороне есть номер – 1.'
      descriptionAddedPhone='Специальное устройство, на которое записан учебный вопрос. 
      На задней стороне есть номер – 1.
      На экране выводится значение – 3.' 
      addItemToInventory={addItemToInventory} 
      name='Телефон' 
      keys={keys}
      questionType={'text'}
      setActiveQuestion={setActiveQuestion}
      setQuestionType={setQuestionType}/>

      Полка для пирамидки
      <ShlefCorner 
      position={[-5.04, -0.2, -0.04]}
      rotation={[0,Math.PI/2,0]}/>

      Пирамида на полке
      <IteractableItem 
      position={[4.2, 2.4, 5.6]} 
      size={1} 
      rotation={[0,Math.PI/4,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Пирамида'
      meshBeforeIteract='src/models/can_pyramid.glb' 
      meshAfterIteract='src/models/can_pyramid_fallen.glb'/>

      Подсказка желтая
      <HintYellow position={[4.3, 2.8, 5.7]}
      scale={0.6}
      rotation={[0,Math.PI/4,0]}/>

      Стол c микроволновкой
      <Table position={[-3, 0, 5.4]} scale={1} rotation={[0,0,0]}/>

      Микроволоновка
      <IteractableItem 
      position={[-2.6, 0.9, 5.6]}
      size={1}
      rotation={[0,Math.PI,0]}
      cameraRef={camera}
      threshold={3}
      name='Микроволновка'
      descriptionBefore='Поможет быстро разогреть любой продукт. Не стоит пробовать разогревать несъедобные предметы.'
      descriptionAfter='Поможет быстро разогреть любой продукт. Не стоит пробовать разогревать несъедобные предметы.'
      meshBeforeIteract='src/models/microwave.glb'
      meshAfterIteract='src/models/microwave_enabled.glb'
      removeItemFromInventory={removeItemFromInventory}
      addItemToInventory={addItemToInventory}
      keys={keys}
      activateItem={handleAquariumActive}
      itemInHand={itemInHand}/>

      Кружки рядом с микроволновкой
      <Cup2 position={[-3.3, 0.9, 5.6]} scale={1} rotation={[0,Math.PI/3,0]}/>
      <Cup2 position={[-3.6, 0.9, 5.6]} scale={1} rotation={[0,-Math.PI/1.3,0]}/>

      Холодильник
      <IteractableItem 
      position={[-5, 0, 5.55]} 
      size={1} 
      rotation={[0,Math.PI,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Холодильник'
      descriptionBefore='Хранилище для продуктов питания. Некоторую еду можно заморозить, тогда она будет оставаться свежей долгое время.' 
      descriptionAfter='Хранилище для продуктов питания. Некоторую еду можно заморозить, тогда она будет оставаться свежей долгое время.'
      meshBeforeIteract='src/models/fridge.glb' 
      meshAfterIteract='src/models/fridge_opened.glb'
      keys={keys}/>

      Мясо
      <AddableItem 
      position={[-5, 1.6, 5.6]}
      size={0.8}
      rotation={[0,Math.PI/2,Math.PI/2]}
      cameraRef={camera}
      threshold={1.5}
      image='images/Кусок мяса замороженный.png'
      addItemToInventory={addItemToInventory}
      name='Мясо замороженное'
      description='Промерз основательно. Чтобы сделать его пригодным в пищу  сначала необходимо разогреть.'
      mesh={'src/models/meat_frozen.glb'}
      keys={keys}
      />

      Стол c ящиком с подсказой для УФ лампы и кружкой внутри которой стрелка
      <IteractableItem 
      position={[-4.9, 0, 1.7]} 
      size={1} 
      rotation={[0,Math.PI/2,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Стол с замком'
      descriptionBefore='Для чего понадобилось запирать ящик на замок?' 
      descriptionAfter='Для чего понадобилось запирать ящик на замок?'
      meshBeforeIteract='src/models/desk_withlock.glb' 
      meshAfterIteract='src/models/desk_opened.glb'
      keys={keys}
      activateItem={handle2TelephoneSpawn}/>

      <Books position={[-5.1,0.95,2.1]} scale={1} rotation={[0,Math.PI/2,0]} />

      Телефон 2
      {spawn2Telephone && (<AddableItem 
      position={[-4.3, 0.8, 1.7]}
      rotation={[0,Math.PI/2,0]} 
      size={1}
      cameraRef={camera} 
      threshold={3} 
      image='images/Телефон 2.png'
      mesh='src/models/phone_2_empty.glb'
      description='Специальное устройство, на которое записан учебный вопрос. На задней стороне есть номер – 2.'
      descriptionAddedPhone='Специальное устройство, на которое записан учебный вопрос. 
      На задней стороне есть номер – 2.
      На экране выводится значение – 5.' 
      addItemToInventory={addItemToInventory} 
      name='Телефон' 
      keys={keys}
      questionType={'radio'}
      setActiveQuestion={setActiveQuestion}
      setQuestionType={setQuestionType}/>)}

      Подсказка для УФ лампы
      <AddableItem 
      position={[-4.75, 1, 1.2]} 
      size={1.3}
      cameraRef={camera} 
      threshold={3} 
      image='images/Подсказка.png'
      mesh='src/models/paper1_notext.glb'
      description='Листок с изображением лампочки, возможно это намек чтобы воспользоваться чем то в комнате.' 
      addItemToInventory={addItemToInventory} 
      name='Листок с изображением лампочки' 
      keys={keys}/>
      
      Кружка
      <Cup position={[-4.8, 0.95, 2.3]} scale={1} rotation={[0,Math.PI/2,0]}/>
      
      Стрелка часовая
      <AddableItem 
      position={[-4.8, 0.95, 2.3]} 
      cameraRef={camera} 
      threshold={3} 
      image={'images/Часовая стрелка.png'}
      mesh='src/models/arrow_hour.glb' 
      description='Одна из двух потерянных стрелок. Определяет какой сейчас час.' 
      addItemToInventory={addItemToInventory} 
      name='Часовая стрелка'
      keys={keys}/>
      
      Стол для аквариума
      <Table position={[-4.9, 0, -2]} scale={1} rotation={[0,Math.PI/2,0]}/>

      Аквариум
      <IteractableItem 
      position={[-4.9, 0.9, -2]} 
      cameraRef={camera} 
      threshold={3}
      size={1.5} 
      meshBeforeIteract='src/models/aquarium.glb'
      meshAfterIteract='src/models/aquarium.glb'
      descriptionBefore='Тут могут жить различные морские обитатели. Прямо сейчас аквариум занят опасной пираньей. Руки здесь лучше не мыть.'
      descriptionAfter='Тут могут жить различные морские обитатели. Прямо сейчас аквариум занят опасной пираньей. Руки здесь лучше не мыть.'
      name='Аквариум'
      isActive={aquariumActive} 
      keys={keys}
      itemInHand={itemInHand}
      removeItemFromInventory={removeItemFromInventory}
      addItemToInventory={addItemToInventory}
      activateItem={handleAquariumAction}/>

      {spawn3Telephone && (
        <Phone 
        position={[-5, 1.07, -1.6]}
        rotation={[0,Math.PI,0]}
        scale={1}/>)}
      Пиранья
      <Piranha 
      startPosition={[-4.9, 1.4, -2]}
      goDown={piranhaFollowMeat}
      />

      Мясо
      {piranhaFollowMeat && (<Meat
      startPosition={[-4.9, 1.4, -2]}
      isActive={piranhaFollowMeat}/>)}

      Стеллаж в рядом с часами
      <Shlef position={[-4.5, 0, -5.68]} scale={1} rotation={[0,0,0]} type={2}/>
      
      Пирамида на стеллаже
      <IteractableItem 
      position={[-5, 2.25, -5.7]} 
      size={1} 
      rotation={[0,Math.PI/6,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Пирамида'
      meshBeforeIteract='src/models/can_pyramid.glb' 
      meshAfterIteract='src/models/can_pyramid_fallen.glb'/>

      Подсказка красная
      <HintRed position={[-5, 2.6, -5.7]}
      scale={0.4}
      rotation={[0,Math.PI/6,0]}/>

      Подсказка для часов
      <AddableItem 
      position={[-4, 1, -5.7]} 
      size={1.1}
      rotation={[0,0,0]} 
      cameraRef={camera} 
      threshold={3} 
      image='images/Подсказка.png'
      mesh='src/models/paper2.glb'
      description='Листок с запиской. Содержание: Если кто найдет стрелки, установите время в часах на полдевятого – начало моего рабочего дня. Заведующий кабинетом' 
      addItemToInventory={addItemToInventory}
      name='Листок с неким текстом'
      keys={keys}/>
      
      Часы
      <IteractableItem 
      position={[-2.5, 2, -5.85]} 
      size={1.5} 
      rotation={[0,0,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Часы' 
      descriptionBefore='В современное время не часто можно увидеть такие громоздкие приспособления. Может они не только время показывать умеют. Прямо сейчас в часах нет стрелок, без них от устройства нет смысла.'
      descriptionAfter='В современное время не часто можно увидеть такие громоздкие приспособления. Может они не только время показывать умеют.'
      meshBeforeIteract={clockModel} 
      meshAfterIteract='src/models/clock_opened_solved.glb'
      keys={keys}
      removeItemFromInventory={removeItemFromInventory}
      itemInHand={itemInHand}
      activateItem={handleClockAction}/>

      Телефон 4
      {spawn4Telephone && (<AddableItem 
      position={[-2.5, 1.08, -5.9]}
      rotation={[0,0,0]} 
      size={0.6}
      cameraRef={camera} 
      threshold={3} 
      image='images/Телефон 4.png'
      mesh='src/models/phone_3_empty.glb'
      description='Специальное устройство, на которое записан учебный вопрос. На задней стороне есть номер – 4.'
      descriptionAddedPhone='Специальное устройство, на которое записан учебный вопрос. 
      На задней стороне есть номер – 4.
      На экране выводится значение – 8.' 
      addItemToInventory={addItemToInventory} 
      name='Телефон' 
      keys={keys}
      questionType={'text'}
      setActiveQuestion={setActiveQuestion}
      setQuestionType={setQuestionType}/>)}
      
      Диван
      <Couch position={[0, 0,-5.24]} scale={1} rotation={[0,0,0]} />
      Подушка
      <Pillow position={[-0.8, 0.73, -5]} scale={1} rotation={[0,0,Math.PI/36]} />

      Пистолет
      <AddableItem 
      position={[-0.3, 0.68, -5]}
      size={1}
      rotation={[Math.PI/2,0,0]}
      cameraRef={camera}
      threshold={3}
      name='Пистолет'
      image='images/Пистолет.png'
      description='С этой игрушкой можно чувствовать себе увереннее. Отлично подходит для сбивания пустых банок или бутылок. Не работает без патронов.'
      mesh='src/models/toygun.glb'
      addItemToInventory={addItemToInventory}
      keys={keys}/>
      
      Ящик со стрелкой
      <IteractableItem 
      position={[-1.1,0,-1.5]} 
      size={1.3} rotation={[0,Math.PI,0]} 
      cameraRef={camera} 
      threshold={3} 
      name='Ящик' 
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'  
      meshBeforeIteract='src/models/nightstand.glb' 
      meshAfterIteract='src/models/nightstand_opened.glb'
      keys={keys}
      activateItem={handleMinuteArrowSpawn}/>

      {minuteArrowSpawn && <AddableItem 
      position={[-1,0.9,-2]}
      size={2}
      rotation={[Math.PI/2,0,Math.PI/2]}
      cameraRef={camera}
      threshold={3}
      name='Минутная стрелка'
      image='images/Минутная стрелка.png'
      addItemToInventory={addItemToInventory}
      mesh={'src/models/arrow_minute.glb'}
      description='Одна из двух потерянных стрелок. Определяет какая сейчас минута.'
      keys={keys}/>}
      
      Шкаф у колонны с телефоном
      <IteractableItem 
      position={[-1,0,0.2]} 
      size={1} 
      rotation={[0,0,0]}
      threshold={3}
      cameraRef={camera}
      name='Ящик c кодовым замком'
      descriptionBefore='Специализированное место для хранения различных предметов или инструментов.'
      descriptionAfter='Специализированное место для хранения различных предметов или инструментов.'
      meshBeforeIteract='src/models/locker_withlock.glb'
      meshAfterIteract='src/models/locker_opened.glb'
      keys={keys}/>

      Телефон Финал
      <AddableItem 
      position={[-1,1.37,0.2]}
      rotation={[0,0,0]} 
      size={1}
      cameraRef={camera} 
      threshold={1.5} 
      image='images/Телефон 5.png'
      mesh='src/models/phone_5_empty.glb'
      description='Специальное устройство, на которое записан учебный вопрос.'
      descriptionAddedPhone='Специальное устройство, на которое записан учебный вопрос. 
      На экране выводится надпись – “Дверь открыта”.' 
      addItemToInventory={addItemToInventory} 
      name='Телефон' 
      keys={keys}
      questionType={'text'}
      setActiveQuestion={setActiveQuestion}
      setQuestionType={setQuestionType}/>
      
      <MovableCube 
        position={[0, 0.5, 0]} 
        rotationSpeed={0.005} 
        playerSpeed={0.05} 
        camera={camera}
        isInventoryLocked={isInventoryLocked} 
        keys={keys}
      />
    </Canvas>
    </>
  );
};
export default Scene;