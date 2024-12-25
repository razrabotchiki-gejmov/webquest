import React, { useState, useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = ({isInventoryLocked, setPosition, position}) => {
  // Слушаем движение мыши
  useEffect(() => {
    const handleMouseMove = (e) => {
      if(!isInventoryLocked) 
        { 
          setPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 });
        return;
        }
      setPosition((prevPosition) => ({
        x: prevPosition.x + e.movementX,
        y: prevPosition.y + e.movementY,
      }));
    };

    // Отслеживаем события движения мыши
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isInventoryLocked]);

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
