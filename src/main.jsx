import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import ReactDOM from 'react-dom';
import './index.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Open from './Inventory'; // Импорт инвентаря

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/ window.innerHeight, 0.1,1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)
renderer.render(scene,camera)


const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambient = new THREE.AmbientLight(0xffffff)
scene.add(pointLight,ambient)

const lhelper = new THREE.PointLightHelper(pointLight)
const gridHealper = new THREE.GridHelper(200,50)
scene.add(lhelper,gridHealper)


let yaw = 0; // Вращение вокруг вертикальной оси (влево/вправо)
let rotationSpeed = 0.005; // Скорость вращения


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

let keys = {};
let playerSpeed = 0.1; // Скорость движения

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
    // Рендерим сцену
    renderer.render(scene, camera);

    // Движение куба относительно текущей ориентации
    if (keys['KeyW']) cube.translateOnAxis(forward, playerSpeed);
    if (keys['KeyS']) cube.translateOnAxis(forward, -playerSpeed);
    if (keys['KeyA']) cube.translateOnAxis(right, -playerSpeed);
    if (keys['KeyD']) cube.translateOnAxis(right, playerSpeed);
    if (keys['KeyI']) Open();

    renderer.render(scene, camera);
}
animateCube();


