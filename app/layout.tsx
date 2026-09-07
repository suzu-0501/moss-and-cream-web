import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://moss-and-cream-pistachio-latte.s-kousei-0805.chatgpt.site'),
  title: 'Pistachio Tiramisu Iced Latte | MOSS AND CREAM',
  description: 'ピスタチオ、エスプレッソ、ティラミスフォームが一層ずつ組み上がるシグネチャードリンク。',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Pistachio Tiramisu Iced Latte | MOSS AND CREAM',
    description: '香りと質感が一層ずつ組み上がる、インタラクティブなシグネチャードリンク。',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'MOSS AND CREAM Pistachio Tiramisu Iced Latte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pistachio Tiramisu Iced Latte | MOSS AND CREAM',
    description: '香りと質感が一層ずつ組み上がる、インタラクティブなシグネチャードリンク。',
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
