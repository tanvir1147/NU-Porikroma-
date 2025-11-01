export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Terms of Service</h1>
          
          <div className="text-white/90 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Acceptance of Terms</h2>
              <p>
                By accessing and using NU Porikroma, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Description of Service</h2>
              <p>
                NU Porikroma provides access to National University notices, results, and academic updates. We aggregate information from official sources for student convenience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Use the service for lawful purposes only</li>
                <li>Do not attempt to interfere with the service</li>
                <li>Respect intellectual property rights</li>
                <li>Verify information from official sources</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Content Disclaimer</h2>
              <p>
                While we strive to provide accurate and up-to-date information, we make no warranties about the completeness, reliability, or accuracy of the information. Users should verify all information from official National University sources.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are owned by NU Porikroma and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Limitation of Liability</h2>
              <p>
                In no event shall NU Porikroma be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Termination</h2>
              <p>
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="mt-2 text-sm text-white/70">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at: [Your Email]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}