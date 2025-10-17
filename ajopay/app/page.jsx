import Link from "next/link";
import Image from "next/image";
import Playstorebutton from "@/components/Playstorebutton";
import Appstorebutton from "@/components/Appstorebutton";
import { Spotlight } from "@/components/ui/Spotlight";
import { cn } from "@/lib/utils";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-neutral-950 text-white md:h-screen h-fit overflow-hidden relative">
        <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <header className="w-full bg-neutral-950 relative z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/appicon.png" alt="AjoPay" width={28} height={28} className="rounded" />
            <span className="text-lg font-semibold text-white">AjoPay</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            {/* <a href="#features" className="hover:text-white text-neutral-300">Features</a>
            <a href="#how" className="hover:text-white text-neutral-300">How it works</a>
            <a href="#security" className="hover:text-white text-neutral-300">Security</a>
            <a href="#download" className="hover:text-white text-neutral-300">Get the app</a> */}
            <Link href="/privacy" className="hover:text-white text-neutral-300">Privacy Policy</Link>
          </nav>
        </div>
      </header>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center relative z-30">
            {/* Left copy */}
            <div>
              <h1 className="text-5xl md:text-7xl font-semibold md:leading-[68px] leading-[53px] mb-5">The easy way to run your savings circle</h1>
              <p className="md:text-neutral-300/80 text-neutral-300 mb-8 font-medium text-sm md:text-[16px] max-w-xl">Create a group, fund wallets securely with cards, contribute on schedule, and manage payouts with total clarity. AjoPay keeps your circle organized and on track.</p>
              <div className="flex flex-wrap gap-3" id="download">
                <Playstorebutton />
                <Appstorebutton />
              </div>
              {/* Replaced users section with trust badges */}
              <div className="mt-8 text-neutral-300 flex flex-col items-start">
                <span className="mb-3 text-sm font-medium tracking-wide uppercase text-neutral-400">Backed by</span>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-center px-5 py-2 border border-neutral-800 rounded-xl bg-neutral-900/60 shadow-sm min-w-[135px]">
                    <span className="flex items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 mr-1.5 border border-white/30" />
                      <span className="font-medium text-base text-white">Stripe</span>
                    </span>
                    <span className="text-xs text-neutral-400 font-light">Payments</span>
                  </div>
                  <div className="flex flex-col items-center px-5 py-2 border border-neutral-800 rounded-xl bg-neutral-900/60 shadow-sm min-w-[135px]">
                    <span className="flex items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-blue-400 mr-1.5 border border-white/30" />
                      <span className="font-medium text-base text-white">Supabase</span>
                    </span>
                    <span className="text-xs text-neutral-400 font-light">Security</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right visual */}
            <div className="relative flex items-center justify-center md:h-[600px] w-full">
              {/* <div className="absolute -inset-6 rounded-3xl bg-violet-400/10 blur-2xl" /> */}
              <Image src="/heroshot.png" alt="AjoPay app" width={750} height={700} className="relative rounded-3xl w-fit md:h-full h-[350px] md:ml-[240px]" priority />
              <Image src="/heroshot2.png" alt="AjoPay app" width={750} height={700} className="relative rounded-3xl w-fit md:h-full h-[350px] md:mt-[280px]" priority />
            </div>
          </div>
        </section>

        {/* Features */}
        {/* <section id="features" className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">Everything you need to run a savings circle</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-white border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-2">Fund wallets with cards</h3>
                <p className="text-sm text-gray-600">Use PaymentSheet for fast, secure funding. Save cards for one‑tap top‑ups.</p>
              </div>
              <div className="rounded-xl bg-white border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-2">Transparent contributions</h3>
                <p className="text-sm text-gray-600">Track deposits, contributions, and payouts with a clear balance ledger.</p>
              </div>
              <div className="rounded-xl bg-white border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-2">Notifications that matter</h3>
                <p className="text-sm text-gray-600">Get push and email alerts for funding, contributions, invites, and more.</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* How it works */}
        {/* <section id="how" className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">How it works</h2>
            <ol className="grid md:grid-cols-3 gap-6 list-decimal list-inside text-gray-800 text-sm">
              <li className="rounded-xl border border-gray-200 p-6 bg-white">Create a group and set the contribution amount and frequency.</li>
              <li className="rounded-xl border border-gray-200 p-6 bg-white">Invite members and fund your wallet using secure card payments.</li>
              <li className="rounded-xl border border-gray-200 p-6 bg-white">Contribute on schedule, track balances, and manage payouts.</li>
            </ol>
          </div>
        </section> */}

        {/* Security */}
        {/* <section id="security" className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Built with security first</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>Supabase authentication & RLS for data safety</li>
                <li>Service‑role APIs for secure server operations</li>
                <li>Stripe for PCI-compliant payments</li>
                <li>Granular role‑based access for admins</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-2">Privacy matters</h3>
              <p className="text-sm text-gray-600 mb-3">We keep data collection minimal and transparent. Read our policy to learn how we protect your information.</p>
              <Link href="/privacy" className="text-sm text-gray-800 underline">Read Privacy Policy</Link>
            </div>
          </div>
        </section> */}

        {/* CTA */}
        {/* <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Ready to start saving together?</h2>
            <p className="text-gray-600 mb-6">Download the AjoPay app on your device and set up your first group in minutes.</p>
            <div className="flex flex-wrap gap-3 justify-center" id="download">
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Get it on Google Play</a>
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Download on the App Store</a>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      {/* <footer className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} AjoPay</span>
          <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
        </div>
      </footer> */}
    </div>
  );
}
