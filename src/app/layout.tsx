import type { Metadata } from "next";
import "./globals.css";
import AuthStatus from "@/components/auth/AuthStatus";

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
        {children}
        <AuthStatus />
      </body>
    </html>
  );
}
