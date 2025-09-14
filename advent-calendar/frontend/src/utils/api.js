// frontend/src/utils/api.js
const API_BASE = '/api';

console.log('API base:', API_BASE);

export const api = {
  // Пользовательские методы
  getUser: async (telegramId) => {
    console.log('API: Getting user', telegramId);
    const response = await fetch(`${API_BASE}/users/${telegramId}`);
    if (!response.ok) {
      console.error('API: User not found', response.status);
      throw new Error('User not found');
    }
    const data = await response.json();
    console.log('API: User data received', data);
    return data;
  },

  createUser: async (userData) => {
    console.log('API: Creating user', userData);
    const response = await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log('API: User created/retrieved', data);
    return data;
  },

  // Методы календаря
  getDoors: async () => {
    console.log('API: Getting doors');
    const response = await fetch(`${API_BASE}/doors/`);
    const data = await response.json();
    console.log('API: Doors received', data);
    return data;
  },

  openDoor: async (telegramId, day) => {
    console.log('API: Opening door', { telegramId, day });
    const response = await fetch(`${API_BASE}/users/${telegramId}/open/${day}`, {
      method: 'POST',
    });
    return response.json();
  },

  getDoorContent: async (day, telegramId) => {
    console.log('API: Getting door content', { day, telegramId });
    const response = await fetch(`${API_BASE}/doors/${day}?telegram_id=${telegramId}`);
    return response.json();
  }
};