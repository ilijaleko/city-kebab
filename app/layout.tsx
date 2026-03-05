import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "City Kebab",
  description: "City Kebab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
