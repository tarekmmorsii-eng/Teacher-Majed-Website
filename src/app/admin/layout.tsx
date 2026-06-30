// src/app/admin/layout.tsx
import '../globals.css';
import { Cairo } from 'next/font/google';

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata = { title: 'لوحة التحكم | Teacher Majed' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
