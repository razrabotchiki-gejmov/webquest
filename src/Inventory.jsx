import React, { useState, useEffect } from 'react';
import './Inventory.css'; // Подключение стилей для инвентаря

function Inventory({ setIsInventoryLocked }) {
  console.log('setIsInventoryLocked:', setIsInventoryLocked);
  const [isVisible, setIsVisible] = useState(false); // Состояние видимости инвентаря
  
  let items = [
    { id: 1, name: 'Предмет 1', imageUrl: '/images/листы с подсказками.png' },
    { id: 2, name: 'Предмет 2', imageUrl: '/images/устройство с вопросом.jpg' },
    { id: 3, name: 'Предмет 3', imageUrl: '/images/уф лампа.avif' },
    { id: 4, name: 'Предмет 4', imageUrl: '/images/шкаф.jpg' }
  ];
  // Функция для переключения видимости инвентаря
  const toggleInventory = () => {
    setIsVisible((prev) => !prev);
    setIsInventoryLocked((prev) => !prev);
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
  }, [isVisible, setIsInventoryLocked]);

  return (
    <>
      {isVisible && (
        <div className="inventory-window">
          <h1>Инвентарь</h1>
          <div className="inventory-items">
            {items.map((item) => (
              <div key={item.id} className="inventory-item">
                <img src={item.imageUrl} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Inventory;
