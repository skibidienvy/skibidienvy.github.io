import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const description = 'im envy (or jamie) and people think im a catboy/transgender or sum';

export const metadata: Metadata = {
  metadataBase: new URL('https://enviouss.org'),
  title: 'enviouss.org',
  description,
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://enviouss.org',
    siteName: 'enviouss.org',
    title: 'enviouss.org',
    description,
    images: [{ url: '/icon.png', width: 736, height: 736, alt: 'envy' }],
  },
  twitter: {
    card: 'summary',
    title: 'enviouss.org',
    description,
    images: ['/icon.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
