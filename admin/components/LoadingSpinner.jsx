"use client";
import Image from "next/image";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <Image src="/bluebg.jpeg" priority alt="Error" className="rounded-[15px]" width={100} height={100} />
        </div>
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-[#7E7E7E] font-light">{message}</p>
      </div>
    </div>
  );
}
