import "../globals.css";
import { Toaster } from "react-hot-toast";
import { siteConfig } from "@/constants/data";

export const metadata = {
  title: `Sanity Studio for ${siteConfig.name}`,
  description: `Content Management for ${siteConfig.seo.title}`,

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