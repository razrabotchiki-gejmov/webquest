import React, { useState } from 'react';
import './CallingQuestion.css';


const CallingQuestion = ({ questionType, isActive, setIsActive }) => {
  const [answer, setAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const handleInteraction = () => {
    setIsActive(false);
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
    handleInteraction();
    setAnswer('');
    setSelectedAnswer(null);
    setSelectedAnswers([]);
  };

  if (!isActive) return null;

  return (
    <div className="interaction-window" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      {questionType === 'text' && (
        <form onSubmit={handleAnswerSubmit}>
          <p>1 + 1 =</p>
          <input type="text" value={answer} onChange={handleAnswerChange} />
          <button type="submit">Submit</button>
        </form>
      )}
      {questionType === 'radio' && (
        <form onSubmit={handleAnswerSubmit}>
          <p>1 + 1 =</p>
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
      )}
      {questionType === 'checkbox' && (
        <form onSubmit={handleAnswerSubmit}>
          <p>Выберите правильный ответ:</p>
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
      )}
    </div>
  );
};

export default CallingQuestion;
