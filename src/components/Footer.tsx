'use client';

import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

export default function Footer() {
  const t = useTranslations('Footer');
  const siteConfig = useSiteConfig();

  return (
    <footer className="pt-16 pb-8 text-white bg-primary">
      <div className="container px-4 mx-auto md:px-8">
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-3">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/teacher-profile.png" alt={siteConfig.teacher.name} className="object-cover w-10 h-10 border-2 border-white/20 rounded-full shadow-sm" />
              <span className="text-2xl font-bold">{siteConfig.teacher.name}</span>
            </div>
            <p className="text-white/80 max-w-sm">
              {siteConfig.teacher.title}
            </p>
            <div className="flex gap-4 pt-2">
              <a href={siteConfig.socials.youtube} className="transition-colors hover:text-secondary"><YoutubeIcon /></a>
              <a href={siteConfig.socials.instagram} className="transition-colors hover:text-secondary"><InstagramIcon /></a>
              <a href={siteConfig.socials.facebook} className="transition-colors hover:text-secondary"><FacebookIcon /></a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="transition-colors text-white/80 hover:text-white">About</a></li>
              <li><a href="#courses" className="transition-colors text-white/80 hover:text-white">Courses</a></li>
              <li><a href="#pricing" className="transition-colors text-white/80 hover:text-white">Pricing</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary">{t('contactUs')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/80">
                <Phone size={20} className="text-secondary" />
                <span dir="ltr">{siteConfig.teacher.whatsapp}</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Mail size={20} className="text-secondary" />
                <span>{siteConfig.teacher.email}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 text-center border-t border-white/10 text-white/60">
          <p>© {new Date().getFullYear()} {siteConfig.teacher.name}. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
