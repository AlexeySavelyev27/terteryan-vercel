"use client"

import { Globe } from 'lucide-react'
import { useLocale } from '../contexts/LocaleContext'

export default function MobileLanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  const languages = {
    ru: { name: 'Русский', flag: '🇷🇺' },
    en: { name: 'English', flag: '🇺🇸' }
  }

  const currentLanguage = languages[locale]
  const nextLanguage = languages[locale === 'ru' ? 'en' : 'ru']

  const handleToggleLanguage = () => {
    const newLocale = locale === 'ru' ? 'en' : 'ru'
    setLocale(newLocale)
  }

  return (
    <button
      onClick={handleToggleLanguage}
      className="flex items-center gap-2 text-sm cursor-pointer transition-opacity duration-300"
      style={{ minWidth: '120px', justifyContent: 'flex-start' }}
    >
      <span className="transition-opacity hover:opacity-80">
        {currentLanguage.flag} {currentLanguage.name}
      </span>
    </button>
  )
}
