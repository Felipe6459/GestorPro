import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GestorPro 2.0',
  description: 'Plataforma SaaS de gestão',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
