import { Providers } from "@/providers/Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import Navigation from "@/components/sections/Navigation";
import { Footer } from "@/components/sections/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://degeneratives.art"),
  title: "Degenerative Art",
  description: "Mint generative art based on your $MOOD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Suspense>
            <Navigation />
            {children}
            <Footer />
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
