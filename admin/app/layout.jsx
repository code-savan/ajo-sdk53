"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "../components/SidebarContext";
import { LogoutProvider } from "../components/ui";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import SessionStatus from "../components/SessionStatus";
import RouteGuard from "../components/RouteGuard";

import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AppContent({ children }) {
  const { isLoading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isOnboardingPage = pathname === '/onboarding';

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // For auth pages, render without sidebar
  if (isAuthPage || isOnboardingPage) {
    return <>{children}</>;
  }

  // For dashboard pages, render with sidebar
  return (
    <LogoutProvider>
      <SidebarProvider>
        <RouteGuard>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden md:pl-[306px]">
              {children}
              <SessionStatus />
            </div>
          </div>
        </RouteGuard>
      </SidebarProvider>
    </LogoutProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-content)] text-[var(--text-primary)]`}>

        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
