import React, { useState } from 'react';
import './LockUI4.css';
import { Html } from '@react-three/drei';

const LockUI4 = ({ onUnlock, position, onClose, }) => {
  const [combination, setCombination] = useState([0, 0, 0, 0]); // Текущее состояние барабанов
  const correctCombination = [3, 5, 2, 8]; // Верный пароль

  // Обновление значения барабана
  const updateCombination = (index, delta) => {
    setCombination((prev) => {
      const newCombination = [...prev];
      newCombination[index] = ((newCombination[index] + delta + 10) % 10); // Циклическое обновление
      return newCombination;
    });
  };

  // Проверка пароля
  const handleSubmit = () => {
    if (JSON.stringify(combination) === JSON.stringify(correctCombination)) {
      onUnlock(); // Вызываем функцию разблокировки
    } else {
      setCombination([0, 0, 0, 0]); // Сбрасываем комбинацию
    }
  };

  return (
    <Html position={position}>
        <div className="lock-ui">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Кодовый замок</h2>
        <div className="lock-dials">
            {combination.map((value, index) => (
            <div key={index} className="lock-dial">
                <button onClick={() => updateCombination(index, 1)}>▲</button>
                <div className="dial-value">{value}</div>
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

export default LockUI4;
