'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { Target, User, Users, Globe, Book, Brain } from 'lucide-react';

const iconMap: Record<string, any> = {
  Target, User, Users, Globe, Book, Brain
};

export default function TrustBadges() {
  const locale = useLocale() as 'ar' | 'en';
  const siteConfig = useSiteConfig();

  return (
    <section className="py-12 border-t border-b bg-primary/5 border-primary/10">
      <div className="container px-4 mx-auto md:px-8">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
          {siteConfig.trustBadges.map((badge: any, idx: number) => {
            const Icon = iconMap[badge.icon];
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-center gap-3 p-4 transition-all shadow-sm rounded-xl bg-background hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  {Icon && <Icon size={24} />}
                </div>
                <span className="font-semibold text-foreground/80">{badge[locale]}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
