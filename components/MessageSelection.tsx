import React, { useState } from 'react';
import { Button } from './Button';
import { RefreshCw, Check, Edit2, Sparkles, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import type { RegenerationPhase } from '../types';

/**
 * QA score summary for display
 */
interface QAScoreSummary {
  totalScore: number;
  maxScore: number;
  feedback?: string;
}

interface MessageSelectionProps {
  messages: string[];
  onSelect: (message: string, isHeavilyEdited: boolean) => void;
  onRegenerate: () => void;
  isLoading?: boolean;
  /** Current regeneration phase */
  regenerationPhase?: RegenerationPhase;
  /** Number of regeneration attempts */
  regenerationCount?: number;
  /** Explanation of what changed in this regeneration */
  changeExplanation?: string;
  /** QA scores for each message (parallel to messages array) */
  qaScores?: QAScoreSummary[];
  /** Whether user should be prompted for more detail */
  needsMoreDetail?: boolean;
  /** Suggested prompt to ask user */
  suggestedPrompt?: string;
  /** Callback when user wants to provide more detail */
  onProvideDetail?: () => void;
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
  isLoading,
  regenerationPhase = 'initial',
  regenerationCount = 0,
  changeExplanation,
  qaScores,
  needsMoreDetail,
  suggestedPrompt,
  onProvideDetail,
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

  // Get regeneration button text based on phase
  const getRegenerateText = (): string => {
    switch (regenerationPhase) {
      case 'initial':
      case 'rephrase':
        return 'Try another set';
      case 'new_angle':
        return 'Try a different angle';
      case 'clarify':
        return 'Add more detail';
      default:
        return 'Try another set';
    }
  };

  // Get QA score display for a message
  const getScoreDisplay = (index: number): { label: string; color: string } | null => {
    if (!qaScores || !qaScores[index]) return null;
    const score = qaScores[index];
    const percentage = Math.round((score.totalScore / score.maxScore) * 100);

    if (percentage >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (percentage >= 60) return { label: 'Good', color: 'text-brand-600' };
    if (percentage >= 40) return { label: 'Fair', color: 'text-amber-600' };
    return { label: 'Needs work', color: 'text-red-500' };
  };

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

        {/* Change Explanation Banner (shown after regeneration) */}
        {changeExplanation && regenerationCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-brand-50 border border-brand-100 rounded-xl animate-fade-in">
            <Sparkles size={18} className="text-brand-500 flex-shrink-0" />
            <p className="text-sm text-brand-700">
              <span className="font-semibold">What changed:</span> {changeExplanation}
            </p>
          </div>
        )}

        {/* Needs More Detail Prompt */}
        {needsMoreDetail && suggestedPrompt && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  We can make this more personal
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {suggestedPrompt}
                </p>
              </div>
            </div>
            {onProvideDetail && (
              <Button
                variant="outline"
                size="sm"
                onClick={onProvideDetail}
                className="border-amber-300 text-amber-700 hover:bg-amber-100 flex-shrink-0"
              >
                Add Detail
              </Button>
            )}
          </div>
        )}

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

                {/* QA Score Indicator (when scores available) */}
                {(() => {
                  const scoreDisplay = getScoreDisplay(idx);
                  if (scoreDisplay && !isSelected) {
                    return (
                      <div className="absolute bottom-4 left-4">
                        <span className={`text-xs font-medium ${scoreDisplay.color}`}>
                          {scoreDisplay.label}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}

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
                    <div className="flex items-center gap-3">
                      {/* Show QA feedback when selected */}
                      {qaScores && qaScores[idx]?.feedback && (
                        <span className="text-xs text-slate-400 max-w-[150px] truncate" title={qaScores[idx].feedback}>
                          {qaScores[idx].feedback}
                        </span>
                      )}
                      <span className="text-xs text-brand-600 font-bold">Selected</span>
                    </div>
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
            {getRegenerateText()}
            {regenerationCount > 0 && (
              <span className="text-xs text-slate-400">({regenerationCount})</span>
            )}
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
