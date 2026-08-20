import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import StoreHydration from '@/components/StoreHydration';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LC Company Questions',
  description: 'A checklist for questions asked by various companies.',
};

export const viewport: Viewport = {
  themeColor: '#0e0e0f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <StoreHydration />
        <div className="mx-auto min-h-dvh w-full max-w-xl px-4 pb-16 pt-5 lg:max-w-[1500px] lg:px-8 lg:pb-0 lg:pt-0">
          {children}
        </div>
      </body>
    </html>
  );
}
