import "./globals.css";
import { Montserrat } from "next/font/google";
import { EthereumProvider } from "./(providers)/EthereumProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://degeneratives.art"),
  title: "Degenerative Art",
  description: "Mint generative art based on your $MOOD",
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
