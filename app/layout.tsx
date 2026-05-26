import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://uppal-harsh.vercel.app"),
  title: "Harsh Uppal | Full-Stack Developer",
  description:
    "Cinematic full-stack developer portfolio for Harsh Uppal, powered by live GitHub data and a futuristic desert interface.",
  keywords: [
    "Harsh Uppal",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "GitHub",
    "Portfolio",
    "uppal-harsh"
  ],
  authors: [{ name: "Harsh Uppal", url: "https://github.com/uppal-harsh" }],
  creator: "Harsh Uppal",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }]
  },
  openGraph: {
    title: "Harsh Uppal | Full-Stack Developer",
    description: "Rhythm in chaos. Order in flux. A cinematic technical portfolio.",
    url: "https://uppal-harsh.vercel.app",
    siteName: "Harsh Uppal Portfolio",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Uppal | Full-Stack Developer",
    description: "Cinematic full-stack developer portfolio powered by live GitHub data."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#0a0906",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
