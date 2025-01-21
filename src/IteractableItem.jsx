import React, { useRef, useState, useMemo } from 'react';
import {useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import './IteractableItem.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';
import { FixedTimer } from 'three/examples/jsm/Addons.js';
import ClockInteraction from './ClockInteraction';
import { add } from 'three/webgpu';
import LockUI3 from './LockUI3';
import LockUI4 from './LockUI4';

const IteractableItem = ({ 
  position = [0, 0, 0], 
  cameraRef, 
  threshold = 2,
  size = 1,
  rotation = [0, -Math.PI/2, 0],
  name,
  itemInHand,
  descriptionBefore = 'Описание 123',
  descriptionAfter = 'Описание после',
  meshBeforeIteract = '',
  meshAfterIteract = '',
  removeItemFromInventory,
  addItemToInventory,
  isActive = true,
  activateItem,
  keys,
}) => {
  const handleHoverChange = (isHovered) => {
    console.log(isHovered ? "Hovered" : "Not Hovered");
  };
  const ref = useRef();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, z: 0 });
  const [isInspecting, setIsInspecting] = useState(false);
  const [isIteracted, setIsIteracted] = useState(false);
  const initMesh = useLoader(GLTFLoader, meshBeforeIteract);
  const aftMesh =  useLoader(GLTFLoader, meshAfterIteract);
  const initialMesh = useMemo(() => initMesh.scene.clone(), [initMesh]);
  const afterMesh = useMemo(() => aftMesh.scene.clone(), [aftMesh]);
  const [clockActive, setClockActive] = useState(false);
  const [arrowsCount,setArrowsCount] = useState(0);
  const [lock5Active, setLock5Active] = useState(false);
  const [lock10Active, setLock10Active] = useState(false);
  useFrame(() => {
    if (!cameraRef?.current || !ref.current) return; 
      // Создаем луч из камеры в направлении ее взгляда
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: 0, y: 0 }, cameraRef.current); // Центр экрана (x=0, y=0)
      //console.log(raycaster.intersectObject(ref.current))
      const intersects = raycaster.intersectObject(ref.current);

      // Меняем состояние видимости на основе расстояния
      if (intersects.length > 0 && intersects[0].distance < threshold && keys['KeyE']) {      
        setContextMenu({
          visible: true,
          x: cameraRef.current.position.x + cameraRef.current.getWorldDirection(new THREE.Vector3()).x * 2 , // Центр экрана
          y: cameraRef.current.position.y + cameraRef.current.getWorldDirection(new THREE.Vector3()).y * 2,
          z: cameraRef.current.position.z + cameraRef.current.getWorldDirection(new THREE.Vector3()).z * 2,
        });
        //console.log(contextMenu.x + ' ' + contextMenu.y + ' ' + contextMenu.z);
      }
      if((contextMenu.visible || isInspecting) && keys['Escape'])
      {
        closeContextMenu();
        closeInspect();
      }
      if(arrowsCount==2 && meshBeforeIteract != 'src/models/clock_closed_witharrows.glb')
        activateItem();  
  });
 // Закрыть контекстное меню
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: contextMenu.x, y: contextMenu.y, z: contextMenu.z });
  };

  // Подобрать предмет
  const handleUse = () => {
    console.log(!itemInHand)
    console.log(itemInHand);
    console.log(isActive);
    console.log(name)
    const item = itemInHand;
    if(isActive)
    {
      if(itemInHand && removeItemFromInventory) 
      { 
        if(name == 'Лампа' && itemInHand.name =='уф лампа')
        {
          setIsIteracted(true);
            removeItemFromInventory(itemInHand);
        }
        if(name == 'Лампа' && itemInHand.name =='Листок с изображением лампочки' && isIteracted)
        {
            removeItemFromInventory(itemInHand);
            setTimeout(() =>{
              addItemToInventory({name: 'Листок с изображение шкафа', imageUrl: '/images/шкаф.jpg'});
              activateItem();
            },3 * 1000);
        }
        if(name == 'Часы' && (itemInHand.name === 'Часовая стрелка' || itemInHand.name === 'Минутная стрелка'))
          {
            removeItemFromInventory(itemInHand)
            setArrowsCount((prev) => prev + 1)
          }
        if(name == 'Микроволновка' && itemInHand.name=='Мясо замороженное')
        {
          removeItemFromInventory(itemInHand)
          setIsIteracted(true);
          setTimeout(() =>{
            addItemToInventory({name: 'Мясо', imageUrl: ''})
            setIsIteracted(false);
            activateItem();
          },25 * 1000)
        }
        if(name=='Аквариум' && itemInHand.name == 'Мясо' && !isIteracted)
          {
            removeItemFromInventory(itemInHand);
            setIsIteracted(true);
            activateItem();
          }         
      }
      if(name == 'Шкаф' && !isIteracted)
      {
        setIsIteracted(true);
        activateItem();
      }
      if(name == 'Часы' && arrowsCount==2 && !isIteracted)
      {
        setClockActive(true);
      }
      if(name == 'Стол с замком' && !isIteracted)
      {
        setLock5Active(true);
        if(activateItem)
          activateItem();
      }
      if(name == 'Ящик' || name == 'Холодильник')
      {
        console.log('Ящик со стрелкой открыт?'+ isIteracted);
        setIsIteracted((prev) => !prev);
        if(activateItem)
          activateItem();
      }
      if(name == 'Ящик c кодовым замком' && !isIteracted)
      {
        setLock10Active(true)
      }
      if(name=='Аквариум' && isIteracted)
      {
          activateItem();
      }
    }
      closeContextMenu();
      console.log(isIteracted);
  };

  // Показать описание
  const handleInspect = () => {
    setIsInspecting(true);
    closeContextMenu();
  };

  // Закрыть описание
  const closeInspect = () => {
    setIsInspecting(false);
  };

  const handleClockClose = () =>{
    setClockActive(false);
  }

  const handleLock5Close =() =>
  {
    setLock5Active(false);
  }

  const handleLock10Close =() =>
  {
    setLock10Active(false);
  }

  const destroyPyramid =() =>
  {
    setIsIteracted(true);
  }
  return (
    <>
    
      {/* Mesh для предмета */}

      
      {!isIteracted ? (
        <primitive
          ref={ref}
          object={initialMesh}
          position={position}
          rotation={rotation}
          scale={size}
          name={name}
          userData={destroyPyramid}
        />
      ) : (
        <primitive
          ref={ref}
          object={afterMesh}
          position={position}
          rotation={rotation}
          scale={size}
          name={name}
        />
      )}

      {/* Контекстное меню */}
      {contextMenu.visible && (
        <Html  
        position={[contextMenu.x, contextMenu.y, contextMenu.z]} 
        center
      >
            <div
            className="context-menu"
            >
                {isActive && (<div className="context-menu-item" onClick={handleUse}>
                    Взаимодействие
                </div>)}
                <div className="context-menu-item" onClick={handleInspect}>
                    Описание
                </div>
            </div>
        </Html>
      )}

      {/* Описание предмета */}
      {isInspecting && ( !isIteracted ? (
        <Html 
        position={[contextMenu.x, contextMenu.y, contextMenu.z]}  
        center
        >
            <div className="item-description-modal" onClick={closeInspect}>
                <div className="item-description-content">
                    <h2>{name}</h2>
                    <p>{descriptionBefore}</p>
                </div>
            </div>
        </Html>) : (
        <Html 
        position={[contextMenu.x, contextMenu.y, contextMenu.z]}  
        center
        >
            <div className="item-description-modal" onClick={closeInspect}>
                <div className="item-description-content">
                    <h2>{name}</h2>
                    <p>{descriptionAfter}</p>
                </div>
            </div>
        </Html>))
      }
      {clockActive && <ClockInteraction 
      correctHour={8.5} 
      position={[contextMenu.x, contextMenu.y, contextMenu.z]} 
      onSuccess={() => {
        setIsIteracted(true);
        handleClockClose();
        activateItem();
      }}
      onClose={handleClockClose}/>
      }

      {lock5Active && <LockUI3
      position={[contextMenu.x,contextMenu.y,contextMenu.z]}
      onUnlock={() =>
      {
        setIsIteracted(true);
        handleLock5Close();
      }
      }
      onClose={handleLock5Close}/>
      }

      {lock10Active && <LockUI4
      position={[contextMenu.x,contextMenu.y,contextMenu.z]}
      onUnlock={() =>
      {
        setIsIteracted(true);
        handleLock10Close();
      }
      }
      onClose={handleLock10Close}/>
      }
    </>
  );
};

export default IteractableItem;