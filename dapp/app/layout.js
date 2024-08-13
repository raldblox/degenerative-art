import "./globals.css";
import { Providers } from "./providers/Providers";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://degeneratives.art"),
  title: "Degenerative Art",
  description: "Generative Art",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <main className="text-black bg-white">{children}</main>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
