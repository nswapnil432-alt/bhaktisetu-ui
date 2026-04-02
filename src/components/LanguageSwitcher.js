// // 📂 src/components/LanguageSwitcher.js
// import { loadLanguageLabels } from '../utils/langStore';

// const LanguageSwitcher = () => {
//   const languages = [
//     { code: 'en', name: 'English', flag: '🇺🇸' },
//     { code: 'mr', name: 'मराठी', flag: '🚩' },
//     { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
//   ];

//   const handleLangChange = async (code) => {
//     localStorage.setItem('user_lang', code); // 1. Save it
//     await loadLanguageLabels(code);          // 2. Fetch new button labels
//     window.location.reload();                // 3. Refresh the UI to show changes
//   };

//   return (
//     <select 
//       onChange={(e) => handleLangChange(e.target.value)}
//       value={localStorage.getItem('user_lang') || 'en'}
//       style={{ padding: '5px', borderRadius: '5px', border: '1px solid #FF9933' }}
//     >
//       {languages.map((lang) => (
//         <option key={lang.code} value={lang.code}>
//           {lang.flag} {lang.name}
//         </option>
//       ))}
//     </select>
//   );
// };