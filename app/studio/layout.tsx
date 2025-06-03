import "../globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: 'Sanity Studio',
  description: 'Content Management for ShopCart',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
  );
} 