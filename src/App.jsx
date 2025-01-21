import React, { useState } from 'react';
import Scene from './scene';
import Inventory from './Inventory';
import CustomCursor from './CustomCursor';
import CallingQuestion from './CallingQuestion';

function App() {
  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  const [addItemToInventory, setAddItemToInventory] = useState(null);
  const [removeItemFromInventory, setRemoveItemFromInventory] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: window.innerWidth / 2,
    y: window.innerHeight / 2, });
  const [itemInHand, setItemInHand] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(false);
  const [questionType, setQuestionType] = useState('');
  //console.log('isInventoryLocked ' + isInventoryLocked);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Scene 
      addItemToInventory={addItemToInventory} 
      isInventoryLocked={isInventoryLocked} 
      itemInHand={itemInHand} 
      removeItemFromInventory={removeItemFromInventory} 
      setQuestionType={setQuestionType}
      setActiveQuestion={setActiveQuestion}
      activeQuestion={activeQuestion}/>
      <Inventory 
      setIsInventoryLocked={setIsInventoryLocked} 
      setAddItemToInventory={setAddItemToInventory} 
      setItemInHand={setItemInHand} 
      cursorPosition={cursorPosition} 
      setRemoveItemFromInventory={setRemoveItemFromInventory}
      activeQuestion={activeQuestion}/>
      <CustomCursor 
      isInventoryLocked={isInventoryLocked} 
      setPosition={setCursorPosition} 
      position={cursorPosition}/>
      <CallingQuestion isActive={activeQuestion}
      setIsActive={setActiveQuestion}
      questionType={questionType}/>
    </div>
  );
}

export default App;
