export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <header className="w-full border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-500">How we handle your data</p>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 text-gray-800">
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Use of the App</h2>
            <p className="text-sm leading-6 text-gray-700">You must be at least 18 years old and legally able to enter into contracts. You agree to use AJo only for lawful purposes and not for any fraudulent or harmful activity.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Account Security</h2>
            <p className="text-sm leading-6 text-gray-700">You are responsible for maintaining the confidentiality of your account credentials. AJo is not liable for any loss resulting from unauthorized access to your account.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Contribution Groups</h2>
            <p className="text-sm leading-6 text-gray-700">All contributions are voluntary. You acknowledge that group members must follow agreed payment schedules, and failure to do so may affect fund distribution.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Wallet & Transactions</h2>
            <p className="text-sm leading-6 text-gray-700">By funding your wallet, you authorize AJo to process payments using your linked bank or card provider. Withdrawals may be subject to verification or delays due to security checks.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Fees & Charges</h2>
            <p className="text-sm leading-6 text-gray-700">Some transactions may include a small processing fee. These will be disclosed before completion.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Changes to the App</h2>
            <p className="text-sm leading-6 text-gray-700">We reserve the right to modify or discontinue features at any time without prior notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Termination</h2>
            <p className="text-sm leading-6 text-gray-700">We may suspend or terminate your access if you violate these terms, engage in fraud, or misuse the app.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Governing Law</h2>
            <p className="text-sm leading-6 text-gray-700">These terms are governed by the laws of the United States. Any disputes will be handled in the appropriate U.S. jurisdiction.</p>
          </section>
        </div>
      </main>

      <footer className="w-full border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6 text-sm text-gray-500">© {new Date().getFullYear()} AjoPay</div>
      </footer>
    </div>
  );
}
