import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://moss-and-cream-pistachio-latte.s-kousei-0805.chatgpt.site'),
  title: 'MOSS AND CREAM | Coffee, Layers & Quiet Moments',
  description: '店舗とメニューを巡り、選んだ一杯ができるまでをスクロールで体験するスペシャルティコーヒーサイト。',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'MOSS AND CREAM | Coffee, Layers & Quiet Moments',
    description: 'メニューを選び、その一杯ができるまでをスクロールで体験。',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'MOSS AND CREAM Pistachio Tiramisu Iced Latte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOSS AND CREAM | Coffee, Layers & Quiet Moments',
    description: 'メニューを選び、その一杯ができるまでをスクロールで体験。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
