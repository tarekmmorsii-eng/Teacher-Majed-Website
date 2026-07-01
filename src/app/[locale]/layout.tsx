import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Cairo, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {getSiteData} from '@/lib/data';
import {SiteConfigProvider} from '@/components/SiteConfigProvider';
import '../globals.css';

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const siteData = getSiteData();
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';
  
  const teacherName = siteData?.teacher?.name?.[validLocale] || 'Teacher';
  
  const title = isAr 
    ? `${teacherName} | مدرس قرآن ولغة عربية عن بعد` 
    : `${teacherName} | Online Quran & Arabic Teacher`;
    
  const description = isAr 
    ? 'أتقن التجويد، الحفظ، واللغة العربية مع المعلم من راحة منزلك.' 
    : 'Master Tajweed, Memorization, and Arabic from the comfort of your home.';

  // OpenGraph requires absolute URLs for images to show up in WhatsApp/Facebook
  const siteUrl = 'https://teacher-majed.mushafalmurajaa.com';
  const imageUrl = `${siteUrl}/teacher-profile.png`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: isAr ? 'قرآن, تجويد, معلم, عربي, أونلاين' : 'Quran, Tajweed, Teacher, Arabic, Online',
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: teacherName,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: teacherName,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const siteData = getSiteData();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${inter.variable} scroll-smooth`}>
      <body className="antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <SiteConfigProvider data={siteData}>
            <Header />
            {children}
            <Footer />
          </SiteConfigProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
