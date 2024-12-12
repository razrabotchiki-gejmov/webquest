import React, { useState, useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2,
    y: window.innerHeight / 2, });

  // Слушаем движение мыши
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition((prevPosition) => prevPosition);
    };

    // Отслеживаем события движения мыши
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};

export default CustomCursor;
