import React, { useRef, useState, useEffect } from 'react';
import {useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import './AddableItem.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';
import CallingQuestion from './CallingQuestion';

const AddableItem = ({ 
  position = [0, 0, 0], 
  cameraRef, 
  threshold = 2, 
  image, 
  addItemToInventory, 
  name,
  mesh,
  size = 2,
  rotation = [0,Math.PI/2,0],
  description = 'Описание 123',
  keyEPressed = false,
  questionType,
  setQuestionType,
  setActiveQuestion, }) => {

  const ref = useRef();
  const [isDeleted, setIsDeleted] = useState(false);
  const [keys, setKeys] = useState({KeyE : false});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y:0, z: 0 });
  const [isInspecting, setIsInspecting] = useState(false);
  const objectMesh = useLoader(GLTFLoader, mesh);
  useFrame(() => {
    if (isDeleted || !cameraRef?.current || !ref.current) return; 
      // Создаем луч из камеры в направлении ее взгляда
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: 0, y: 0 }, cameraRef.current); // Центр экрана (x=0, y=0)
      const intersects = raycaster.intersectObject(ref.current);

      // Меняем состояние видимости на основе расстояния
      if (intersects.length > 0 && intersects[0].distance < threshold && keyEPressed) {  
        console.log('Предмет добавлен')      
        setContextMenu({
          visible: true,
          x: cameraRef.current.position.x + cameraRef.current.getWorldDirection(new THREE.Vector3()).x * 2 , // Центр экрана
          y: cameraRef.current.position.y + cameraRef.current.getWorldDirection(new THREE.Vector3()).y * 2,
          z: cameraRef.current.position.z + cameraRef.current.getWorldDirection(new THREE.Vector3()).z * 2,
        });
        console.log(contextMenu.visible);
        console.log('Position:', contextMenu.x + ' ' + contextMenu.z);
      }    
  });
 // Закрыть контекстное меню
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: contextMenu.x, y: contextMenu.y, z: contextMenu.z });
  };

  // Подобрать предмет
  const handlePickup = () => {
    if (addItemToInventory) {
      addItemToInventory({ name: name, imageUrl: image, description: description });
      if(name.includes('Телефон'))
        {
          console.log('Ответ появляется')
          setActiveQuestion(true);
          setQuestionType(questionType)
        }
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

  const closeQuestion = () =>
  {
    setActiveQuestion(false);
  }


  return (
    <>
      {/* Mesh для предмета */}
      {!isDeleted && (<primitive
          ref={ref}
          object={objectMesh.scene}
          position={position}
          rotation={rotation}
          scale={size}
      />)}

      {/* Контекстное меню */}
      {contextMenu.visible && (
        <Html  
        position={[contextMenu.x, contextMenu.y, contextMenu.z]} 
        center
      >
            <div
            className="context-menu"
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

export default AddableItem;