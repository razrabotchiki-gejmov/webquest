import React, { useState, useEffect } from 'react';
import './Inventory.css';

function Inventory({ setAddItemToInventory, setIsInventoryLocked, setItemInHand, setRemoveItemFromInventory }) {
  const [isVisible, setIsVisible] = useState(false);
  const [grid, setGrid] = useState(
    Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      item: index < 4
        ? { name: `Item ${index + 1}`, imageUrl: `/images/item${index + 1}.png` }
        : null,
    }))
  );

  const [hotbar, setHotbar] = useState(Array(5).fill(null));
  const [selectedHotbarIndex, setSelectedHotbarIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
  const [inspectedItem, setInspectedItem] = useState(null);

  // Переключение видимости инвентаря
  const toggleInventory = () => {
    setIsVisible((prev) => !prev);
    setIsInventoryLocked((prev) => !prev);
    setContextMenu({ visible: false, x: 0, y: 0, item: null }); // Закрыть контекстное меню
  };

  // Устанавливаем горячую панель на основе первой строки инвентаря
  useEffect(() => {
    setHotbar(grid.slice(0, 5));
  }, [grid]);

  // Функция для добавления предмета в инвентарь
  const addItemToInventory = (item) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const firstEmptyIndex = newGrid.findIndex((cell) => cell.item === null);
      if (newGrid.some((cell) => cell.item === item)) return prevGrid;
      if (firstEmptyIndex !== -1) {
        newGrid[firstEmptyIndex].item = item;
      }
      return newGrid;
    });
  };
  // Функция для удаления предмета из инвентаря
  const removeItemFromInventory = (itemName) => {
    setGrid((prevGrid) =>
      prevGrid.map((cell) =>
        cell.item?.name === itemName ? { ...cell, item: null } : cell
      )
    );
  };

  useEffect(() => {
    
    if (setAddItemToInventory) {
      setAddItemToInventory(() => addItemToInventory);
    }
    if (setRemoveItemFromInventory) {
      setRemoveItemFromInventory(() => removeItemFromInventory);
    }

    const handleKeyDown = (event) => {
      if (event.code === 'KeyI') {
        toggleInventory();
      } else if (!isVisible && /^Digit[1-5]$/.test(event.code)) {
        const index = parseInt(event.code.slice(-1)) - 1;
        setSelectedHotbarIndex(index);
        setItemInHand(grid[index].item.name);
        console.log(grid[index].item.name)
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setAddItemToInventory, setIsInventoryLocked, setRemoveItemFromInventory, setItemInHand, isVisible]);

  // Обработчики перетаскивания
  const [draggedItem, setDraggedItem] = useState(null);
  const [prevIndex, setPrevIndex] = useState(0);

  const handleMouseDown = (index) => {
    setDraggedItem(grid[index]);
    setPrevIndex(index);
  };

  const handleMouseUp = (index) => {
    if (draggedItem) {
      setGrid((prev) =>
        prev.map((cell, i) =>
          i === index ? { ...cell, item: draggedItem.item } : cell
        )
      );
      if (grid[index] !== null && index !== prevIndex) {
        setGrid((prev) =>
          prev.map((cell, i) => (i === prevIndex ? { ...cell, item: null } : cell))
        );
      }
      setDraggedItem(null);
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, item });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const handleInspectItem = () => {
    if (contextMenu.item) {
      setInspectedItem(contextMenu.item); // Установить осматриваемый предмет
    }
    closeContextMenu();
  };

  const closeInspectedItem = () => {
    setInspectedItem(null); // Закрыть окно осмотра
  };

  
  return (
    <>
      {/* Инвентарь */}
      {isVisible && (
        <div className="inventory-window">
          <h1>Инвентарь</h1>
          <div className="inventory-items">
            {grid.map((cell, index) => (
              <div
                key={cell.id}
                className="inventory-item"
                onMouseDown={() => handleMouseDown(index)}
                onMouseUp={() => handleMouseUp(index)}
                onContextMenu={(e) => cell.item && handleContextMenu(e, cell.item)}
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

      {/* Горячая панель */}
      {!isVisible && (
        <div className="hotbar">
          {hotbar.map((cell, index) => (
            <div
            key={index}
            className={`hotbar-slot ${index === selectedHotbarIndex ? 'selected' : ''}`}
          >
            {cell?.item && <img src={cell?.item.imageUrl} alt="" />}
          </div>
          ))}
        </div>
      )}

      {/* Контекстное меню */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={closeContextMenu}
        >
          <div className="context-menu-item" onClick={handleInspectItem}>
            Осмотреть
          </div>
        </div>
      )}

      {/* Осматриваемый объект */}
      {inspectedItem && (
        <div className="inspection-modal" onClick={closeInspectedItem}>
          <div className="inspection-content">
            <img src={inspectedItem.imageUrl} alt={inspectedItem.name} />
          </div>
        </div>
      )}
    </>
  );
}

export default Inventory;