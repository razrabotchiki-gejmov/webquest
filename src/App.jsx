import React, { useState } from 'react';
import Scene from './scene';
import Inventory from './Inventory';
import CustomCursor from './CustomCursor';

function App() {
  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  const [addItemToInventory, setAddItemToInventory] = useState(null)
  console.log('isInventoryLocked ' + isInventoryLocked);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Scene addItemToInventory={addItemToInventory} isInventoryLocked={isInventoryLocked}/>
      <Inventory setIsInventoryLocked={setIsInventoryLocked} setAddItemToInventory={setAddItemToInventory}/>
      <CustomCursor isInventoryLocked={isInventoryLocked}/>
    </div>
  );
}

export default App;
