import './globals.css';
import { CartProvider } from './CartContext';
export const metadata = {
  title: 'Fake Store',
  description: 'Next.js + TypeScript + Tailwind Store Example',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <main className="min-h-screen p-4">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
