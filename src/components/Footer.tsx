'use client';

import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Mail, Phone, Link as LinkIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);
const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const iconMap: Record<string, any> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon
};

export default function Footer() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('Footer');
  const siteConfig = useSiteConfig();

  return (
    <footer className="pt-16 pb-8 text-white bg-primary">
      <div className="container px-4 mx-auto md:px-8">
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-3">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={siteConfig.teacher.image || '/teacher-profile.png'} alt={siteConfig.teacher.name?.[locale]} className="object-cover w-10 h-10 border-2 border-white/20 rounded-full shadow-sm" />
              <span className="text-2xl font-bold">{siteConfig.teacher.name?.[locale]}</span>
            </div>
            <p className="text-white/80 max-w-sm">
              {siteConfig.teacher.title?.[locale]}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {siteConfig?.visibility?.socials !== false && siteConfig.socials.map((social: any, idx: number) => {
                const Icon = iconMap[social.platform] || iconMap[social.platform.toLowerCase()] || LinkIcon;
                return (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" title={social.platform} className="transition-colors hover:text-secondary">
                    <Icon size={24} />
                  </a>
                );
              })}
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
          <p>© {new Date().getFullYear()} {siteConfig.teacher.name?.[locale]}. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
