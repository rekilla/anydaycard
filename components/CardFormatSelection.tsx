import React from 'react';
import { ArrowLeft, BookOpen, CreditCard } from 'lucide-react';
import { Button } from './Button';
import { CardFormat } from '../types';

interface CardFormatSelectionProps {
  selectedFormat: CardFormat | null;
  onSelect: (format: CardFormat) => void;
  onConfirm: () => void;
  onBack: () => void;
  templateName?: string;
  isLoading?: boolean;
}

const CARD_FORMATS: Array<{
  id: CardFormat;
  title: string;
  description: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  {
    id: 'book-open',
    title: 'Book open',
    description: 'Folds open like a book. Front art with your message inside.',
    Icon: BookOpen,
  },
  {
    id: 'single-card',
    title: 'Single card',
    description: 'Postcard style. Front art with your message on the back.',
    Icon: CreditCard,
  },
];

export const CardFormatSelection: React.FC<CardFormatSelectionProps> = ({
  selectedFormat,
  onSelect,
  onConfirm,
  onBack,
  templateName,
  isLoading,
}) => {
  const templateLabel = templateName || 'Selected template';
  const renderArtPreview = (label: string, showMessageOverlay: boolean) => (
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
      <span className="absolute top-2 right-2 text-[9px] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-[0.2em] text-slate-500 bg-white/80 px-2 py-1 rounded-full">
        {templateLabel}
      </span>
    </div>
  );

  const renderFormatPreview = (format: CardFormat) => {
    const backLabel = format === 'book-open' ? 'Inside' : 'Back';
    if (format === 'book-open') {
      return (
        <div className="relative h-36">
          <div className="absolute left-0 top-4 w-[48%]">
            {renderArtPreview('Front', false)}
          </div>
          <div className="absolute right-0 top-0 w-[48%]">
            {renderArtPreview(backLabel, true)}
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-36">
        <div className="absolute left-6 top-2 w-[52%] shadow-sm">
          {renderArtPreview('Front', false)}
        </div>
        <div className="absolute left-0 top-8 w-[52%] shadow-sm">
          {renderArtPreview(backLabel, true)}
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
            Step 3 of 5
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            Choose a card type
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Pick the format you want to send. You can change this later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {CARD_FORMATS.map(({ id, title, description, Icon }) => {
            const isSelected = selectedFormat === id;
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all bg-white shadow-sm hover:shadow-md
                  ${isSelected ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200'}`}
              >
                <div className="mb-5">
                  {renderFormatPreview(id)}
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
            Next, choose whether the front includes cover text.
          </p>
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={!selectedFormat || isLoading}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
