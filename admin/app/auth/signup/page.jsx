"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const router = useRouter();
  // Capture browser location (city, country via geolocation if available)
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setLocationStr(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch (_) {}
      }, () => {}, { timeout: 5000 });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) {
        const message = (error.message || '').toLowerCase();
        if (message.includes('already registered') || message.includes('already exists')) {
          setError('This email is already registered. Please sign in or use a different email.');
        } else {
        setError(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Supabase can return a user with empty identities if the email already exists
        const identities = Array.isArray(data.user.identities) ? data.user.identities : [];
        if (identities.length === 0) {
          setError('This email is already registered. Please sign in instead.');
          setIsLoading(false);
          return;
        }

        // Defer admin_users insertion until after OTP verification when a session exists
        setSuccess(true);
        // Don't redirect to signin - let user verify email first
      } else {
        setError("Account creation failed");
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/mockup.png)' }}>
        </div>

        {/* Right side - OTP Verification content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br rounded-[15px] from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Image src="/bluebg.jpeg" priority alt="logo" className="rounded-[15px]" width={100} height={100} />
              </div>
              <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">Account Created!</h1>
              <p className="text-sm text-[#7E7E7E] font-light">
                We've sent a 6-digit code to {formData.email}
              </p>
            </div>

            <div className="bg-white p-8">
              <div className="space-y-6">
                {/* Email Icon */}
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                </div>

                {/* OTP Instructions */}
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-light text-[#1E1E1E]">Enter Verification Code</h3>
                  <p className="text-sm text-[#7E7E7E] font-light">
                    Enter the 6-digit code from your email to verify and continue
                  </p>
                </div>

                {/* Error Message */}
                {(otpError || error) && (
                  <div className="flex items-center gap-3 p-3 bg-red-50/50 border border-red-100">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-red-600 font-light">{otpError || error}</p>
                  </div>
                )}

                {/* OTP Input */}
                <div>
                  <label htmlFor="otp" className="text-sm font-light text-[#1E1E1E]">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      if (otpError) setOtpError("");
                    }}
                    className="mt-1 w-full px-4 py-2 border border-[#D9D9D9] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-[#1E1E1E] placeholder-[#7E7E7E] tracking-[0.3em] text-center"
                    placeholder="000000"
                  />
                  <p className="mt-2 text-xs text-[#999999] font-light text-center">This code expires in 60 minutes.</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      setIsVerifying(true);
                      setOtpError("");
                      setResendMsg("");
                      try {
                        if (otp.length !== 6) {
                          setOtpError("Please enter the 6-digit code");
                          return;
                        }
                        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
                          email: formData.email,
                          token: otp,
                          type: 'signup'
                        });

                        if (verifyError) {
                          setOtpError(verifyError.message);
                          return;
                        }

                        // Ensure we have a session; some flows may not return one
                        if (!verifyData?.session) {
                          await supabase.auth.signInWithPassword({
                            email: formData.email,
                            password: formData.password
                          });
                        }

                        // Best-effort ensure admin_users record exists; do not block routing
                        const { data: { user: authedUser } } = await supabase.auth.getUser();
                        if (authedUser?.id) {
                          try {
                            await fetch('/api/admin/ensure', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ user_id: authedUser.id, role: 'admin', full_name: formData.fullName, email: formData.email, location: locationStr || null, context: { ip: null, location: locationStr || null, device: navigator.userAgent } })
                            });
                          } catch (_) {}
                          router.push("/onboarding");
                        } else {
                          router.push("/onboarding");
                        }
                      } catch (err) {
                        setOtpError("Verification failed. Please try again.");
                      } finally {
                        setIsVerifying(false);
                      }
                    }}
                    disabled={isVerifying}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-light hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify and Continue'}
                  </button>

                  <button
                    onClick={async () => {
                      setResendMsg("");
                      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: formData.email });
                      if (resendError) setResendMsg("Failed to resend code. Please try again.");
                      else setResendMsg("A new code has been sent to your email.");
                    }}
                    type="button"
                    className="w-full py-2 px-4 border border-[#D9D9D9] text-[#1E1E1E] font-light hover:bg-[#FAFAFA] transition-colors"
                  >
                    Resend Code
                  </button>

                  {resendMsg && (
                    <p className="text-xs text-center text-[#7E7E7E] font-light">{resendMsg}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/mockup.png)' }}>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br rounded-[15px] from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Image src="/bluebg.jpeg" alt="app logo" className="rounded-[15px]" width={100} height={100} />
            </div>
            <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">Create Admin Account</h1>
            <p className="text-sm text-[#7E7E7E] font-light">
              Set up your AJO Admin dashboard access
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50/50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          {/* Full Name Field */}
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-sm font-light text-[#1E1E1E]">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-[#7E7E7E]" strokeWidth={1.5} />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2 border border-[#D9D9D9] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-[#1E1E1E] placeholder-[#7E7E7E]"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
                placeholder="admin@yourcompany.com"
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
                placeholder="Create a strong password"
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
            <p className="text-xs text-[#7E7E7E] font-light">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-light text-[#1E1E1E]">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-[#7E7E7E]" strokeWidth={1.5} />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-9 pr-10 py-2 border border-[#D9D9D9] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-[#1E1E1E] placeholder-[#7E7E7E]"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7E7E7E] hover:text-[#1E1E1E] transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-[#D9D9D9] focus:ring-blue-500/20 focus:ring-2 mt-0.5"
              required
            />
            <label className="text-sm text-[#7E7E7E] font-light">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-light hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 pt-6 border-t border-[#D9D9D9]">
          <p className="text-center text-sm text-[#7E7E7E] font-light">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-700 font-light transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
