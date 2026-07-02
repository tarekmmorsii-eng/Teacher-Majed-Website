'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('FAQ');
  const siteConfig = useSiteConfig();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-primary/5">
      <div className="container max-w-4xl px-4 mx-auto md:px-8">
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

        <div className="space-y-4">
          {siteConfig.faqs.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="overflow-hidden bg-white border rounded-xl border-primary/10"
              >
                <button 
                  onClick={() => toggle(idx)}
                  className="flex items-center justify-between w-full p-6 text-left transition-colors hover:bg-primary/5"
                >
                  <span className="text-lg font-semibold text-foreground">{faq.q?.[locale]}</span>
                  <ChevronDown className={`transition-transform duration-300 text-primary ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 leading-relaxed text-foreground/70 border-t border-primary/5">
                        {faq.a?.[locale]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
