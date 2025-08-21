import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Ideal Arena | Cricket Ground Booking",
  description: "Book your cricket matches easily at The Ideal Arena, located in Shaheed Hussain Ideal City, Karachi.",
  keywords: [
    "cricket ground booking",
    "Karachi cricket ground",
    "The Ideal Arena",
    "book cricket pitch",
    "Shaheed Hussain Ideal City",
    "cricket stadium Korangi"
  ],
  authors: [{ name: "The Ideal Arena" }],
  openGraph: {
    title: "The Ideal Arena | Cricket Ground Booking",
    description: "Book your cricket matches easily at The Ideal Arena, located in Shaheed Hussain Ideal City, Karachi.",
    url: "https://ground-booking-one.vercel.app/", // Replace with your real domain
    siteName: "The Ideal Arena",
    images: [
      {
        url: "/seo.webp",
        width: 500,
        height: 500,
        alt: "The Ideal Arena - Cricket Ground Booking",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  icons: {
    icon: "favicon.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
