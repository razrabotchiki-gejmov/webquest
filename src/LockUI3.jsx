import React, { useState } from 'react';
import './LockUI3.css';
import { Html } from '@react-three/drei';

const LockUI3 = ({ onUnlock, position, onClose, }) => {
  const [combination, setCombination] = useState([1, 1, 1]); // Текущее состояние барабанов
  const correctCombination = [3, 2, 5]; // Верный пароль

  // Обновление значения барабана
  const updateCombination = (index, delta) => {
    setCombination((prev) => {
      const newCombination = [...prev];
      newCombination[index] = ((newCombination[index] - 1 + delta + 5) % 5) + 1; // Циклическое обновление
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

export default LockUI3;
