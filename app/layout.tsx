import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Art Edu DZ — منصة تعليم الفنون البصرية',
    template: '%s | Art Edu DZ',
  },
  description: 'منصة تعليمية متخصصة في الفنون البصرية للمرحلة المتوسطة في الجزائر',
  keywords: ['فنون', 'تعليم', 'جزائر', 'رسم', 'تربية فنية'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}