"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || 'Admin User',
            role: 'admin',
            organization: 'AJO Platform',
            lastLogin: null,
            permissions: {},
            isConfirmed: false,
          };

          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session?.user) {
          try {
            // best-effort update of last_login
            await fetch('/api/admin/profile/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: session.user.id, last_login: new Date().toISOString() })
            });
          } catch (_) {}
          const userData = {
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || 'Admin User',
            role: 'admin',
            organization: 'AJO Platform',
            lastLogin: null,
            permissions: {},
            isConfirmed: false,
          };
          setUser(userData);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Redirect logic based on auth state (do not force onboarding; onboarding handles its own redirect)
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname?.startsWith("/auth");
      if (!user && !isAuthPage) {
        router.push("/auth/signin");
      } else if (user && isAuthPage) {
        // Once signed-in, send to main page; onboarding will only be used in signup flow
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      // Force sign out even if there's an error
      setUser(null);
      router.push("/auth/signin");
    }
  };

  const refreshSession = async () => {
    try {
      await supabase.auth.getSession();
    } catch (e) {}
  };

  const value = {
    user,
    isLoading,
    signOut,
    isAuthenticated: !!user,
    isConfirmed: !!user?.isConfirmed,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
