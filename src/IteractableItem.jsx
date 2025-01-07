import React, { useRef, useState, useEffect } from 'react';
import {useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import './IteractableItem.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';
import HoverableObject from './HoverableObject';

const IteractableItem = ({ 
  position = [0, 0, 0], 
  cameraRef, 
  threshold = 2,
  name,
  itemInHand,
  description = 'Описание 123',
  meshBeforeIteract = 'src/models/desk.glb',
  meshAfterIteract = 'src/models/chair.glb',
  removeItemFromInventory
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
  const afterMesh = useLoader(GLTFLoader, meshAfterIteract);
  
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
    if (!cameraRef?.current || !ref.current) return; 
      // Создаем луч из камеры в направлении ее взгляда
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: 0, y: 0 }, cameraRef.current); // Центр экрана (x=0, y=0)
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
    console.log(itemInHand);
    if(!isIteracted)
    {
      if(name == 'Лампа' && itemInHand=='уф лампа')
      {
        setIsIteracted(true);
        if(removeItemFromInventory)
          removeItemFromInventory(itemInHand);
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

      <HoverableObject
        cameraRef={cameraRef}
        onHoverChange={handleHoverChange}
        scaleOnHover={1.1}
        colorOnHover="yellow"
        baseColor="red"
      >
        {!isIteracted ? (
          <primitive
            ref={ref}
            object={initialMesh.scene}
            position={position}
            rotation={[0, 80, 0]}
            scale={1}
          />
        ) : (
          <primitive
            ref={ref}
            object={afterMesh.scene}
            position={position}
            rotation={[0, 80, 0]}
            scale={1}
          />
        )}
      </HoverableObject>

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