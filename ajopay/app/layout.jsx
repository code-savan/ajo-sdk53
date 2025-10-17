import { Inter, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ajo – Save, grow, and manage group funds",
  description: "Ajo helps groups save together, fund wallets securely, and manage payouts with ease.",
  keywords: [
    "group savings",
    "collective funding",
    "financial management",
    "group finance",
    "savings circle",
    "money pooling",
    "group investment",
    "financial collaboration",
    "secure payments",
    "fund management"
  ],
  authors: [{ name: "Ajo Team" }],
  creator: "Ajo",
  publisher: "Ajo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ajopay.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ajo – Save, grow, and manage group funds",
    description: "Ajo helps groups save together, fund wallets securely, and manage payouts with ease.",
    url: "https://ajopay.com",
    siteName: "Ajo",
    images: [
      {
        url: "/frame.png",
        width: 1200,
        height: 630,
        alt: "Ajo - Group savings and fund management platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajo – Save, grow, and manage group funds",
    description: "Ajo helps groups save together, fund wallets securely, and manage payouts with ease.",
    images: ["/frame.png"],
    creator: "@ajopay",
    site: "@ajopay",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/appicon.png",
    shortcut: "/appicon.png",
    apple: "/appicon.png",
  },
  manifest: "/site.webmanifest",
  category: "finance",
  classification: "Financial Services",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  appleWebApp: {
    title: "Ajo",
    statusBarStyle: "default",
    capable: true,
  },
  applicationName: "Ajo",
  generator: "Next.js",
  abstract: "Secure group savings and fund management platform for collaborative financial growth",
  archives: [],
  assets: [],
  bookmarks: [],
  other: {
    "msapplication-TileColor": "#2d89ef",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
