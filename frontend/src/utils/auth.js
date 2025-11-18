const TOKEN_KEY = 'auth_token';

const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export const getToken = () => {
  return safeLocalStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  safeLocalStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  safeLocalStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

