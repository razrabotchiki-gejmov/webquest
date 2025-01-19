import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';

const InteractiveCube = ({ position }) => {
  const ref = useRef();
  const [isInteracting, setIsInteracting] = useState(false);
  const [answer, setAnswer] = useState('');

  const handleInteraction = () => {
    setIsInteracting(true);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    alert(`Ваш ответ: ${answer}`);
    setIsInteracting(false);
  };

  return (
    <>
      <mesh ref={ref} position={position} castShadow onClick={handleInteraction}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {isInteracting && (
        <Html position={[0, 2, 0]} center>
          <div className="interaction-window">
            <p>1 + 1 =</p>
            <form onSubmit={handleAnswerSubmit}>
              <input type="text" value={answer} onChange={handleAnswerChange} />
              <button type="submit">Submit</button>
            </form>
          </div>
        </Html>
      )}
    </>
  );
};

export default InteractiveCube;