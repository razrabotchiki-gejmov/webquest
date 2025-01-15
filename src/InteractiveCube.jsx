import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';

const InteractiveCube = ({ position }) => {
  const ref = useRef();
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customAnswer, setCustomAnswer] = useState('');

  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleInteraction = () => {
    setIsInteracting(true);
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(value)
        ? prevSelectedOptions.filter((option) => option !== value)
        : [...prevSelectedOptions, value]
    );
  };

  const handleCustomAnswerChange = (e) => {
    setCustomAnswer(e.target.value);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    alert(`Ваши ответы: ${selectedOptions.join(', ')} ${customAnswer ? `и ${customAnswer}` : ''}`);
    setIsInteracting(false);
    setSelectedOptions([]);
    setCustomAnswer('');
  };

  return (
    <>
      <mesh ref={ref} position={position} castShadow onClick={handleInteraction}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {isInteracting && (
        <Html position={[0, 2, 0]} center>
          <div className="interaction-window" style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
            <p>1 + 1 =</p>
            <form onSubmit={handleAnswerSubmit}>
              <div>
                <label>
                  <input
                    type="radio"
                    name="answerType"
                    value="predefined"
                    onChange={() => setCustomAnswer('')}
                  />
                  Выберите из списка
                </label>
              </div>
              {options.map((option, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor={`option-${index}`}>{option}</label>
                </div>
              ))}
              <div>
                <label>
                  <input
                    type="radio"
                    name="answerType"
                    value="custom"
                    onChange={() => setSelectedOptions([])}
                  />
                  Напишите свой ответ
                </label>
              </div>
              <div>
                <input
                  type="text"
                  value={customAnswer}
                  onChange={handleCustomAnswerChange}
                  placeholder="Ваш ответ"
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </Html>
      )}
    </>
  );
};

export default InteractiveCube;
