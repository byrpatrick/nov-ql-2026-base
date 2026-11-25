import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Selector de ganadores",
  description: "Sortea aleatoriamente un ganador entre los participantes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
