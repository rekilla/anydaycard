import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { decodeReferralData, trackReferralSource } from '../services/qrCodeService';
import type { CardReferralData } from '../types';

interface RecipientLandingProps {
  onStartWizard: (referralData?: CardReferralData) => void;
}

export const RecipientLanding: React.FC<RecipientLandingProps> = ({ onStartWizard }) => {
  const { referralCode } = useParams<{ referralCode: string }>();
  const navigate = useNavigate();
  const [referralData, setReferralData] = useState<CardReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (referralCode) {
      const decoded = decodeReferralData(referralCode);
      if (decoded) {
        setReferralData(decoded);
        trackReferralSource(decoded);
      }
    }
    setIsLoading(false);
  }, [referralCode]);

  const handleStartCreating = () => {
    onStartWizard(referralData || undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-rose-50 flex items-center justify-center">
        <div className="animate-pulse text-brand-500">
          <Sparkles size={32} />
        </div>
      </div>
    );
  }

  const senderName = referralData?.senderName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-rose-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        {/* Heart Icon */}
        <div className="w-20 h-20 bg-brand-100 text-brand-500 rounded-full flex items-center justify-center mx-auto">
          <Heart size={40} className="fill-current" />
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            {senderName
              ? `${senderName} sent you something special`
              : 'Someone sent you something special'
            }
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Want to send one back? Create your own personalized card in under 60 seconds.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-4 pt-4">
          <Button
            size="lg"
            onClick={handleStartCreating}
            className="w-full group"
          >
            Make your own card
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-slate-400">
            No account needed. Takes less than a minute.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-600">AI</div>
            <div className="text-xs text-slate-500 mt-1">Generated Art</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-600">$12</div>
            <div className="text-xs text-slate-500 mt-1">Shipped Free</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-600">60s</div>
            <div className="text-xs text-slate-500 mt-1">To Create</div>
          </div>
        </div>

        {/* Skip Link */}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          or explore the homepage
        </button>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};
