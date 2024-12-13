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
  const [draggedItem, setDraggedItem] = useState(null);
  const [prevIndex, setPrevIndex] = useState(0);

  const handleDragStart = (index) => {
    console.log(index);
    setDraggedItem(grid[index]); // Сохраняем перетаскиваемый предмет
    setPrevIndex(index);
    console.log(draggedItem);
    console.log(prevIndex);
  };

  const handleMouseUp = (index) => {
    if (draggedItem) {
      setGrid((prev) =>
        prev.map((cell, i) =>
          i === index ? { ...cell, item: draggedItem.item } : cell
        )
      );
      if(grid[index] !== null && index !== prevIndex)
      {
        setGrid((prev) => prev.map((cell, i) => (i === prevIndex ? { ...cell, item: null } : cell))); // Убираем предмет из исходной ячейки
        setDraggedItem(null); // Сбрасываем состояние
      }
    }
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
              //draggable={!!cell.item}
              onMouseDown={() => handleDragStart(index)}
              onMouseUp={() => handleMouseUp(index)}
              onMouseEnter={(e) => e.preventDefault()}
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
