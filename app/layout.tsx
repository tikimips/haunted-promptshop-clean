import './globals.css';
import AuthButtons from '@/components/AuthButtons';

export const metadata = {
  title: 'Promptshop',
  description: 'Inspiration & prompt library'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="text-lg font-semibold">Promptshop</div>
            <AuthButtons />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
