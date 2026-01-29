import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A Love Story Made Just For You ❤️',
  description: 'A romantic scrollytelling experience crafted with love',
  keywords: ['love', 'romance', 'gift', 'special', 'scrollytelling'],
  authors: [{ name: 'With Love' }],
  openGraph: {
    title: 'A Love Story Made Just For You ❤️',
    description: 'A romantic scrollytelling experience crafted with love',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#2d1b4e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
