"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Check if it's an email not confirmed error
        if (error.message.includes('email not confirmed') || error.message.includes('Email not confirmed')) {
          // Resend verification email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: formData.email
          });

          if (resendError) {
            setError("Please check your email for a verification link. If you don't see it, please try again.");
          } else {
            setError("Please check your email for a verification link. We've sent you a new one.");
          }
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          // Resend verification email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: formData.email
          });

          if (resendError) {
            setError("Please verify your email before signing in. Check your email for a verification link.");
          } else {
            setError("Please verify your email before signing in. We've sent you a new verification link.");
          }
          setIsLoading(false);
          return;
        }

        // Decide based on admin status via server API
        try {
          // Update last_login immediately on successful signin
          try {
            await fetch('/api/admin/profile/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: data.user.id, last_login: new Date().toISOString() })
            });
          } catch (_) {}

          const res = await fetch('/api/admin/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user.id })
          });
          const json = await res.json();
          if (json?.is_confirmed) router.push("/"); else router.push("/onboarding");
        } catch (_) {
          router.push("/onboarding");
        }
      } else {
        setError("Authentication failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/mockup.png)' }}>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[15px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Image src="/bluebg.jpeg" priority alt="Error" className="rounded-[15px]" width={100} height={100} />
            </div>
            <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">Welcome back</h1>
            <p className="text-sm text-[#7E7E7E] font-light">
              Sign in to your AJO Admin account
            </p>
          </div>

          {/* Sign In Form */}
          <div className="px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50/50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-light text-[#1E1E1E]">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-[#7E7E7E]" strokeWidth={1.5} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2 border border-[#D9D9D9] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-[#1E1E1E] placeholder-[#7E7E7E]"
                placeholder="admin@ajo.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-light text-[#1E1E1E]">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-[#7E7E7E]" strokeWidth={1.5} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-9 pr-10 py-2 border border-[#D9D9D9] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-[#1E1E1E] placeholder-[#7E7E7E]"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7E7E7E] hover:text-[#1E1E1E] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-[#D9D9D9] focus:ring-blue-500/20 focus:ring-2"
              />
              <span className="text-sm text-[#7E7E7E] font-light">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-light transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-light hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 pt-6 border-t border-[#D9D9D9]">
          <p className="text-center text-sm text-[#7E7E7E] font-light">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-700 font-light transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Admin Access Info */}
        <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100">
          <h3 className="text-sm font-light text-blue-800 mb-2">Admin Access</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Sign in with your admin credentials or create a new account.</p>
            <p className="text-blue-600 font-medium">New accounts require email verification.</p>
            <p className="text-blue-600 font-medium">If you haven't verified your email, we'll resend the verification link.</p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
