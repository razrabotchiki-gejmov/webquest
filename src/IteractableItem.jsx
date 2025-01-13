import React, { useRef, useState, useEffect } from 'react';
import {useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import './IteractableItem.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';
import HoverableObject from './HoverableObject';
import { FixedTimer } from 'three/examples/jsm/Addons.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const IteractableItem = ({ 
  position = [0, 0, 0], 
  cameraRef, 
  threshold = 2,
  size = 1,
  rotation = [0, -Math.PI/2, 0],
  name,
  itemInHand,
  description = 'Описание 123',
  meshBeforeIteract = '',
  meshAfterIteract = '',
  removeItemFromInventory,
  addItemToInventory,
  isActive = true,
  activateItem
}) => {
  const handleHoverChange = (isHovered) => {
    console.log(isHovered ? "Hovered" : "Not Hovered");
  };
  const ref = useRef();
  const [keys, setKeys] = useState({KeyE : false});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, z: 0 });
  const [isInspecting, setIsInspecting] = useState(false);
  const [isIteracted, setIsIteracted] = useState(false);
  const initialMesh = useLoader(GLTFLoader, meshBeforeIteract);
  const afterMesh =  useLoader(GLTFLoader, meshAfterIteract);
  
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
    if (!cameraRef?.current || !ref.current || !isActive) return; 
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
        console.log(contextMenu.visible);
      }    
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
    const item = itemInHand;
    if(isActive)
    {
      if(itemInHand) 
      { 
        if(name == 'Лампа' && itemInHand.name =='уф лампа')
        {
          setIsIteracted(true);
          if(removeItemFromInventory)
            removeItemFromInventory(itemInHand);
        }
        if(name == 'Лампа' && itemInHand.name =='Листок с подсказкой' && isIteracted)
        {
          if(removeItemFromInventory)
            removeItemFromInventory(itemInHand);
            setTimeout(() =>{
              addItemToInventory({name: item.name, imageUrl: '/images/Листок для часов.jpg'});
              activateItem();
            },3000);
        }
      }
      if(name == 'Шкаф' && !isIteracted)
      {
        setIsIteracted(true);
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

  return (
    <>
    
      {/* Mesh для предмета */}

      
      {!isIteracted ? (
        <primitive
          ref={ref}
          object={initialMesh.scene}
          position={position}
          rotation={rotation}
          scale={size}
        />
      ) : (
        <primitive
          ref={ref}
          object={afterMesh.scene}
          position={position}
          rotation={rotation}
          scale={size}
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
                <div className="context-menu-item" onClick={handleUse}>
                    Взаимодействие
                </div>
                <div className="context-menu-item" onClick={handleInspect}>
                    Описание
                </div>
            </div>
        </Html>
      )}

      {/* Описание предмета */}
      {isInspecting && (
        <Html 
        position={[contextMenu.x, contextMenu.y, contextMenu.z]}  
        center
        >
            <div className="item-description-modal" onClick={closeInspect}>
                <div className="item-description-content">
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </Html>
      )}
    </>
  );
};

export default IteractableItem;