import React from 'react';
import { Mail } from 'lucide-react';

interface LegalProps {
  variant: 'terms' | 'privacy';
}

const TERMS_CONTENT = [
  {
    title: 'Using AnyDayCard',
    body: 'By using this app you agree not to misuse the service, attempt to reverse engineer the models, or submit unlawful content.',
  },
  {
    title: 'Purchases and fulfillment',
    body: 'Orders are simulated in this prototype. In production, cards are printed and mailed to the address you provide.',
  },
  {
    title: 'Account access',
    body: 'Your account is tied to the email you provide at login or checkout. Keep access to that email secure.',
  },
];

const PRIVACY_CONTENT = [
  {
    title: 'What we collect',
    body: 'We collect the details you provide in the wizard, your email, and shipping address for fulfillment.',
  },
  {
    title: 'How we use data',
    body: 'We use data to generate card messages, schedule sends, and show your history in the dashboard.',
  },
  {
    title: 'Storage',
    body: 'This demo stores data locally in your browser. A production system would store encrypted records.',
  },
];

export const Legal: React.FC<LegalProps> = ({ variant }) => {
  const content = variant === 'terms' ? TERMS_CONTENT : PRIVACY_CONTENT;
  const title = variant === 'terms' ? 'Terms of Service' : 'Privacy Policy';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-600 font-serif font-bold text-xl cursor-pointer" onClick={() => window.location.hash = "#/"}>
            <Mail className="fill-brand-100" size={18} />
            AnyDayCard
          </div>
          <button
            onClick={() => window.location.hash = '#/'}
            className="text-sm font-medium text-slate-500 hover:text-brand-600"
          >
            Back to home
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-3">
          <h1 className="text-4xl font-serif font-bold">{title}</h1>
          <p className="text-slate-500 text-sm">Last updated {new Date().toLocaleDateString()}</p>
        </header>

        <div className="space-y-6">
          {content.map((section) => (
            <section key={section.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-2">{section.title}</h2>
              <p className="text-slate-600 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};
