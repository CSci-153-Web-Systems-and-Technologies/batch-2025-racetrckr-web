import type { Metadata } from "next";
import "./globals.css";
import { SessionManager } from "@/components/auth/shared/SessionManager";
import { Toaster } from "sonner";

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
        <SessionManager>
          {children}
        </SessionManager>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
