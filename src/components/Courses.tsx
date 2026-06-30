'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Baby, Users, BookOpen, Heart } from 'lucide-react';

const iconMap: Record<string, any> = {
  Baby, Users, BookOpen, Heart
};

export default function Courses() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('Courses');
  const siteConfig = useSiteConfig();

  return (
    <section id="courses" className="py-20 bg-background">
      <div className="container px-4 mx-auto md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-primary md:text-5xl">{t('title')}</h2>
          <div className="w-24 h-1 mx-auto mt-4 rounded bg-secondary"></div>
          <p className="mt-6 text-lg text-foreground/70">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {siteConfig.courses.map((course, idx) => {
            const Icon = iconMap[course.icon];
            return (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col p-8 transition-all bg-white border shadow-lg rounded-2xl border-primary/10 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 transition-transform rounded-bl-full bg-primary/5 group-hover:scale-110" />
                
                <div className="relative z-10 flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-primary/10 text-primary">
                  {Icon && <Icon size={32} />}
                </div>
                
                <h3 className="relative z-10 mb-4 text-xl font-bold text-foreground">{course.title[locale]}</h3>
                <p className="relative z-10 leading-relaxed text-foreground/70">
                  {course.description[locale]}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
