import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ToastProvider from '@/components/providers/ToasterProvider';
import { ConfettiProvider } from '@/components/providers/ConfettiProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Learning Management System',
  description: 'Educate yourself with our courses',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl='/'>
      <html lang='en'>
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
