import React, { useState, useEffect } from 'react';
import './Inventory.css';

function Inventory({setAddItemToInventory, setIsInventoryLocked}) {
  const [isVisible, setIsVisible] = useState(false);
  const [grid, setGrid] = useState(
    Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      item: index < 4
        ? { name: `Предмет ${index + 1}`, imageUrl: `/images/item${index + 1}.png` }
        : null,
    }))
  );

  // Функция для добавления предмета
  const addItemToInventory = (item) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const firstEmptyIndex = newGrid.findIndex((cell) => cell.item === null);
      if((newGrid.findIndex((cell) => cell.item === item)) >= 0) return prevGrid;
      if (firstEmptyIndex !== -1) {
        newGrid[firstEmptyIndex].item = item;
      }
      return newGrid;
    });
    console.log(grid)
  };

  // Переключение видимости инвентаря
  const toggleInventory = () => {
    setIsVisible((prev) => !prev);
    setIsInventoryLocked((prev) => !prev);
    if(isVisible)
      document.exitPointerLock();
    else
      document.body.requestPointerLock();
  };

  useEffect(() => {
    // Устанавливаем функцию добавления предметов
    if (setAddItemToInventory) {
      setAddItemToInventory(() => addItemToInventory);
    }
  
    // Обработчик нажатия "I"
    const handleKeyDown = (event) => {
      if (event.code === 'KeyI') {
        toggleInventory();
      }
    };
  
    // Добавляем обработчик событий
    document.addEventListener('keydown', handleKeyDown);
  
    // Очистка эффекта
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setAddItemToInventory, setIsInventoryLocked]);

  // Обработчики перетаскивания
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('fromIndex', index);
  };

  const handleDrop = (e, toIndex) => {
    const fromIndex = e.dataTransfer.getData('fromIndex');
    const newGrid = [...grid];
    const [movedItem] = newGrid.splice(fromIndex, 1, { id: grid[fromIndex].id, item: null });
    newGrid[toIndex] = { id: grid[toIndex].id, item: movedItem.item };
    setGrid(newGrid);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <>
      {isVisible && (
        <div className="inventory-window">
          <h1>Инвентарь</h1>
          <div className="inventory-items">
            {grid.map((cell, index) => (
              <div
              key={cell.id}
              className="inventory-item"
              draggable={!!cell.item}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {cell.item && (
                <>
                  <img src={cell.item.imageUrl} alt={cell.item.name} />
                  <p>{cell.item.name}</p>
                </>
              )}
            </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Inventory;
