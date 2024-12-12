import React, { useState } from 'react';
import Scene from './scene';
import Inventory from './Inventory';

function App() {
  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  const [addItemToInventory, setAddItemToInventory] = useState(null)
    //console.log('App рендерится');
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Scene addItemToInventory={addItemToInventory} isInventoryLocked={isInventoryLocked}/>
      <Inventory setIsInventoryLocked={setIsInventoryLocked} setAddItemToInventory={setAddItemToInventory}/>
    </div>
  );
}

export default App;
