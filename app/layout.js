import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import ConditionalLayout from './components/ConditionalLayout';
import { NotificationProvider } from './components/Notification';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Trading Journal - Nhật ký giao dịch chứng khoán thông minh',
  description: 'Nền tảng nhật ký giao dịch chứng khoán thông minh hàng đầu Việt Nam',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-background min-h-screen`}>
        <AuthProvider>
          <NotificationProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 