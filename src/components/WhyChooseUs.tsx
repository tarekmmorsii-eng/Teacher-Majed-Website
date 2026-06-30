'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Clock, MessageCircle, HeartHandshake, Wallet } from 'lucide-react';

const iconMap: Record<string, any> = {
  Clock, MessageCircle, HeartHandshake, Wallet
};

export default function WhyChooseUs() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('WhyChooseUs');
  const siteConfig = useSiteConfig();

  return (
    <section className="py-20 bg-background">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {siteConfig.whyChooseUs.map((feature, idx) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? (locale === 'ar' ? 50 : -50) : (locale === 'ar' ? -50 : 50) }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-4 p-6 transition-all border shadow-sm bg-primary/5 rounded-2xl border-primary/10 hover:shadow-md hover:bg-primary/10"
              >
                <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-full bg-white text-primary">
                  {Icon && <Icon size={32} />}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title[locale]}</h3>
                  <p className="leading-relaxed text-foreground/70">{feature.description[locale]}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
