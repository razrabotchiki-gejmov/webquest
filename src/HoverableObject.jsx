import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HoverableObject = ({ children, cameraRef, onHoverChange, scaleOnHover = 1, colorOnHover = "yellow", baseColor = "red" }) => {
    const ref = useRef();
    const [isHovered, setIsHovered] = useState(false);

    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    useEffect(() => {
        const handleMouseMove = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useFrame(() => {
        if (cameraRef?.current && ref.current) {
            raycaster.current.setFromCamera(mouse.current, cameraRef.current);
            const intersects = raycaster.current.intersectObject(ref.current);

            if (intersects.length > 0) {
                if (!isHovered) {
                    setIsHovered(true);
                    onHoverChange?.(true); // Вызываем callback на наведение
                }
            } else {
                if (isHovered) {
                    setIsHovered(false);
                    onHoverChange?.(false); // Вызываем callback на снятие наведения
                }
            }
        }
    });

    return (
        <group ref={ref} scale={isHovered ? scaleOnHover : 1}>
            {React.cloneElement(children, {
                material: new THREE.MeshStandardMaterial({ color: isHovered ? colorOnHover : baseColor }),
            })}
        </group>
    );
};

export default HoverableObject;
