import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: 'ShopCart',
  description: 'Your one-stop shop for everything',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-poppins antialiased">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#fff",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
};
