import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/liquid-toast.css";
import { Providers } from "@/components/providers/providers";
import { Navbar } from "@/components/navbar";
import { ErrorBoundary } from "@/components/error-boundary";
import { BackgroundVeil } from "@/components/background-veil";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nuro fi ",
  description: "Nuro fi ",
  icons: {
    icon: "/nuro.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <BackgroundVeil />
        <div className="relative min-h-screen">
          <Providers>
            <Navbar />
            <ErrorBoundary>
              <main className="relative z-10">{children}</main>
            </ErrorBoundary>
          </Providers>
          <Toaster position="bottom-right" richColors />
        </div>
      </body>
    </html>
  );
}
