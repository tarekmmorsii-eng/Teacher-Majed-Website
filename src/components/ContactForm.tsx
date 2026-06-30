'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const t = useTranslations('Contact');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this will connect to Email/WhatsApp/CRM/API
    alert('Form submitted! (This is a placeholder action)');
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container max-w-4xl px-4 mx-auto md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-primary md:text-5xl">{t('title')}</h2>
          <div className="w-24 h-1 mx-auto mt-4 rounded bg-secondary"></div>
          <p className="mt-6 text-lg text-foreground/70">{t('subtitle')}</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="p-8 bg-white border shadow-xl rounded-3xl border-primary/10"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('name')} *</label>
              <input required type="text" className="w-full p-3 transition-colors border rounded-xl border-primary/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('childName')}</label>
              <input type="text" className="w-full p-3 transition-colors border rounded-xl border-primary/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('email')} *</label>
              <input required type="email" className="w-full p-3 transition-colors border rounded-xl border-primary/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('whatsapp')} *</label>
              <input required type="tel" className="w-full p-3 transition-colors border rounded-xl border-primary/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('country')} *</label>
              <input required type="text" className="w-full p-3 transition-colors border rounded-xl border-primary/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('age')} *</label>
              <input required type="number" min="4" max="100" className="w-full p-3 transition-colors border rounded-xl border-primary/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-foreground/80">{t('message')}</label>
              <textarea rows={4} className="w-full p-3 transition-colors border rounded-xl border-primary/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 mt-8 text-lg font-bold text-white transition-all rounded-xl bg-primary hover:bg-primary-light hover:shadow-lg hover:-translate-y-1"
          >
            {t('submit')}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
