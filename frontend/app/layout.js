import "./globals.css";
import { Montserrat } from "next/font/google";
import { EthereumProvider } from "./(providers)/EthereumProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Degenerative Art",
  description: "emoji-to-generative-art",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <EthereumProvider>{children}</EthereumProvider>
      </body>
    </html>
  );
}
