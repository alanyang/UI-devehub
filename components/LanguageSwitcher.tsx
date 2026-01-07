import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icons } from './Icons';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded hover:bg-slate-100">
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <Icons.ChevronDown className="w-4 h-4" />
      </button>

      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
              language.code === i18n.language ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
            }`}
          >
            <span className="text-base">{language.flag}</span>
            <span>{language.name}</span>
            {language.code === i18n.language && (
              <Icons.Check className="w-4 h-4 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
