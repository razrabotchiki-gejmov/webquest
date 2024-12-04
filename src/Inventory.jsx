import React, { useState, useEffect } from 'react';
import './Inventory.css'; // Подключение стилей для инвентаря

function Inventory() {
  const [isVisible, setIsVisible] = useState(false); // Состояние видимости инвентаря

  // Функция для переключения видимости инвентаря
  const toggleInventory = () => {
    setIsVisible((prev) => !prev);
  };

  // Обработчик события для нажатия клавиши "I"
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyI') {
        toggleInventory(); // Переключение видимости инвентаря при нажатии "I"
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="inventory-window">
          <h1>Инвентарь</h1>
          <p>Здесь будут лежать ваши предметы...</p>
        </div>
      )}
    </>
  );
}

export default Inventory;
