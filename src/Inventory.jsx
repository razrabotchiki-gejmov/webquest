import React, { useState, useEffect } from 'react';
import './Inventory.css';

function Inventory({ setAddItemToInventory, setIsInventoryLocked, setItemInHand, setRemoveItemFromInventory, activeQuestion, interactionMessage, interactionItemName, interactionItemDescription, interactionItemImage, setInteractionMessage }) {
  const [isVisible, setIsVisible] = useState(false);
  const [grid, setGrid] = useState(
    Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      item: null,
      description: '',
    }))
  );

  const [hotbar, setHotbar] = useState(Array(5).fill(null));
  const [selectedHotbarIndex, setSelectedHotbarIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
  const [inspectedItem, setInspectedItem] = useState(null);
  const [showDescription, setShowDescription] = useState(false); // New state for description visibility

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
  const addItemToInventory = (item, description, image) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const firstEmptyIndex = newGrid.findIndex((cell) => cell.item === null);
      if (newGrid.some((cell) => cell.item === item)) return prevGrid;
      if (firstEmptyIndex !== -1) {
        newGrid[firstEmptyIndex].item = item;
        newGrid[firstEmptyIndex].description = description;
        newGrid[firstEmptyIndex].imageUrl = image;
      }
      setItemInHand(newGrid[firstEmptyIndex].item);
      setSelectedHotbarIndex(firstEmptyIndex);
      return newGrid;
    });
  };

  // Функция для удаления предмета из инвентаря
  const removeItemFromInventory = (itemName) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const index = newGrid.findIndex((cell) => cell.item === itemName);
      if (index !== -1)
        newGrid[index].item = null;
      return newGrid;
    });
  };

  const recheckItem = (index) => {
    if (!grid[index]) return;
    setItemInHand(grid[index].item);
  };

  useEffect(() => {
    if (activeQuestion) return;
    setInterval(() => recheckItem(activeIndex), 1000);
    if (setAddItemToInventory) {
      setAddItemToInventory(() => addItemToInventory);
    }
    if (setRemoveItemFromInventory) {
      setRemoveItemFromInventory(() => removeItemFromInventory);
    }

    let activeIndex;
    const handleKeyDown = (event) => {
      if (event.code === 'KeyI') {
        toggleInventory();
      } else if (!isVisible && /^Digit[1-5]$/.test(event.code)) {
        activeIndex = parseInt(event.code.slice(-1)) - 1;
        recheckItem(activeIndex);
        setSelectedHotbarIndex(activeIndex);
      } else if (event.code === 'KeyF' && interactionMessage) {
        setShowDescription(true); // Show description when 'F' is pressed
      } else if (event.code === 'KeyE' && showDescription) {
        addItemToInventory({ name: interactionItemName, imageUrl: interactionItemImage, description: interactionItemDescription });
        setShowDescription(false); // Hide description when 'E' is pressed
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setAddItemToInventory, setIsInventoryLocked, setRemoveItemFromInventory, setItemInHand, isVisible, activeQuestion, interactionMessage, interactionItemName, interactionItemDescription, interactionItemImage, showDescription]);

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

  const handleCloseInteraction = () => {
    setInteractionMessage(false); // Закрыть окно взаимодействия
    setShowDescription(false); // Hide description when interaction message is closed
  };

  return (
    <>
      {/* Interaction Message */}
      {interactionMessage && (
        <div className="centre-panel">
          <div className="interaction-block">
          <div className="interaction-item-name">{interactionItemName}</div>
          <div className="interaction-label-row">
            <div className="interaction-text">E</div>
            <div className="interaction-description">Подобрать</div>
            <div className="interaction-text">F</div>
            <div className="interaction-description">Описание</div>
          </div>
        </div>
        </div>
      )}

      {/* Левая часть интерфейса */}
      {!isVisible && (
        <div className="left-panel">
          <div className="movement-block">
            <div className="movement-label">Передвижение</div>
            <div className="wasd-block">
              <div className="movement-text">W</div>
              <div className="asd-block">
                <div className="movement-text">A</div>
                <div className="movement-text">S</div>
                <div className="movement-text">D</div>
              </div>
            </div>
          </div>
          <div className="interaction-block">
            <div className="interaction-label-row">
              <div className="interaction-text">E</div>
              <div className="interaction-description">Взаимодействие</div>
            </div>
            <div className="interaction-label-row">
              <div className="interaction-text">F</div>
              <div className="interaction-description">Прочитать описание</div>
            </div>
            <div className="interaction-label-row">
              <div className="interaction-text">I</div>
              <div className="interaction-description">Открыть инвентарь</div>
            </div>
          </div>
        </div>
      )}
      {/* Инвентарь */}
      {isVisible && (
        <div className="inventory-window">
          <div key="divider" className="divider"></div>
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
                  <img src={cell.item.imageUrl} alt={cell.item.name} />
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
            <div key={index} className={`hotbar-slot ${index === selectedHotbarIndex ? 'selected' : ''}`}>
              <div className="slot-number">{index + 1}</div>
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

      {/* Описание предмета */}
      {contextMenu.visible && contextMenu.item && (
        <div className="description-window">
          <div className="description-title">{contextMenu.item.name}</div>
          <div className="description-divider"></div>
          <div className="description-text">{contextMenu.item.description}</div>
          <img src={contextMenu.item.imageUrl} alt={contextMenu.item.name} />
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

      {/* Description Panel */}
      {showDescription && (
        <div className="description-panel">
          <div className="description-panel-content">
            <h2>{interactionItemName}</h2>
            <p>{interactionItemDescription}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Inventory;
