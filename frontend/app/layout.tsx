"use client";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const myFont = localFont({
  src: './fonts/Gilroy-Medium.ttf',
  display: 'swap',
  variable: '--font-gilroy',
});
const myFont1 = localFont({
  src: './fonts/Gilroy-BoldItalic.ttf',
  display: 'swap',
  variable: '--font-gilroyBold',
});
const myFont2 = localFont({
  src: './fonts/Gilroy-Light.ttf',
  display: 'swap',
  variable: '--font-gilroyLight',
});
const myfont3 = localFont({
  src: './fonts/MartianMono-VariableFont_wdth,wght.ttf',
  display: 'swap',
  variable: '--font-martianmono',
});
const myfont4 = localFont({
  src: './fonts/BricolageGrotesque-VariableFont_opsz.ttf',
  display: 'swap',
  variable: '--font-BricolageGrotesque',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${myFont.variable} ${myFont1.variable} ${myFont2.variable} ${myfont3.variable} ${myfont4.variable}`}
      >
      <SessionProvider>
        {children}
      </SessionProvider>
      </body>
    </html>
  );
}
