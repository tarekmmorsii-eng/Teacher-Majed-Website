'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { ClipboardList, Map, Video, BookOpen, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';

const iconMap: Record<string, any> = {
  ClipboardList, Map, Video, BookOpen, TrendingUp
};

export default function TeachingMethod() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('Method');
  const isRtl = locale === 'ar';
  const siteConfig = useSiteConfig();

  return (
    <section className="py-20 bg-primary/5">
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

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-2 lg:gap-4">
          {siteConfig.teachingMethod.map((step, idx) => {
            const Icon = iconMap[step.icon];
            const isLast = idx === siteConfig.teachingMethod.length - 1;

            return (
              <div key={idx} className="flex flex-col items-center md:flex-row">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex flex-col items-center max-w-[140px] text-center"
                >
                  <div className="flex items-center justify-center w-20 h-20 mb-4 transition-transform shadow-lg rounded-2xl bg-white text-primary hover:scale-105 border border-primary/10">
                    {Icon && <Icon size={32} />}
                  </div>
                  <h4 className="font-bold text-foreground">{step[locale]}</h4>
                </motion.div>
                
                {!isLast && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 + 0.2 }}
                    className="flex justify-center w-8 h-8 my-4 text-secondary md:w-16 md:h-16 md:my-0 md:-mt-8"
                  >
                    <div className="hidden md:block">
                      {isRtl ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                    </div>
                    {/* Down arrow for mobile */}
                    <div className="block md:hidden">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
