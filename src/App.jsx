import React from 'react';
import Scene from './scene';
import Inventory from './inventory';

function App() {
    console.log('App рендерится');
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Scene />
      <Inventory />
    </div>
  );
}

export default App;
