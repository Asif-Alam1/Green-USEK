import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";
import CustomCursor from "@/components/CustomCursor";

const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Green USEK",
  description: "Powered by Asif Alam & Karl Abou Jaoude",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload cursor images */}
        <link rel="preload" href="/globe.png" as="image" type="image/png" />
        <link rel="preload" href="/leaf.png" as="image" type="image/png" />
      </head>
      <body className={`${fontSans.variable} antialiased font-sans`}>
        <Providers>
          {/* Custom cursor component */}
          <CustomCursor />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}