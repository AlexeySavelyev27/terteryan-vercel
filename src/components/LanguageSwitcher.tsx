"use client"

import { Globe, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === locale)

  const handleLanguageChange = (langCode: 'ru' | 'en') => {
    setLocale(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full unified-button-bg transition-all duration-300 hover:shadow-lg text-sm cursor-pointer"
        style={{ minWidth: '140px', justifyContent: 'space-between' }}
      >
        <Globe size={16} className="group-hover:opacity-80 transition-opacity" />
        <span className="group-hover:opacity-80 transition-opacity">{currentLanguage?.flag} {currentLanguage?.name}</span>
        <ChevronDown
          size={14}
          className={`transition-all group-hover:opacity-80 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div
            className="absolute top-full left-0 mt-2 rounded-lg shadow-lg z-50 min-w-full unified-button-bg"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code as 'ru' | 'en')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-current/10 first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                  locale === language.code ? 'bg-current/5' : ''
                }`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {locale === language.code && (
                  <span className="ml-auto text-xs opacity-60">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
