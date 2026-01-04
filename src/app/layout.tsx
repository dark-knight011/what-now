import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What Now - ADHD Decision Killer",
  description: "A decision-killer PWA for ADHD brains. You dump. The app decides. You move.",
  manifest: "/manifest.json",
  themeColor: "#6b46ff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "What Now",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Material Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

