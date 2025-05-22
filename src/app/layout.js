import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LikedAnimeProvider } from "@/context/LikedAnimeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/context/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Toby's Anime List",
  description: "Search and save your favorite anime shows using Jikan API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <LikedAnimeProvider>{children}</LikedAnimeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
