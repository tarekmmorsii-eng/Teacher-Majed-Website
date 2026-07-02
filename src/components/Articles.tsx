'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Articles() {
  const locale = useLocale() as 'ar' | 'en';
  const siteConfig = useSiteConfig();
  
  if (siteConfig?.visibility?.articles === false || !siteConfig?.articles || siteConfig.articles.length === 0) {
    return null;
  }

  return (
    <section id="articles" className="py-20 bg-background">
      <div className="container px-4 mx-auto md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-primary md:text-5xl">
            {locale === 'ar' ? 'المقالات والتدوينات' : 'Articles & Blog'}
          </h2>
          <div className="w-24 h-1 mx-auto mt-4 rounded bg-secondary"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.articles.map((article: any, index: number) => {
            const isLink = article.content?.[locale]?.startsWith('http');
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col overflow-hidden bg-white shadow-lg rounded-2xl border border-foreground/5 hover:shadow-xl transition-shadow"
              >
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4">
                    <Calendar size={16} />
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4 line-clamp-2">
                    {article.title?.[locale]}
                  </h3>
                  {!isLink && (
                    <p className="text-foreground/80 mb-6 line-clamp-4 flex-grow">
                      {article.content?.[locale]}
                    </p>
                  )}
                  {isLink && (
                    <div className="flex-grow flex items-end mb-6">
                      <a href={article.content?.[locale]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-secondary font-bold hover:underline">
                        {locale === 'ar' ? 'قراءة المقال' : 'Read Article'}
                        {locale === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
