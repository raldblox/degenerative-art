import { Montserrat } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Degenerative Art",
  description: "emoji-to-generative-art",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
