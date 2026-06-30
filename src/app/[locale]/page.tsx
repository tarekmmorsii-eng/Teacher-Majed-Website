import {setRequestLocale} from 'next-intl/server';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import About from '@/components/About';
import Courses from '@/components/Courses';
import TeachingMethod from '@/components/TeachingMethod';

import WhyChooseUs from '@/components/WhyChooseUs';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <TrustBadges />
      <About />
      <Courses />
      <TeachingMethod />
      <WhyChooseUs />
      <Pricing />
      <Testimonials />
      <FAQ />
      <ContactForm />
    </main>
  );
}
