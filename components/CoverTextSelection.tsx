import React from 'react';
import { ArrowLeft, Type, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { CardFormat, CoverTextPreference } from '../types';

interface CoverTextSelectionProps {
  selectedPreference: CoverTextPreference | null;
  onSelect: (preference: CoverTextPreference) => void;
  onConfirm: () => void;
  onBack: () => void;
  cardFormat?: CardFormat | null;
  templateName?: string;
  isLoading?: boolean;
}

const COVER_TEXT_OPTIONS: Array<{
  id: CoverTextPreference;
  title: string;
  description: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  {
    id: 'text-on-image',
    title: 'Text on the image',
    description: 'We leave clean space on the front for a short cover line.',
    Icon: Type,
  },
  {
    id: 'design-only',
    title: 'Design only',
    description: 'Full-bleed art with no cover text on the front.',
    Icon: ImageIcon,
  },
];

export const CoverTextSelection: React.FC<CoverTextSelectionProps> = ({
  selectedPreference,
  onSelect,
  onConfirm,
  onBack,
  cardFormat,
  templateName,
  isLoading,
}) => {
  const templateLabel = templateName || 'Selected template';
  const renderArtPreview = (label: string, showMessageOverlay: boolean, showCoverText: boolean) => (
    <div className="relative w-full aspect-[3/4] rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
      <div className="absolute inset-0">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-rose-100/70 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-5 w-16 h-16 bg-amber-100/70 rounded-full blur-lg"></div>
      </div>
      {showMessageOverlay && (
        <>
          <div className="absolute inset-0 bg-white/70"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-4 gap-2">
            <div className="h-1.5 w-4/5 bg-slate-200 rounded"></div>
            <div className="h-1.5 w-3/5 bg-slate-200 rounded"></div>
            <div className="h-1.5 w-2/3 bg-slate-200 rounded"></div>
          </div>
        </>
      )}
      {showCoverText && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white/85 text-slate-600 px-3 py-1 rounded-full shadow-sm">
            Cover text
          </span>
        </div>
      )}
      <span className="absolute top-2 right-2 text-[9px] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-[0.2em] text-slate-500 bg-white/80 px-2 py-1 rounded-full">
        {templateLabel}
      </span>
    </div>
  );

  const renderCoverPreview = (showCoverText: boolean) => {
    const backLabel = cardFormat === 'book-open' ? 'Inside' : 'Back';
    if (cardFormat === 'book-open') {
      return (
        <div className="relative h-36">
          <div className="absolute left-0 top-4 w-[48%]">
            {renderArtPreview('Front', false, showCoverText)}
          </div>
          <div className="absolute right-0 top-0 w-[48%]">
            {renderArtPreview(backLabel, true, false)}
          </div>
        </div>
      );
    }

    if (cardFormat === 'single-card') {
      return (
        <div className="relative h-36">
          <div className="absolute left-6 top-2 w-[52%] shadow-sm">
            {renderArtPreview('Front', false, showCoverText)}
          </div>
          <div className="absolute left-0 top-8 w-[52%] shadow-sm">
            {renderArtPreview(backLabel, true, false)}
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-36">
        <div className="absolute left-0 top-2 w-[60%]">
          {renderArtPreview('Front', false, showCoverText)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Step 4 of 5
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            Add cover text?
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Decide if the front design should reserve space for a short line of text.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {COVER_TEXT_OPTIONS.map(({ id, title, description, Icon }) => {
            const isSelected = selectedPreference === id;
            const showCoverText = id === 'text-on-image';
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all bg-white shadow-sm hover:shadow-md
                  ${isSelected ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200'}`}
              >
                <div className="mb-5">
                  {renderCoverPreview(showCoverText)}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`p-2 rounded-full ${isSelected ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={18} />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            We will generate 2 front designs and 2 back designs.
          </p>
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={!selectedPreference || isLoading}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Generate designs
          </Button>
        </div>
      </div>
    </div>
  );
};
