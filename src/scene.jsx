import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import React, { useEffect, useRef } from 'react';

const Scene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75,window.innerWidth/ window.innerHeight, 0.1,1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })

    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.setZ(30)

    let yaw = 0; // Вращение вокруг вертикальной оси (влево/вправо)
    let rotationSpeed = 0.005; // Скорость вращения
    let keys = {};
    let playerSpeed = 0.1; // Скорость движения


    document.body.addEventListener('click', () => {
      document.body.requestPointerLock();
    });
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
          document.exitPointerLock();
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === document.body) {
          const deltaX = event.movementX; // Смещение мыши по X
          yaw -= deltaX * rotationSpeed; // Поворачиваем камеру в сторону движения мыши
      }
    });

    // Добавление куба
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    scene.add(cube);
    cube.add(camera);
    camera.position.set(0, 1, 0);


    // Добавляем плоскость
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Повернуть плоскость
    scene.add(plane);

    // Создаём "комнату" с помощью BoxGeometry
    const roomGeometry = new THREE.BoxGeometry(10, 10, 10);
    const roomMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xffc0cb, side: THREE.DoubleSide }), // Левая стена
      new THREE.MeshBasicMaterial({ color: 0xffc0cb, side: THREE.DoubleSide }), // Правая стена
      new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.DoubleSide }), // Верх (потолок)
      new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.DoubleSide }), // Низ (пол)
      new THREE.MeshBasicMaterial({ color: 0xffc0cb, side: THREE.DoubleSide }), // Задняя стена
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide }), // Передняя стена (отсутствует)
    ];

    const room = new THREE.Mesh(roomGeometry, roomMaterials);
    room.position.set(0, 0, 0); // Поднимаем комнату
    scene.add(room);

    // Обработка нажатий клавиш
    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    // Анимация с перемещением
    function animateCube() {
        requestAnimationFrame(animateCube);

        const forward = new THREE.Vector3(0, 0, -1); // Ось "вперёд"
        const right = new THREE.Vector3(1, 0, 0);   // Ось "вправо"
        // Обновляем поворот кубa
        cube.rotation.y = yaw;
        // Движение куба относительно текущей ориентации
        if (keys['KeyW']) cube.translateOnAxis(forward, playerSpeed);
        if (keys['KeyS']) cube.translateOnAxis(forward, -playerSpeed);
        if (keys['KeyA']) cube.translateOnAxis(right, -playerSpeed);
        if (keys['KeyD']) cube.translateOnAxis(right, playerSpeed);

        renderer.render(scene, camera);
    }
    animateCube();
    return () => {
      renderer.dispose();
    };
  },[]);

  return (
    <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }} // Добавьте стили здесь
    />
);
};

export default Scene;

