import React, { useState } from 'react';

const CalendarDay = ({ day, isOpened, onClick, isAvailable }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAvailable && !isOpened) {
      setIsAnimating(true);
      setTimeout(() => {
        onClick();
        setIsAnimating(false);
      }, 300);
    }
  };

  const getDayStyle = () => {
    let baseStyle = {
      width: '100%',
      aspectRatio: '1',
      borderRadius: '10px',
      border: 'none',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      cursor: isAvailable && !isOpened ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      background: isOpened 
        ? 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)' // Золотой для открытых
        : isAvailable 
          ? 'linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)' // Красный для доступных
          : 'linear-gradient(135deg, #666 0%, #444 100%)', // Серый для недоступных
      color: 'white',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
      opacity: isAvailable ? 1 : 0.6,
    };

    if (isAnimating) {
      baseStyle.animation = 'pulse 0.3s ease';
    }

    // Добавляем праздничные элементы
    if (isAvailable && !isOpened) {
      baseStyle.background = 'linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)';
      baseStyle.boxShadow = '0 4px 15px rgba(196, 30, 58, 0.4)';
    }

    return baseStyle;
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={getDayStyle()}
        onClick={handleClick}
        disabled={!isAvailable || isOpened}
        className={isAnimating ? 'animating' : ''}
      >
        {day}
        {isOpened && (
          <span style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            fontSize: '0.8rem',
            background: '#fff',
            color: '#c41e3a',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            ✓
          </span>
        )}
      </button>
      
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.9); }
          100% { transform: scale(0.95); }
        }
        
        button:hover:not(:disabled):not(.animating) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        button:disabled {
          cursor: default;
        }
      `}</style>
    </div>
  );
};

export default CalendarDay;