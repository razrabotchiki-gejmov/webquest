import React, { useState } from 'react';
import './LockUI3.css';
import { Html } from '@react-three/drei';

const LockUI3 = ({ onUnlock, position, onClose, }) => {
  const [combination, setCombination] = useState([1, 1, 1]); // Текущее состояние барабанов
  const correctCombination = [2, 4, 3]; // Верный пароль
  const images = [
    'images/рюкзак.png', // 1
    'images/звонок.png', // 2
    'images/книга.png',  // 3
    'images/грамота.png', // 4
    'images/шляпа.png', // 5
  ];

  const colors = ['red', 'yellow', 'blue'];

  // Обновление значения барабана
  const updateCombination = (index, delta) => {
    setCombination((prev) => {
      const newCombination = [...prev];
      newCombination[index] = ((newCombination[index] - 1 + delta + images.length) % images.length) + 1; // Циклическое обновление
      return newCombination;
    });
  };

  // Проверка пароля
  const handleSubmit = () => {
    if (JSON.stringify(combination) === JSON.stringify(correctCombination)) {
      onUnlock(); // Вызываем функцию разблокировки
    } else {
      setCombination([1, 1, 1]); // Сбрасываем комбинацию
    }
  };

  return (
    <Html position={position}>
      <div className="lock-ui">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Кодовый замок</h2>
        <div className="lock-dials">
          {combination.map((value, index) => (
            <div
              key={index}
              className="lock-dial"
              style={{ backgroundColor: colors[index] }}
            >
              <button onClick={() => updateCombination(index, 1)}>▲</button>
              <div className="dial-value">
                <img src={images[value - 1]} alt={`Option ${value}`} />
              </div>
              <button onClick={() => updateCombination(index, -1)}>▼</button>
            </div>
          ))}
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Применить
        </button>
      </div>
    </Html>
  );
};

export default LockUI3;
