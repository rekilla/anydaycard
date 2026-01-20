import React, { useState } from 'react';
import { Button } from './Button';
import { RefreshCw, Check, Edit2, Sparkles, ChevronRight } from 'lucide-react';

interface MessageSelectionProps {
  messages: string[];
  onSelect: (message: string, isHeavilyEdited: boolean) => void;
  onRegenerate: () => void;
  isLoading?: boolean;
}

// Simple Levenshtein distance for edit calculation
const calculateEditDistance = (a: string, b: string): number => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export const MessageSelection: React.FC<MessageSelectionProps> = ({ 
  messages, 
  onSelect, 
  onRegenerate,
  isLoading 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editedMessages, setEditedMessages] = useState<string[]>(messages);
  const [isEditing, setIsEditing] = useState(false);

  // If messages change upstream, reset
  React.useEffect(() => {
    setEditedMessages(messages);
    setSelectedIndex(null);
    setIsEditing(false);
  }, [messages]);

  const handleTextChange = (index: number, val: string) => {
    const newMsgs = [...editedMessages];
    newMsgs[index] = val;
    setEditedMessages(newMsgs);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      const finalMessage = editedMessages[selectedIndex];
      const originalMessage = messages[selectedIndex];

      // LOGIC: Editing Boundaries
      // Calculate how much changed. If > 20% changed, mark as heavy edit.
      const distance = calculateEditDistance(originalMessage, finalMessage);
      const maxLength = Math.max(originalMessage.length, finalMessage.length);
      const percentageChanged = maxLength > 0 ? (distance / maxLength) : 0;
      
      const isHeavilyEdited = percentageChanged > 0.2; // 20% threshold

      if (isHeavilyEdited) {
        console.log("User heavily edited the message. Design will prioritize text content over initial vibe.");
      }

      onSelect(finalMessage, isHeavilyEdited);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            Choose your words
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            We drafted a few options based on your story. Pick the one that feels most like you. You can lightly edit it, too.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {editedMessages.map((msg, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div 
                key={idx}
                onClick={() => !isEditing && setSelectedIndex(idx)}
                className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col
                  ${isSelected 
                    ? 'border-brand-500 bg-white shadow-xl scale-[1.02] z-10' 
                    : 'border-slate-200 bg-white/50 hover:border-brand-200 hover:shadow-md'
                  }
                `}
              >
                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300 bg-transparent'}
                `}>
                  {isSelected && <Check size={14} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-h-[140px] flex items-center">
                  {isEditing && isSelected ? (
                    <textarea 
                      className="w-full h-full bg-slate-50 p-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:outline-none font-serif text-lg leading-relaxed text-slate-800 resize-none"
                      value={msg}
                      onChange={(e) => handleTextChange(idx, e.target.value)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className={`font-serif text-lg leading-relaxed ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                      "{msg}"
                    </p>
                  )}
                </div>

                {/* Actions Bar (Only visible when selected) */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center animate-fade-in">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(!isEditing);
                      }}
                      className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-brand-600 flex items-center gap-1"
                    >
                      <Edit2 size={12} /> {isEditing ? 'Done Editing' : 'Edit Text'}
                    </button>
                    <span className="text-xs text-brand-600 font-bold">Selected</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200">
          <button 
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            Try another set
          </button>

          <Button 
            size="lg" 
            onClick={handleConfirm}
            disabled={selectedIndex === null || isLoading}
            isLoading={isLoading}
            className="w-full md:w-auto px-12"
          >
            {isLoading ? 'Loading...' : (
               <>Choose Design Template <ChevronRight size={18} className="ml-2" /></>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};
