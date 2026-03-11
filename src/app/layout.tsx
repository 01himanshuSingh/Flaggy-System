import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "sonner";
import ReduxProvider from "./store/StoreProvider";
import { Roboto } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
})


export const metadata: Metadata = {
  title: "Flaggy",
  description: "Flaggy - provide signals for your app with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
      >

            {/* <ProjectProvider> */}

       <Providers>
        <ReduxProvider>
        {children}

        <Toaster richColors position="top-center" />
        </ReduxProvider>
        </Providers> 
            {/* </ProjectProvider> */}
      </body>
    </html>
  );
}
