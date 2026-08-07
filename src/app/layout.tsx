import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vuior — Pay early. Get rewarded.",
  description: "Manage all your bills, pay early, and earn rewards with Vuior.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
