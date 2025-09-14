// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';

function App() {
  const [telegramData, setTelegramData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App mounted');
    
    const initTelegramWebApp = () => {
      console.log('Initializing app...');
      
      // Всегда используем mock данные для тестирования
      console.log('Using mock data');
      setTelegramData({
        id: "123456789",
        username: "test_user"
      });
      
      setLoading(false);
    };

    setTimeout(initTelegramWebApp, 500);
  }, []);

  console.log('Render state:', { telegramData, loading });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '1.2rem',
        backgroundColor: '#007a3d'
      }}>
        Загрузка... 🎅
      </div>
    );
  }

  if (!telegramData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '1.2rem',
        backgroundColor: '#007a3d'
      }}>
        Данные не загружены
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#007a3d' }}>
      <AdventCalendar 
        telegramId={telegramData.id} 
        username={telegramData.username}
      />
    </div>);
}

export default App;