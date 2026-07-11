import type { Metadata, Viewport } from "next";
// @ts-ignore: CSS module declarations are handled by Next.js
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Evenly",
    template: "%s | Evenly",
  },
  applicationName: "Evenly",
  description:
    "Prepare personal expenses and shared financial commitments whenever money comes in.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#172d26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}