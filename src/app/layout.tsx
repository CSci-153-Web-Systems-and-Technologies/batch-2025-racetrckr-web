import type { Metadata } from "next";
import "./globals.css";
import { SessionManager } from "@/components/auth/shared/SessionManager";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "RaceTrackr",
  description: "Track your racing events and performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader
          color="#fc4c02"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #fc4c02,0 0 5px #fc4c02"
        />
        <SessionManager>
          {children}
        </SessionManager>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
