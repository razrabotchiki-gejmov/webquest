import React, { useState } from 'react';
import Scene from './scene';
import Inventory from './Inventory';
import CustomCursor from './CustomCursor';

function App() {
  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  const [addItemToInventory, setAddItemToInventory] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: window.innerWidth / 2,
    y: window.innerHeight / 2, });
  //console.log('isInventoryLocked ' + isInventoryLocked);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Scene addItemToInventory={addItemToInventory} isInventoryLocked={isInventoryLocked}/>
      <Inventory setIsInventoryLocked={setIsInventoryLocked} setAddItemToInventory={setAddItemToInventory} cursorPosition={cursorPosition}/>
      <CustomCursor isInventoryLocked={isInventoryLocked} setPosition={setCursorPosition} position={cursorPosition}/>
    </div>
  );
}

export default App;
