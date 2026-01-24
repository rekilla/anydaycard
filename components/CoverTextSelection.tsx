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
  const renderArtPreview = (label: string, isArtSide: boolean, showCoverText: boolean) => (
    <div className="relative w-full aspect-[3/4] rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
      {isArtSide ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50"></div>
          <div className="absolute inset-0">
            <div className="absolute top-4 right-4 w-12 h-12 bg-rose-200/60 rounded-full blur-md"></div>
            <div className="absolute bottom-6 left-4 w-10 h-10 bg-amber-300/50 rounded-full blur-sm"></div>
          </div>
          {showCoverText && (
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center">
              <span className="text-[8px] font-semibold uppercase tracking-wider bg-white/90 text-slate-600 px-2 py-0.5 rounded shadow-sm">
                Cover text
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center px-3 gap-1.5 bg-white">
          <div className="h-1 w-4/5 bg-slate-200 rounded"></div>
          <div className="h-1 w-3/5 bg-slate-200 rounded"></div>
          <div className="h-1 w-2/3 bg-slate-200 rounded"></div>
        </div>
      )}
      <span className="absolute top-1.5 right-1.5 text-[8px] uppercase tracking-wider text-slate-400 bg-white/80 px-1.5 py-0.5 rounded">
        {label}
      </span>
    </div>
  );

  const renderCoverPreview = (showCoverText: boolean) => {
    if (cardFormat === 'book-open') {
      // Book format: side-by-side like an open book
      return (
        <div className="flex items-center justify-center gap-1 h-32">
          <div className="w-[45%]">
            {renderArtPreview('Front', true, showCoverText)}
          </div>
          <div className="w-px h-20 bg-slate-300"></div>
          <div className="w-[45%]">
            {renderArtPreview('Inside', false, false)}
          </div>
        </div>
      );
    }

    if (cardFormat === 'single-card') {
      // Single card / postcard: stacked cards showing front and back
      return (
        <div className="relative h-32 flex items-center justify-center">
          <div className="absolute w-[50%] translate-x-3 translate-y-1 rotate-3">
            {renderArtPreview('Back', false, false)}
          </div>
          <div className="absolute w-[50%] -translate-x-3 -translate-y-1 -rotate-3">
            {renderArtPreview('Front', true, showCoverText)}
          </div>
        </div>
      );
    }

    // Default: just show front
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-[50%]">
          {renderArtPreview('Front', true, showCoverText)}
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
