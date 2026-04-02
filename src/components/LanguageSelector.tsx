// 📂 frontend/src/components/LanguageDropdown.tsx
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'mr', name: 'मराठी' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'ur', name: 'اردو' },
    { code: 'sa', name: 'संस्कृतम्' },
    { code: 'raj', name: 'मारवाड़ी' },
    { code: 'him', name: 'पहाड़ी (हिमाचली)' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code); // 🚀 This flips the UI!
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-all"
      >
        🌐 {languages.find(l => l.code === i18n.language)?.name || 'English'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;