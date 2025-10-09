"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../../lib/supabase";

export default function VerifyPage() {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!token || type !== "signup") {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup"
        });

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        if (data.user) {
          setStatus("success");
          setMessage("Email verified successfully! You can now sign in to your admin account.");

          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push("/auth/signin");
          }, 3000);
        }
      } catch (error) {
        setStatus("error");
        setMessage("Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/mockup.png)' }}>
      </div>

      {/* Right side - Verification content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br rounded-[15px] from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Image src="/bluebg.jpeg" priority alt="logo" className="rounded-[15px]" width={100} height={100} />
            </div>
            <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">
              {status === "verifying" && "Verifying Email"}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="text-sm text-[#7E7E7E] font-light">
              {status === "verifying" && "Please wait while we verify your email address"}
              {status === "success" && "Your admin account is now active"}
              {status === "error" && "There was a problem verifying your email"}
            </p>
          </div>

          <div className="bg-white p-8">
            <div className="space-y-6">
              {/* Status Icon */}
              <div className={`w-16 h-16 flex items-center justify-center mx-auto ${
                status === "verifying" ? "bg-blue-50 border border-blue-100" :
                status === "success" ? "bg-green-50 border border-green-100" :
                "bg-red-50 border border-red-100"
              }`}>
                {status === "verifying" && (
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                )}
                {status === "success" && (
                  <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={1.5} />
                )}
                {status === "error" && (
                  <AlertCircle className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                )}
              </div>

              {/* Message */}
              <div className="text-center space-y-3">
                <p className="text-sm text-[#7E7E7E] font-light">
                  {message}
                </p>
              </div>

              {/* Progress Bar */}
              {status === "verifying" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#7E7E7E]">
                    <span>Email Sent</span>
                    <span>Verifying</span>
                    <span>Complete</span>
                  </div>
                  <div className="w-full bg-[#F8F8F8] h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 animate-pulse" style={{ width: '66%' }}></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {status === "success" && (
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-light hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </Link>

                  <p className="text-xs text-[#999999] font-light text-center">
                    Redirecting automatically in 3 seconds...
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white font-light hover:bg-blue-700 transition-colors"
                  >
                    <span>Try Signing In</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </Link>

                  <div className="text-center">
                    <p className="text-sm text-[#7E7E7E] font-light">
                      Need help?{" "}
                      <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-light transition-colors">
                        Create a new account
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
