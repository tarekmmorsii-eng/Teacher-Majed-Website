'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSiteConfig } from '@/components/SiteConfigProvider';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactForm() {
  const t = useTranslations('Contact');
  const siteConfig = useSiteConfig();
  
  const [formData, setFormData] = useState({
    name: '',
    childName: '',
    email: '',
    whatsapp: '',
    country: '',
    age: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Save to Firebase Database
      await addDoc(collection(db, 'requests'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new' // for admin tracking
      });

      // 2. Format message for WhatsApp
      let text = `مرحباً، أود حجز حصة تجريبية.\n\n`;
      text += `*الاسم:* ${formData.name}\n`;
      if (formData.childName) text += `*اسم الطالب:* ${formData.childName}\n`;
      text += `*البريد الإلكتروني:* ${formData.email}\n`;
      text += `*رقم الواتساب:* ${formData.whatsapp}\n`;
      text += `*البلد:* ${formData.country}\n`;
      text += `*العمر:* ${formData.age}\n`;
      if (formData.message) text += `\n*رسالة إضافية:*\n${formData.message}\n`;

      const encodedMessage = encodeURIComponent(text);
      const whatsappNumber = siteConfig.teacher.whatsapp.replace(/[^0-9]/g, '');
      
      setSubmitSuccess(true);
      setFormData({ name: '', childName: '', email: '', whatsapp: '', country: '', age: '', message: '' });
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error saving request: ", error);
      alert('عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
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
          className="p-8 bg-foreground/5 border shadow-xl rounded-3xl border-foreground/10"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('name')} *</label>
              <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-3 transition-colors border bg-background text-foreground rounded-xl border-foreground/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('childName')}</label>
              <input name="childName" value={formData.childName} onChange={handleChange} type="text" className="w-full p-3 transition-colors border bg-background text-foreground rounded-xl border-foreground/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('email')} *</label>
              <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full p-3 transition-colors border bg-background text-foreground rounded-xl border-foreground/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('whatsapp')} *</label>
              <input required name="whatsapp" value={formData.whatsapp} onChange={handleChange} type="tel" className="w-full p-3 transition-colors border bg-background text-foreground rounded-xl border-foreground/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('country')} *</label>
              <input required name="country" value={formData.country} onChange={handleChange} type="text" className="w-full p-3 transition-colors border bg-background text-foreground rounded-xl border-foreground/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">{t('age')} *</label>
              <input required name="age" value={formData.age} onChange={handleChange} type="number" min="4" max="100" className="w-full p-3 transition-colors border bg-background text-foreground rounded-xl border-foreground/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" dir="ltr" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-foreground/80">{t('message')}</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full p-3 transition-colors border bg-background text-foreground rounded-xl border-foreground/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 mt-8 text-lg font-bold text-white transition-all rounded-xl bg-primary hover:bg-primary-light hover:shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                جاري المعالجة...
              </>
            ) : t('submit')}
          </button>
          
          {submitSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mt-4 text-center text-green-800 bg-green-100 rounded-xl"
            >
              تم إرسال طلبك بنجاح! سيتم تحويلك للواتساب الآن.
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
