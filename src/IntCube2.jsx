import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';

const IntCube2 = ({ position }) => {
  const ref = useRef();
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleInteraction = () => {
    setIsInteracting(true);
  };

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer !== null) {
      alert(`Ваш ответ: ${selectedAnswer}`);
    }
    setIsInteracting(false);
    setSelectedAnswer(null);
  };

  return (
    <>
      <mesh ref={ref} position={position} castShadow onClick={handleInteraction}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {isInteracting && (
        <Html position={[4, 2, 0]} center>
          <div className="interaction-window">
            <p>1 + 1 =</p>
            <form onSubmit={handleAnswerSubmit}>
              <div>
                <input
                  type="radio"
                  id="answer1"
                  name="answer"
                  value="1"
                  checked={selectedAnswer === '1'}
                  onChange={() => handleAnswerChange('1')}
                />
                <label htmlFor="answer1">1</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="answer2"
                  name="answer"
                  value="2"
                  checked={selectedAnswer === '2'}
                  onChange={() => handleAnswerChange('2')}
                />
                <label htmlFor="answer2">2</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="answer3"
                  name="answer"
                  value="3"
                  checked={selectedAnswer === '3'}
                  onChange={() => handleAnswerChange('3')}
                />
                <label htmlFor="answer3">3</label>
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </Html>
      )}
    </>
  );
};

export default IntCube2;
