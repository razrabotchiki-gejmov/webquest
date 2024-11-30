import React, { useState } from 'react';
import './Inventory.css';

const Inventory = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleInventory = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button onClick={toggleInventory}>Toggle Inventory</button>
      {isVisible && (
        <div className="inventory">
          <h1>Inventory</h1>
          <p>Your items will be here...</p>
        </div>
      )}
    </>
  );
};

export default Inventory;
