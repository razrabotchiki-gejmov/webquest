import React, { useState } from 'react';
import Scene from './scene';
import Inventory from './Inventory';
import CustomCursor from './CustomCursor';
import CallingQuestion from './CallingQuestion';

function App() {
  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  const [addItemToInventory, setAddItemToInventory] = useState(null);
  const [removeItemFromInventory, setRemoveItemFromInventory] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [itemInHand, setItemInHand] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(false);
  const [questionType, setQuestionType] = useState('');
  const [interactionMessage, setInteractionMessage] = useState(false); // Added state
  const [interactionItemName, setInteractionItemName] = useState(''); // Added state for item name
  const [interactionItemDescription, setInteractionItemDescription] = useState(''); // Added state for item description

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Scene
        addItemToInventory={addItemToInventory}
        isInventoryLocked={isInventoryLocked}
        itemInHand={itemInHand}
        removeItemFromInventory={removeItemFromInventory}
        setQuestionType={setQuestionType}
        setActiveQuestion={setActiveQuestion}
        activeQuestion={activeQuestion}
        setInteractionMessage={setInteractionMessage} // Passed function
        setInteractionItemName={setInteractionItemName} // Passed function for item name
        setInteractionItemDescription={setInteractionItemDescription} // Passed function for item description
      />
      <Inventory
        setIsInventoryLocked={setIsInventoryLocked}
        setAddItemToInventory={setAddItemToInventory}
        setItemInHand={setItemInHand}
        cursorPosition={cursorPosition}
        setRemoveItemFromInventory={setRemoveItemFromInventory}
        activeQuestion={activeQuestion}
        interactionMessage={interactionMessage} // Passed state
        interactionItemName={interactionItemName} // Passed item name
        interactionItemDescription={interactionItemDescription} // Passed item description
        setInteractionMessage={setInteractionMessage} // Passed function
      />
      <CustomCursor
        isInventoryLocked={isInventoryLocked}
        setPosition={setCursorPosition}
        position={cursorPosition}
      />
      <CallingQuestion
        isActive={activeQuestion}
        setIsActive={setActiveQuestion}
        questionType={questionType}
      />
    </div>
  );
}

export default App;
