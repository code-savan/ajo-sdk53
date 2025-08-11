import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AJO Admin",
  description: "AJO Admin Dashboard",
};

import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "../components/SidebarContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-content)] text-[var(--text-primary)]`}>
        <SidebarProvider>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
