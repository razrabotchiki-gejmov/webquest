import React from 'react';
import { Html } from '@react-three/drei';
import './ClockUI.css';

const ClockUI = ({
  currentHour,
  currentMinute,
  setCurrentHour,
  setCurrentMinute,
  onApply,
  onCancel,
  position,
}) => {
  const hourStep = 360 / 24; // Угол для одного деления (часов)
  const minuteStep = 360 / 12; // Угол для одного деления (минут)
    //console.log('position in ClockUI ' + position);
  const rotateHour = (direction) => {
    setCurrentHour((prev) => (prev + direction + 24) % 24);
    console.log('currentHour ' + currentHour)
  };

  const rotateMinute = (direction) => {
    setCurrentMinute((prev) => (prev + direction + 12) % 12);
    console.log('currentMinute ' + currentMinute)
  };

  return (
    <Html position={[position]}>
        <div className="clock-ui">
            <div className="clock-face">
                <div
                className="hour-hand"
                style={{ transform: `rotate(${hourStep * currentHour}deg)` }}
                ></div>
                <div
                className="minute-hand"
                style={{ transform: `rotate(${minuteStep * currentMinute}deg)` }}
                ></div>
        </div>
        <div className="controls">
            <div>
            <button onClick={() => rotateHour(1)}>Часы +</button>
            <button onClick={() => rotateHour(-1)}>Часы -</button>
            </div>
            <div>
            <button onClick={() => rotateMinute(1)}>Минуты +</button>
            <button onClick={() => rotateMinute(-1)}>Минты -</button>
            </div>
        </div>
            <div>
                <button onClick={onApply}>Применить (Enter)</button>
                <button onClick={onCancel}>Выйти</button>
            </div>
        </div>
    </Html>
  );
};

export default ClockUI;
