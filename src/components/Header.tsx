'use client';

import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useSiteConfig } from '@/components/SiteConfigProvider';

export default function Header() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('Header');
  const siteConfig = useSiteConfig();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto md:px-8">
        <div className="flex items-center gap-2">
          <img src="/teacher-profile.png" alt={siteConfig.teacher.name?.[locale]} className="object-cover w-10 h-10 border-2 rounded-full border-primary/20 shadow-sm" />
          <span className="font-bold text-foreground">{siteConfig.teacher.name?.[locale]}</span>
        </div>
        
        <nav className="hidden gap-6 md:flex text-foreground/80">
          <a href="#about" className="transition-colors hover:text-primary">{t('about')}</a>
          <a href="#courses" className="transition-colors hover:text-primary">{t('courses')}</a>
          <a href="#pricing" className="transition-colors hover:text-primary">{t('pricing')}</a>
          <a href="#contact" className="transition-colors hover:text-primary">{t('contact')}</a>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
