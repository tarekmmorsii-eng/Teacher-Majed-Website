'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLanguage() {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button 
      onClick={toggleLanguage} 
      className="px-4 py-2 text-sm font-medium transition-colors border rounded-md border-primary/20 text-primary hover:bg-primary/10"
      aria-label="Switch Language"
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
