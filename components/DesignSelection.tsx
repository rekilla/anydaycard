import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { CardFormat, CoverTextPreference, DesignOption } from '../types';

interface DesignSelectionProps {
  frontOptions: DesignOption[];
  backOptions: DesignOption[];
  selectedFrontId: string | null;
  selectedBackId: string | null;
  onSelectFront: (id: string) => void;
  onSelectBack: (id: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  messagePreview?: string;
  cardFormat?: CardFormat | null;
  coverTextPreference?: CoverTextPreference | null;
}

export const DesignSelection: React.FC<DesignSelectionProps> = ({
  frontOptions,
  backOptions,
  selectedFrontId,
  selectedBackId,
  onSelectFront,
  onSelectBack,
  onConfirm,
  onBack,
  isLoading,
  messagePreview,
  cardFormat,
  coverTextPreference,
}) => {
  const previewText = messagePreview
    ? messagePreview.length > 140
      ? `${messagePreview.slice(0, 140)}...`
      : messagePreview
    : 'Your message will appear here.';

  const backOptionLabel = cardFormat === 'book-open' ? 'inside' : 'back';
  const messageLocation = backOptionLabel;
  const cardFormatLabel = cardFormat === 'book-open' ? 'Book open' : cardFormat === 'single-card' ? 'Single card' : null;
  const coverTextLabel = coverTextPreference === 'text-on-image'
    ? 'Cover text on'
    : coverTextPreference === 'design-only'
      ? 'Design only'
      : null;

  if (isLoading && frontOptions.length === 0 && backOptions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin mb-6"></div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
          Generating your designs
        </h2>
        <p className="text-slate-500 max-w-md">
          We are crafting front and back options based on your details and chosen template.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-5xl w-full space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Step 5 of 5
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            Choose your card designs
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Pick one front and one {backOptionLabel} option. We will use your message on the {messageLocation}.
          </p>
          {(cardFormatLabel || coverTextLabel) && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              {cardFormatLabel && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  {cardFormatLabel}
                </span>
              )}
              {coverTextLabel && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  {coverTextLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
              Front designs
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {frontOptions.map((option) => {
                const isSelected = option.id === selectedFrontId;
                return (
                  <button
                    key={option.id}
                    onClick={() => onSelectFront(option.id)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-sm hover:shadow-md
                      ${isSelected ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200'}`}
                  >
                    <img src={option.image} alt="Front design option" className="w-full aspect-[3/4] object-cover" />
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-brand-500 text-white rounded-full p-1">
                        <CheckCircle size={18} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
              {cardFormat === 'book-open' ? 'Inside designs' : 'Back designs'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {backOptions.map((option) => {
                const isSelected = option.id === selectedBackId;
                return (
                  <button
                    key={option.id}
                    onClick={() => onSelectBack(option.id)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-sm hover:shadow-md
                      ${isSelected ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200'}`}
                  >
                    <div className="relative w-full aspect-[3/4]">
                      <img src={option.image} alt="Back design option" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-white/65"></div>
                      <div className="relative z-10 h-full flex items-center justify-center px-8">
                        <p className="text-sm text-slate-700 text-center font-serif">
                          {previewText}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-brand-500 text-white rounded-full p-1">
                        <CheckCircle size={18} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            You can edit the message after selecting your designs.
          </p>
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={!selectedFrontId || !selectedBackId || isLoading}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Continue to preview
          </Button>
        </div>
      </div>
    </div>
  );
};
