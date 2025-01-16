import React, { useState } from 'react';
import ClockUI from './ClockUI';

const ClockInteraction = ({ correctHour = 8.5, onSuccess, position, onClose }) => {
  const [currentHour, setCurrentHour] = useState(0); // Часовая стрелка
  const [currentMinute, setCurrentMinute] = useState(0); // Минутная стрелка
  const handleApply = () => {
    const correctMinute = 6;
    const correctHourBase = 17;
    console.log('correct Minute ' + correctMinute)
    console.log('correctHour ' + correctHourBase)
    if (
      currentHour === correctHourBase &&
      currentMinute === correctMinute
    ) {
      onSuccess();
      onClose();
    } else {
      setCurrentHour(0);
      setCurrentMinute(0);
    }
  };
  //console.log('clock position in ClockInteraction ' + position)
  return (
    <>
        <ClockUI
          currentHour={currentHour}
          currentMinute={currentMinute}
          setCurrentHour={setCurrentHour}
          setCurrentMinute={setCurrentMinute}
          onApply={handleApply}
          onCancel={() => onClose()}
          position={position}
        />
    </>
  );
};

export default ClockInteraction;
