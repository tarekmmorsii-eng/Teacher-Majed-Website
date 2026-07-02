'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Check } from 'lucide-react';

export default function Pricing() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('Pricing');
  const siteConfig = useSiteConfig();

  // Helper translations for plan names inside component based on ID
  const planNames: Record<string, {en: string, ar: string}> = {
    basic: { en: "Basic Plan", ar: "الخطة الأساسية" },
    standard: { en: "Standard Plan", ar: "الخطة القياسية" },
    premium: { en: "Premium Plan", ar: "الخطة المميزة" }
  };

  return (
    <section id="pricing" className="py-20 bg-primary/5">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {siteConfig.pricing.map((plan: any, idx: number) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col p-8 bg-white border rounded-2xl shadow-lg ${plan.recommended ? 'border-primary ring-2 ring-primary scale-105 z-10' : 'border-primary/10'}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 px-4 py-1 text-sm font-bold text-white transform -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 bg-secondary">
                  {locale === 'ar' ? 'الأكثر اختياراً' : 'Recommended'}
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-center text-foreground">{planNames[plan.id?.toLowerCase()]?.[locale] || plan.id}</h3>
              <div className="flex items-end justify-center gap-1 mt-6 mb-8">
                <span className="text-5xl font-extrabold text-primary">${plan.price}</span>
                <span className="mb-2 text-foreground/60">{t('perMonth')}</span>
              </div>

              <ul className="flex flex-col gap-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-foreground/80">
                  <Check className="text-secondary" size={20} />
                  <span>{plan.lessonsPerWeek} {locale === 'ar' ? 'حصص في الأسبوع' : 'Lessons per week'}</span>
                </li>
                <li className="flex items-center gap-3 text-foreground/80">
                  <Check className="text-secondary" size={20} />
                  <span>{locale === 'ar' ? 'مكالمات فيديو مباشرة' : 'Live video calls'}</span>
                </li>
                <li className="flex items-center gap-3 text-foreground/80">
                  <Check className="text-secondary" size={20} />
                  <span>{locale === 'ar' ? 'تقارير أداء' : 'Performance reports'}</span>
                </li>
              </ul>

              <a 
                href="#contact" 
                className={`w-full py-4 text-center font-bold transition-colors rounded-xl ${plan.recommended ? 'bg-primary text-white hover:bg-primary-light' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              >
                {t('book')}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
