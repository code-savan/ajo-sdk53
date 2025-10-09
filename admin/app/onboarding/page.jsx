"use client";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default function OnboardingPage() {
  const { signOut } = useAuth();

  // Poll server API for confirmation; redirect immediately when confirmed
  useEffect(() => {
    let timer;
    const poll = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const res = await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        });
        const json = await res.json();
        if (json?.is_confirmed || json?.is_active === 'active') {
          window.location.href = '/';
          return;
        }
      } catch (_) {}
      timer = setTimeout(poll, 4000);
    };
    poll();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/mockup.png)' }}>
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br rounded-[15px] from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Image src="/bluebg.jpeg" priority alt="logo" className="rounded-[15px]" width={100} height={100} />
            </div>
            <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">Awaiting Admin Approval</h1>
            <p className="text-sm text-[#7E7E7E] font-light">
              Your account has been created and your email verified. An admin must confirm your signup and assign a role before you can access the dashboard.
            </p>
          </div>

          <div className="bg-white p-8">
            <div className="space-y-6">
              <div className="text-center text-xs text-[#999999] font-light">
                If you believe this is taking too long, please contact your platform administrator.
              </div>

              <button
                onClick={signOut}
                className="w-full py-2 px-4 bg-[#1E1E1E] text-white font-light cursor-pointer hover:bg-black transition-colors hover:opacity-90"
              >
                Logout
              </button>

              <div className="text-center">
                <p className="text-xs text-[#7E7E7E] font-light">
                  Already approved? <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700">Sign in again</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
