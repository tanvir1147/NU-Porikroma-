export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Privacy Policy</h1>
          
          <div className="text-white/90 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Information We Collect</h2>
              <p>
                NU Porikroma collects information to provide better services to our users. We collect information in the following ways:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Information you give us (when contacting us)</li>
                <li>Information we get from your use of our services (analytics)</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">How We Use Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate with you about products, services, and events</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Third-Party Advertising</h2>
              <p>
                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your visits to this site and other sites on the Internet. You can opt out of personalized advertising by visiting Google's Ads Settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Cookies</h2>
              <p>
                We use cookies and similar technologies to recognize you and/or your device(s) on, off and across different services and devices. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at: [Your Email]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-400 mb-3">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              <p className="mt-2 text-sm text-white/70">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}