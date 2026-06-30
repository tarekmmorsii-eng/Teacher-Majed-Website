'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('Testimonials');
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.testimonials.map((testimonial, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-8 bg-white border shadow-sm rounded-2xl border-primary/10"
            >
              <Quote className="absolute top-6 right-6 text-primary/10" size={48} />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-secondary fill-secondary" size={20} />
                ))}
              </div>
              
              <p className="mb-6 leading-relaxed text-foreground/80">"{testimonial.content[locale]}"</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 font-bold text-white rounded-full bg-primary">
                  {testimonial.name[locale].charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name[locale]}</h4>
                  <p className="text-sm text-foreground/60">{testimonial.role[locale]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
