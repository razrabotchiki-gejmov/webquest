import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

// Основной компонент куба с различными типами вопросов
const InteractiveCube = ({ position, questionType }) => {
  const ref = useRef();
  const [isInteracting, setIsInteracting] = useState(false);
  const [answer, setAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const handleInteraction = () => {
    setIsInteracting(true);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleRadioAnswerChange = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleCheckboxAnswerChange = (answer) => {
    setSelectedAnswers((prevAnswers) =>
      prevAnswers.includes(answer)
        ? prevAnswers.filter((a) => a !== answer)
        : [...prevAnswers, answer]
    );
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (questionType === 'text') {
      alert(`Ваш ответ: ${answer}`);
    } else if (questionType === 'radio') {
      alert(`Ваш ответ: ${selectedAnswer}`);
    } else if (questionType === 'checkbox') {
      alert(`Ваши ответы: ${selectedAnswers.join(', ')}`);
    }
    setIsInteracting(false);
    setAnswer('');
    setSelectedAnswer(null);
    setSelectedAnswers([]);
  };

  return (
    <>
      <mesh ref={ref} position={position} castShadow onClick={handleInteraction}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {isInteracting && (
        <Html position={[position[0], position[1] + 1.5, position[2]]} center>
          <div className="interaction-window" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            {questionType === 'text' && (
              <>
                <p>1 + 1 =</p>
                <form onSubmit={handleAnswerSubmit}>
                  <input type="text" value={answer} onChange={handleAnswerChange} />
                  <button type="submit">Submit</button>
                </form>
              </>
            )}
            {questionType === 'radio' && (
              <>
                <p>1 + 1 =</p>
                <form onSubmit={handleAnswerSubmit}>
                  <div>
                    <input
                      type="radio"
                      id="answer1"
                      name="answer"
                      value="1"
                      checked={selectedAnswer === '1'}
                      onChange={() => handleRadioAnswerChange('1')}
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
                      onChange={() => handleRadioAnswerChange('2')}
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
                      onChange={() => handleRadioAnswerChange('3')}
                    />
                    <label htmlFor="answer3">3</label>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </>
            )}
            {questionType === 'checkbox' && (
              <>
                <p>Выберите правильные ответы:</p>
                <form onSubmit={handleAnswerSubmit}>
                  <div>
                    <input
                      type="checkbox"
                      id="answer1"
                      name="answer"
                      value="1"
                      checked={selectedAnswers.includes('1')}
                      onChange={() => handleCheckboxAnswerChange('1')}
                    />
                    <label htmlFor="answer1">1</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="answer2"
                      name="answer"
                      value="2"
                      checked={selectedAnswers.includes('2')}
                      onChange={() => handleCheckboxAnswerChange('2')}
                    />
                    <label htmlFor="answer2">2</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="answer3"
                      name="answer"
                      value="3"
                      checked={selectedAnswers.includes('3')}
                      onChange={() => handleCheckboxAnswerChange('3')}
                    />
                    <label htmlFor="answer3">3</label>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </>
            )}
          </div>
        </Html>
      )}
    </>
  );
};

export default InteractiveCube;
