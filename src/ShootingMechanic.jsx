import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Projectile = ({position, direction, onHit}) => {
  const ref = useRef();
  const [hit, setHit] = useState(false);
  const { scene } = useThree();
  const name = 'Шар'

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
        console.log(name + " попал в:", hitObject.name || "Никуда");
        setHit(true);
        console.log(hitObject.parent.parent)
        console.log(hitObject.parent.parent.userData)
        if(hitObject.parent.parent.name.includes('ирамида'))
        {
          if(hitObject.parent.parent.userData)
            hitObject.parent.parent.userData();
        }
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
  const [lastShotTime, setLastShotTime] = useState(0);

  const handleShoot = (event) => {
    const currentTime = Date.now();
    if (!camera.current || currentTime - lastShotTime < 1000) return;

    const direction = new THREE.Vector3();
    camera.current.getWorldDirection(direction);
    setProjectiles(prev => [...prev, {
      id: Math.random(),
      position: camera.current.position.clone(),
      direction: direction.normalize()
    }]);
    setLastShotTime(currentTime);
  };

  useEffect(() => {
    window.addEventListener('click', handleShoot);
    return () => window.removeEventListener('click', handleShoot);
  }, [camera, lastShotTime]);

  return projectiles.map(proj => (
    <Projectile
      key={proj.id}
      position={proj.position}
      direction={proj.direction}
    />
  ));
};

export { Projectile, ShootingMechanic };