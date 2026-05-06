import type { Metadata } from 'next';
import './globals.css';
import NavWrapper from '@/components/NavWrapper';

export const metadata: Metadata = {
  title: 'Art Edu KMS DZ — منصة الفنون البصرية',
  description: 'منصة تعليمية متخصصة في الفنون البصرية للمرحلة المتوسطة في الجزائر',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <NavWrapper />
        {children}
      </body>
    </html>
  );
}