import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/lib/ConfigContext";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-source-sans",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-portfolio-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Olifyhub | Portfolio & Showcase",
    template: "%s | Olifyhub",
  },
  description: "Personal Portfolio & Projects Showcase - Olifyhub",
  icons: {
    icon: [
      { url: "/img/favicon.png", type: "image/png", sizes: "180x180" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/img/favicon.png",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/img/favicon.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Olifyhub | Portfolio & Showcase",
    description: "Personal Portfolio & Projects Showcase - Olifyhub",
    siteName: "Olifyhub",
    url: SITE_URL,
    images: [
      {
        url: "/img/favicon.png",
        width: 300,
        height: 300,
        alt: "Olifyhub Logo",
        type: "image/png",
      },
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Olifyhub Portfolio Preview",
        type: "image/png",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Olifyhub | Portfolio & Showcase",
    description: "Personal Portfolio & Projects Showcase - Olifyhub",
    images: ["/img/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/img/favicon.png" />
        <link rel="shortcut icon" href="/img/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />

        {/* WhatsApp & Social Media Preview Tags (Icon on Left) */}
        <link rel="image_src" href={`${SITE_URL}/img/favicon.png`} />
        <meta property="og:image" content={`${SITE_URL}/img/favicon.png`} />
        <meta property="og:image:secure_url" content={`${SITE_URL}/img/favicon.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta property="og:image:alt" content="Olifyhub" />

        {/* Fallback & Canonical Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Olifyhub" />
        <meta property="og:title" content="Olifyhub | Portfolio & Showcase" />
        <meta property="og:description" content="Personal Portfolio & Projects Showcase - Olifyhub" />
        <meta property="og:url" content={SITE_URL} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Olifyhub | Portfolio & Showcase" />
        <meta name="twitter:description" content="Personal Portfolio & Projects Showcase - Olifyhub" />
        <meta name="twitter:image" content={`${SITE_URL}/img/favicon.png`} />
      </head>
      <body className="antialiased min-h-screen bg-slate-950 text-white selection:bg-[var(--primary-color,#99ff66)] selection:text-black">
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
