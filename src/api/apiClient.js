// 📂 src/api/apiClient.js

export const myFetch = async (url, options = {}) => {
  // 1. Get the language from your App's State/Storage
  const selectedLang = localStorage.getItem('user_lang') || 'en'; 

  // 2. Merge your headers with the options
  const config = {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'x-lang': selectedLang, // 🚩 Automatically added to every call!
    },
  };

  return fetch(`http://localhost:3000${url}`, config);
};