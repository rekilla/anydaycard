import React from 'react';
import { Palette, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { DesignStarter } from '../services/designSystem';

interface TemplateSelectionProps {
  categoryLabel: string;
  categoryDescription: string;
  templates: DesignStarter[];
  selectedTemplateId: string | null;
  onSelect: (templateId: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  categoryLabel,
  categoryDescription,
  templates,
  selectedTemplateId,
  onSelect,
  onConfirm,
  onBack,
  isLoading,
}) => {
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
            Step 2 of 5
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
            <Palette size={14} /> {categoryLabel}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            Pick a starter template
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {categoryDescription} Choose a template style, and we will generate custom art from your details.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <button
                key={template.id}
                onClick={() => onSelect(template.id)}
                className={`text-left overflow-hidden rounded-2xl border-2 transition-all bg-white shadow-sm hover:shadow-md
                  ${isSelected ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200'}`}
              >
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 via-white to-slate-100 border-b border-slate-200 flex items-center justify-center text-xs text-slate-400">
                    Image placeholder
                  </div>
                  {isSelected && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-brand-600 text-white px-2 py-1 rounded-full shadow-sm">
                      Selected
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            Next, choose your card format and cover text style.
          </p>
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={!selectedTemplateId || isLoading}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Choose card type
          </Button>
        </div>
      </div>
    </div>
  );
};
