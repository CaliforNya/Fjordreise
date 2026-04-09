import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "@/assets/styles/globals.css";
import { Footer } from "@/components/layout/footer/footer";
import { Header } from "@/components/layout/header/header";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Fjordreise App",
  description: "Plan and browse fjord routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} w-full`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
