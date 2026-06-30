'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';

export default function About() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('About');
  const siteConfig = useSiteConfig();
  const teacher = siteConfig.teacher;

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container px-4 mx-auto md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-primary md:text-5xl">{t('title')}</h2>
          <div className="w-24 h-1 mx-auto mt-4 rounded bg-secondary"></div>
        </motion.div>

        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <motion.div 
            initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 w-full lg:w-1/3"
          >
            <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-full shadow-2xl md:w-80 md:h-80 border-4 border-secondary/20">
              <img src="/teacher-profile.png" alt={teacher.name} className="object-cover w-full h-full" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: locale === 'ar' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full space-y-6 text-lg text-foreground/80 lg:w-2/3"
          >
            <p className="leading-relaxed">
              {teacher.biography[locale]}
            </p>
            <p className="leading-relaxed">
              {teacher.teachingPhilosophy[locale]}
            </p>
            
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-bold text-primary">{t('qualifications')}</h3>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {teacher.qualifications[locale].map((qual, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-secondary">✦</span>
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
