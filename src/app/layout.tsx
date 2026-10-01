import type { Metadata } from 'next';
import { Fredoka, Plus_Jakarta_Sans } from 'next/font/google';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import './globals.css';

const display = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fredoka' });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'CanvasLab',
  description: 'Aprende a construir tu Business Model Canvas jugando.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh font-sans text-ink antialiased">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
