import React, { useRef, useState, useEffect } from 'react';
import {useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import './item.css';

const AddableItem = ({ 
  position = [0, 0, 0], 
  cameraRef, 
  threshold = 2, 
  image, 
  addItemToInventory, 
  name,
  description = '' }) => {

  const ref = useRef();
  const [isDeleted, setIsDeleted] = useState(false);
  const [keys, setKeys] = useState({KeyE : false});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [isInspecting, setIsInspecting] = useState(false);

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
      if (intersects.length > 0 && intersects[0].distance < threshold && keys['KeyE']) {  
        console.log('Предмет добавлен')      
        setContextMenu({
          visible: true,
          x: window.innerWidth / 2, // Центр экрана
          y: window.innerHeight / 2,
        });
        console.log(contextMenu.visible);
        console.log('Position:', contextMenu.x + ' ' + contextMenu.y);
      }    
  });
 // Закрыть контекстное меню
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  // Подобрать предмет
  const handlePickup = () => {
    if (addItemToInventory) {
      addItemToInventory({ name: name, imageUrl: image });
      setIsDeleted(true);
      closeContextMenu();
    }
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

  if (isDeleted) return null;
  return (
    <>
      {/* Mesh для предмета */}
      <mesh ref={ref} position={position} receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" side={THREE.DoubleSide} />
      </mesh>

      {/* Контекстное меню */}
      {contextMenu.visible && (
        <Html 
        position={[contextMenu.x, contextMenu.y, cameraRef.current.position.z - 2]} 
        center
      >
            <div
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            >
                <div className="context-menu-item" onClick={handlePickup}>
                    Подобрать предмет
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
        position={[contextMenu.x, contextMenu.y, cameraRef.current.position.z - 2]} 
        center
      >
            <div className="item-description-modal" onClick={closeInspect}>
                <div className="item-description-content">
                    <h2>{name}</h2>
                    <p>{description}</p>
                    <img src={image} alt={name} />
                </div>
            </div>
        </Html>
      )}
    </>
  );
};

export default AddableItem;