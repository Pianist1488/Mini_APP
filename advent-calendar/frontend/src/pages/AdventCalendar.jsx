// frontend/src/pages/AdventCalendar.jsx
import React, { useState, useEffect } from 'react';
import CalendarDay from '../components/CalendarDay';
import { api } from '../utils/api';

const AdventCalendar = ({ telegramId, username }) => {
  const [user, setUser] = useState(null);
  const [doors, setDoors] = useState([]);
  const [openedDoors, setOpenedDoors] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [error, setError] = useState(null);

  console.log('AdventCalendar props:', { telegramId, username });

  useEffect(() => {
    const initializeCalendar = async () => {
      console.log('Initializing calendar for user:', telegramId);
      
      if (!telegramId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        // Создаем или получаем пользователя
        console.log('Creating/getting user...');
        const userData = await api.createUser({
          telegram_id: telegramId,
          username: username
        });
        console.log('User data received:', userData);
        setUser(userData);

        // Получаем все двери
        console.log('Fetching doors...');
        const doorsData = await api.getDoors();
        console.log('Doors received:', doorsData);
        setDoors(doorsData);

      } catch (error) {
        console.error('Error initializing calendar:', error);
        setError(`Ошибка загрузки календаря: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (telegramId) {
      initializeCalendar();
    }
  }, [telegramId, username]);

  const isDoorAvailable = (day) => {
    // Проверяем, можно ли открыть дверь (по дате)
    const today = new Date();
    const currentYear = today.getFullYear();
    const doorDate = new Date(currentYear, 11, day); // 11 = декабрь (0-indexed)
    
    // Календарь активен с 1 по 24 декабря
    const calendarStart = new Date(currentYear, 11, 1);
    const calendarEnd = new Date(currentYear, 11, 24);
    
    return doorDate >= calendarStart && doorDate <= today && doorDate <= calendarEnd;
  };

  const handleOpenDoor = async (day) => {
    try {
      console.log('Opening door:', day);
      
      // Открываем дверь на бэкенде
      await api.openDoor(telegramId, day);
      
      // Обновляем данные пользователя (баллы)
      const updatedUser = await api.getUser(telegramId);
      console.log('Updated user data:', updatedUser);
      setUser(updatedUser);
      
      // Добавляем дверь в список открытых
      setOpenedDoors(prev => new Set([...prev, day]));
      
      // Получаем содержимое двери
      const content = await api.getDoorContent(day, telegramId);
      console.log('Door content:', content);
      setModalContent(content);
      setShowModal(true);
      
    } catch (error) {
      console.error('Error opening door:', error);
      alert('Не удалось открыть дверь. Возможно, она уже открыта или еще не наступила ее дата.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const renderModal = () => {
    if (!showModal || !modalContent) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }} onClick={closeModal}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          position: 'relative',
        }} onClick={e => e.stopPropagation()}>
          <button 
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
          
          <h2 style={{ color: '#c41e3a', marginBottom: '20px' }}>
            🎁 День {modalContent.day}
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            {modalContent.content_type === 'image' && (
              <img 
                src={modalContent.content} 
                alt={`Подарок дня ${modalContent.day}`}
                style={{ maxWidth: '100%', borderRadius: '10px' }}
              />
            )}
            
            {modalContent.content_type === 'text' && (
              <p style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
                {modalContent.content}
              </p>
            )}
            
            {modalContent.content_type === 'link' && (
              <div>
                <p style={{ marginBottom: '15px' }}>Специальная ссылка для вас:</p>
                <a 
                  href={modalContent.content} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#c41e3a',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                >
                  Открыть подарок →
                </a>
              </div>
            )}
            
            {modalContent.content_type === 'video' && (
              <div>
                <p style={{ marginBottom: '15px' }}>Видео-подарок:</p>
                <a 
                  href={modalContent.content} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#c41e3a',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Смотреть видео →
                </a>
              </div>
            )}
          </div>
          
          <div style={{
            backgroundColor: '#ffd700',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: 'bold',
            color: '#8b0000'
          }}>
            +{modalContent.points} баллов начислено!
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Загрузка календаря... 🎄
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎄 Новогодний Адвент-Календарь</h1>
        <p>Открывай подарки каждый день до Нового Года!</p>
      </div>

      {user && (
        <div className="user-info">
          <div>
            <strong>Пользователь:</strong> {username || `ID: ${telegramId}`}
          </div>
          <div className="points-display">
            🎁 Баллы: {user.points}
          </div>
        </div>
      )}

      <div className="calendar-grid">
        {Array.from({ length: 24 }, (_, i) => i + 1).map(day => (
          <CalendarDay
            key={day}
            day={day}
            isOpened={openedDoors.has(day)}
            isAvailable={isDoorAvailable(day)}
            onClick={() => handleOpenDoor(day)}
          />
        ))}
      </div>

      {renderModal()}
    </div>
  );
};

export default AdventCalendar;