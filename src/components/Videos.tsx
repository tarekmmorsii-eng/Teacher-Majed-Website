'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/components/SiteConfigProvider';

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function Videos() {
  const locale = useLocale() as 'ar' | 'en';
  const siteConfig = useSiteConfig();
  
  if (siteConfig?.visibility?.videos === false || !siteConfig?.videos || siteConfig.videos.length === 0) {
    return null;
  }

  return (
    <section id="videos" className="py-20 bg-foreground/5">
      <div className="container px-4 mx-auto md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-primary md:text-5xl">
            {locale === 'ar' ? 'معرض الفيديوهات' : 'Video Gallery'}
          </h2>
          <div className="w-24 h-1 mx-auto mt-4 rounded bg-secondary"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.videos.map((video: any, index: number) => {
            const ytId = getYoutubeId(video.url);
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="overflow-hidden bg-background shadow-xl rounded-2xl group border border-foreground/10"
              >
                <div className="relative aspect-video bg-gray-100">
                  {ytId ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={video.title?.[locale]}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <span className="font-bold">{locale === 'ar' ? 'مشاهدة الفيديو' : 'Watch Video'}</span>
                    </a>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">
                    {video.title?.[locale]}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
