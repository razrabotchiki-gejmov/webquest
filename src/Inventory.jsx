import React, { useState, useEffect } from 'react';
import './Inventory.css';

function Inventory({ setIsInventoryLocked }) {
  const [isVisible, setIsVisible] = useState(false);
  const [grid, setGrid] = useState(
    Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      item: index < 4
        ? { name: `Предмет ${index + 1}`, imageUrl: `/images/item${index + 1}.png` }
        : null,
    }))
  );

  // Переключение видимости инвентаря
  const toggleInventory = () => {
    setIsVisible((prev) => !prev);
    setIsInventoryLocked((prev) => !prev);
  };

  // Обработчик нажатия "I"
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyI') {
        toggleInventory();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsInventoryLocked]);

  // Обработчики перетаскивания
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('fromIndex', index);


    const target = e.currentTarget;
    target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    const target = e.currentTarget;
    target.classList.remove('dragging');
  };
  
  const handleDragEnter = (e, index) => {
    e.preventDefault();
  
    // Добавляем стиль для ячейки, в которую перетаскивается предмет
    const target = e.currentTarget;
    target.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    // Убираем стиль, если курсор покидает ячейку
    const target = e.currentTarget;
    target.classList.remove('drag-over');
  };

  const handleDrop = (e, toIndex) => {
    const fromIndex = e.dataTransfer.getData('fromIndex');
    const newGrid = [...grid];
    const [movedItem] = newGrid.splice(fromIndex, 1, { id: grid[fromIndex].id, item: null });
    newGrid[toIndex] = { id: grid[toIndex].id, item: movedItem.item };
    setGrid(newGrid);
  
    // Убираем стиль ячейки
    const target = e.currentTarget;
    target.classList.remove('drag-over');
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
