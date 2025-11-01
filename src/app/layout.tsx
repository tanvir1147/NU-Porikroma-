import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NU Porikroma - National University Bangladesh Notices & Results",
  description: "Official National University Bangladesh notice management system. Get real-time updates on exam schedules, results, admission notices, and academic announcements. Access NU notices, results, and important updates in one place.",
  keywords: [
    "NU",
    "National University",
    "Bangladesh",
    "Notices",
    "Education",
    "Porikroma",
    "NU Bangladesh",
    "National University Bangladesh",
    "NU Exam Schedule",
    "NU Results",
    "NU Admission",
    "NU Notices",
    "NU Academic Calendar",
    "NU Exam Routine",
    "NU Syllabus",
    "NU Exam Results",
    "NU Important Notices",
    "NU Updates",
    "NU News"
  ],
  authors: [{ name: "NU Porikroma Team" }],
  creator: "NU Porikroma Team",
  publisher: "NU Porikroma",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://nu-porikroma.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: 'https://nu-porikroma.vercel.app', // Update with your actual domain
  },
  openGraph: {
    title: "NU Porikroma - National University Bangladesh Notices & Results",
    description: "Official National University Bangladesh notice management system. Get real-time updates on exam schedules, results, admission notices, and academic announcements.",
    type: "website",
    locale: "en_US",
    url: "https://nu-porikroma.vercel.app", // Update with your actual domain
    siteName: "NU Porikroma",
    images: [
      {
        url: "/logo.png",
        width: 400,
        height: 400,
        alt: "NU Porikroma Logo - National University Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NU Porikroma - National University Bangladesh Notices & Results",
    description: "Official National University Bangladesh notice management system. Real-time updates on exam schedules, results, and academic announcements.",
    images: ["/logo.png"],
    creator: "@NU_Porikroma",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE || '',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="alternate" type="application/rss+xml" title="NU Porikroma - National University Bangladesh Notices" href="/api/rss" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${notoSansBengali.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}