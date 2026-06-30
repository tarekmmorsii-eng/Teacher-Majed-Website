'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';

export default function Hero() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('Hero');
  const siteConfig = useSiteConfig();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          {t('title').split(' ').map((word, i) => (
            <span key={i} className={i % 2 === 0 ? 'text-primary' : ''}>{word} </span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-xl leading-relaxed text-foreground/80 md:text-2xl"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-4 mt-10 sm:flex-row"
        >
          <a 
            href="#contact"
            className="px-8 py-4 text-lg font-semibold text-white transition-all rounded-full shadow-lg bg-primary hover:bg-primary-light hover:-translate-y-1 hover:shadow-xl"
          >
            {t('bookTrial')}
          </a>
          <a 
            href="#contact"
            className="px-8 py-4 text-lg font-semibold transition-all border-2 rounded-full shadow-sm text-foreground border-primary/20 hover:border-primary hover:bg-primary/5 hover:-translate-y-1"
          >
            {t('whatsapp')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
