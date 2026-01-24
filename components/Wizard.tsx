import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Question, RelationshipType, GeneratedCard, DesignOptions, CardFormat, CoverTextPreference } from '../types';
import {
  UNIVERSAL_QUESTIONS,
  PARTNER_QUESTIONS,
  FRIEND_QUESTIONS,
  PARENT_QUESTIONS,
  CHILD_QUESTIONS,
  SIBLING_QUESTIONS,
  PROFESSIONAL_QUESTIONS,
  DATING_QUESTIONS,
  GRANDPARENT_QUESTIONS,
  OTHER_QUESTIONS,
  GENERIC_QUESTIONS,
  // Valentine's Day combos
  VALENTINES_WIFE_QUESTIONS,
  VALENTINES_HUSBAND_QUESTIONS,
  VALENTINES_GIRLFRIEND_QUESTIONS,
  VALENTINES_BOYFRIEND_QUESTIONS,
  VALENTINES_PARTNER_QUESTIONS,
  VALENTINES_CRUSH_QUESTIONS,
  VALENTINES_FRIEND_QUESTIONS,
  // Mother's Day combos
  MOTHERS_DAY_MOM_QUESTIONS,
  MOTHERS_DAY_WIFE_MOM_QUESTIONS,
  MOTHERS_DAY_GRANDMOTHER_QUESTIONS,
  MOTHERS_DAY_MOTHER_IN_LAW_QUESTIONS,
  // Father's Day combos
  FATHERS_DAY_DAD_QUESTIONS,
  FATHERS_DAY_HUSBAND_DAD_QUESTIONS,
  FATHERS_DAY_GRANDFATHER_QUESTIONS,
  FATHERS_DAY_FATHER_IN_LAW_QUESTIONS,
  // Birthday combos
  BIRTHDAY_PARTNER_QUESTIONS,
  BIRTHDAY_CHILD_QUESTIONS,
  BIRTHDAY_FRIEND_QUESTIONS,
  BIRTHDAY_SIBLING_QUESTIONS,
  BIRTHDAY_COWORKER_QUESTIONS,
  BIRTHDAY_MOM_DAD_QUESTIONS,
} from '../constants';
import { Button } from './Button';
import { generateDesignOptions, generateMessageOptions } from '../services/geminiService';
import { getTemplateRecommendations } from '../services/designSystem';
import { MessageSelection } from './MessageSelection';
import { TemplateSelection } from './TemplateSelection';
import { CardFormatSelection } from './CardFormatSelection';
import { CoverTextSelection } from './CoverTextSelection';
import { DesignSelection } from './DesignSelection';

interface WizardProps {
  onComplete: (data: GeneratedCard, answers: Record<string, any>) => void;
  onBackToHome: () => void;
  initialAnswers?: Record<string, any>;
}

type WizardPhase = 'questions' | 'review' | 'messages' | 'templates' | 'cardFormat' | 'coverText' | 'designs' | 'designing';

export const Wizard: React.FC<WizardProps> = ({ onComplete, onBackToHome, initialAnswers = {} }) => {
  const [phase, setPhase] = useState<WizardPhase>('questions');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [questions, setQuestions] = useState<Question[]>(UNIVERSAL_QUESTIONS);
  
  // Message Generation State
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [messageWasEdited, setMessageWasEdited] = useState(false);
  
  // Design Generation State
  const [isGeneratingDesigns, setIsGeneratingDesigns] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [designOptions, setDesignOptions] = useState<DesignOptions | null>(null);
  const [selectedFrontId, setSelectedFrontId] = useState<string | null>(null);
  const [selectedBackId, setSelectedBackId] = useState<string | null>(null);
  const [cardFormat, setCardFormat] = useState<CardFormat | null>(null);
  const [coverTextPreference, setCoverTextPreference] = useState<CoverTextPreference | null>(null);
  
  // Ref for auto-scrolling to input on mobile
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const normalizeRelationshipType = (value: string | undefined) => {
    if (!value) return value;
    if (value === 'Friend') return RelationshipType.Friend;
    if (value === 'Parent') return RelationshipType.Parent;
    if (value === 'Child') return RelationshipType.Child;
    if (value === 'Dating') return RelationshipType.Dating;
    return value;
  };

  useEffect(() => {
    const normalized = { ...initialAnswers };
    if (typeof normalized.relationshipType === 'string') {
      normalized.relationshipType = normalizeRelationshipType(normalized.relationshipType);
    }
    setAnswers(normalized);
    setCurrentStepIndex(0);
    setPhase('questions');
    setGeneratedMessages([]);
    setRegenerationCount(0);
    setSelectedMessage(null);
    setMessageWasEdited(false);
    setSelectedTemplateId(null);
    setDesignOptions(null);
    setSelectedFrontId(null);
    setSelectedBackId(null);
    setCardFormat(null);
    setCoverTextPreference(null);
  }, [initialAnswers]);

  // Dynamic Question Logic - builds question list based on card type + relationship combo
  useEffect(() => {
    const relType = answers['relationshipType'];
    const specialDay = answers['specialDay'];
    const lifeEvent = answers['lifeEvent'];

    let comboQuestions: Question[] = [];
    let branchQuestions: Question[] = [];

    // COMBO-SPECIFIC QUESTIONS (Card Type + Relationship)
    // Valentine's Day combos
    if (specialDay === "Valentine's Day") {
      if (relType === 'Wife') comboQuestions = VALENTINES_WIFE_QUESTIONS;
      else if (relType === 'Husband') comboQuestions = VALENTINES_HUSBAND_QUESTIONS;
      else if (relType === 'Girlfriend') comboQuestions = VALENTINES_GIRLFRIEND_QUESTIONS;
      else if (relType === 'Boyfriend') comboQuestions = VALENTINES_BOYFRIEND_QUESTIONS;
      else if (relType === 'Partner') comboQuestions = VALENTINES_PARTNER_QUESTIONS;
      else if (relType === 'Crush') comboQuestions = VALENTINES_CRUSH_QUESTIONS;
      else if (relType === 'Friend') comboQuestions = VALENTINES_FRIEND_QUESTIONS;
    }
    // Mother's Day combos
    else if (specialDay === "Mother's Day") {
      if (relType === 'Mom') comboQuestions = MOTHERS_DAY_MOM_QUESTIONS;
      else if (relType === 'Wife-Mom') comboQuestions = MOTHERS_DAY_WIFE_MOM_QUESTIONS;
      else if (relType === 'Grandmother') comboQuestions = MOTHERS_DAY_GRANDMOTHER_QUESTIONS;
      else if (relType === 'Mother-in-law') comboQuestions = MOTHERS_DAY_MOTHER_IN_LAW_QUESTIONS;
    }
    // Father's Day combos
    else if (specialDay === "Father's Day") {
      if (relType === 'Dad') comboQuestions = FATHERS_DAY_DAD_QUESTIONS;
      else if (relType === 'Husband-Dad') comboQuestions = FATHERS_DAY_HUSBAND_DAD_QUESTIONS;
      else if (relType === 'Grandfather') comboQuestions = FATHERS_DAY_GRANDFATHER_QUESTIONS;
      else if (relType === 'Father-in-law') comboQuestions = FATHERS_DAY_FATHER_IN_LAW_QUESTIONS;
    }
    // Birthday combos
    else if (lifeEvent === 'Birthday') {
      if (relType === 'Partner') comboQuestions = BIRTHDAY_PARTNER_QUESTIONS;
      else if (relType === 'Child') comboQuestions = BIRTHDAY_CHILD_QUESTIONS;
      else if (relType === 'Friend') comboQuestions = BIRTHDAY_FRIEND_QUESTIONS;
      else if (relType === 'Sibling') comboQuestions = BIRTHDAY_SIBLING_QUESTIONS;
      else if (relType === 'Coworker') comboQuestions = BIRTHDAY_COWORKER_QUESTIONS;
      else if (relType === 'Mom' || relType === 'Dad') comboQuestions = BIRTHDAY_MOM_DAD_QUESTIONS;
    }
    // Generic relationship branches (for non-key card types)
    else if (relType === RelationshipType.Partner) {
      branchQuestions = PARTNER_QUESTIONS;
    } else if (relType === RelationshipType.Friend) {
      branchQuestions = FRIEND_QUESTIONS;
    } else if (relType === RelationshipType.Parent) {
      branchQuestions = PARENT_QUESTIONS;
    } else if (relType === RelationshipType.Child) {
      branchQuestions = CHILD_QUESTIONS;
    } else if (relType === RelationshipType.Sibling) {
      branchQuestions = SIBLING_QUESTIONS;
    } else if (relType === RelationshipType.Professional) {
      branchQuestions = PROFESSIONAL_QUESTIONS;
    } else if (relType === RelationshipType.Dating) {
      branchQuestions = DATING_QUESTIONS;
    } else if (relType === RelationshipType.Grandparent) {
      branchQuestions = GRANDPARENT_QUESTIONS;
    } else if (relType === RelationshipType.Other) {
      branchQuestions = OTHER_QUESTIONS;
    } else if (relType) {
      branchQuestions = GENERIC_QUESTIONS;
    }

    // Merge: Universal + Combo-specific + Branch questions
    const baseIds = new Set(UNIVERSAL_QUESTIONS.map(q => q.id));
    const comboIds = new Set(comboQuestions.map(q => q.id));

    const merged = [
      ...UNIVERSAL_QUESTIONS,
      ...comboQuestions.filter(q => !baseIds.has(q.id)),
      ...branchQuestions.filter(q => !baseIds.has(q.id) && !comboIds.has(q.id))
    ];

    const filtered = merged.filter(q => !q.condition || q.condition(answers));
    setQuestions(filtered);
  }, [answers, answers['relationshipType'], answers['specialDay'], answers['lifeEvent']]);

  useEffect(() => {
    if (currentStepIndex > questions.length - 1) {
      setCurrentStepIndex(Math.max(questions.length - 1, 0));
    }
  }, [questions, currentStepIndex]);

  const currentQuestion = questions[currentStepIndex];
  if (!currentQuestion) {
    return null;
  }

  // Helper to replace [Name] in text
  const formatText = (text: string) => {
    return text.replace('[Name]', answers['name'] || 'them');
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = async () => {
    if (currentStepIndex < questions.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      // Focus logic
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Finish Questions -> Review
      setPhase('review');
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      onBackToHome();
    }
  };

  const handleMessageSelect = (selected: string, isHeavilyEdited: boolean) => {
    setSelectedMessage(selected);
    setMessageWasEdited(isHeavilyEdited);
    setSelectedTemplateId(null);
    setDesignOptions(null);
    setSelectedFrontId(null);
    setSelectedBackId(null);
    setCardFormat(null);
    setCoverTextPreference(null);
    setPhase('templates');
  };

  const handleTemplateConfirm = () => {
    if (!selectedTemplateId) return;
    setPhase('cardFormat');
  };

  const handleCardFormatConfirm = () => {
    if (!cardFormat) return;
    setPhase('coverText');
  };

  const handleCoverTextConfirm = async () => {
    if (!selectedMessage || !selectedTemplateId || !cardFormat || !coverTextPreference) return;
    setDesignOptions(null);
    setSelectedFrontId(null);
    setSelectedBackId(null);
    setIsGeneratingDesigns(true);
    setPhase('designing');
    try {
      const options = await generateDesignOptions(
        answers,
        selectedMessage,
        selectedTemplateId,
        messageWasEdited,
        {
          cardFormat,
          coverTextPreference,
        }
      );
      setDesignOptions(options);
      setSelectedFrontId(options.front[0]?.id || null);
      setSelectedBackId(options.back[0]?.id || null);
      setPhase('designs');
    } catch (e) {
      alert("Failed to generate design options. Please try again.");
      setPhase('coverText');
    } finally {
      setIsGeneratingDesigns(false);
    }
  };

  const handleDesignConfirm = () => {
    if (!designOptions || !selectedMessage || !selectedFrontId || !selectedBackId) return;
    const front = designOptions.front.find((opt) => opt.id === selectedFrontId);
    const back = designOptions.back.find((opt) => opt.id === selectedBackId);
    if (!front || !back) return;
    const { templates } = getTemplateRecommendations(answers);
    const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);

    const card: GeneratedCard = {
      id: crypto.randomUUID(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      message: selectedMessage,
      artPrompt: front.prompt,
      image: front.image,
      backImage: back.image,
      backArtPrompt: back.prompt,
      designTemplateId: selectedTemplateId || undefined,
      designTemplateName: selectedTemplate?.name,
      cardFormat: cardFormat || undefined,
      coverTextPreference: coverTextPreference || undefined,
    };

    onComplete(card, answers);
  };

  const handleRegenerateMessages = async () => {
    const nextCount = regenerationCount + 1;
    setRegenerationCount(nextCount);
    setIsGeneratingMessages(true);
    try {
      const messages = await generateMessageOptions(answers, nextCount, generatedMessages);
      setGeneratedMessages(messages);
    } catch (error) {
      console.error('Failed to regenerate messages:', error);
      alert('Failed to generate new messages. Please try again.');
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const hasAnswer = (value: any) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  };

  const answeredQuestions = questions.filter(q => hasAnswer(answers[q.id]));
  const answeredCount = answeredQuestions.length;
  const personalizationPercent = questions.length > 0
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const renderAnswer = (value: any) => {
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'string') return value;
    return value ? String(value) : 'Skipped';
  };

  // --------------------------------------------------------
  // PHASE: Message Selection
  // --------------------------------------------------------
  if (phase === 'messages') {
    return (
      <MessageSelection 
        messages={generatedMessages}
        onSelect={handleMessageSelect}
        onRegenerate={handleRegenerateMessages}
        isLoading={isGeneratingMessages}
      />
    );
  }

  // --------------------------------------------------------
  // PHASE: Template Selection
  // --------------------------------------------------------
  if (phase === 'templates') {
    const { category, templates } = getTemplateRecommendations(answers);
    return (
      <TemplateSelection
        categoryLabel={category.label}
        categoryDescription={category.description}
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onSelect={(templateId) => setSelectedTemplateId(templateId)}
        onConfirm={handleTemplateConfirm}
        onBack={() => setPhase('messages')}
        isLoading={isGeneratingDesigns}
      />
    );
  }

  // --------------------------------------------------------
  // PHASE: Card Format Selection
  // --------------------------------------------------------
  if (phase === 'cardFormat') {
    const { templates } = getTemplateRecommendations(answers);
    const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
    return (
      <CardFormatSelection
        selectedFormat={cardFormat}
        onSelect={(format) => setCardFormat(format)}
        onConfirm={handleCardFormatConfirm}
        onBack={() => setPhase('templates')}
        isLoading={isGeneratingDesigns}
        templateName={selectedTemplate?.name}
      />
    );
  }

  // --------------------------------------------------------
  // PHASE: Cover Text Preference
  // --------------------------------------------------------
  if (phase === 'coverText') {
    const { templates } = getTemplateRecommendations(answers);
    const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
    return (
      <CoverTextSelection
        selectedPreference={coverTextPreference}
        onSelect={(preference) => setCoverTextPreference(preference)}
        onConfirm={handleCoverTextConfirm}
        onBack={() => setPhase('cardFormat')}
        isLoading={isGeneratingDesigns}
        cardFormat={cardFormat}
        templateName={selectedTemplate?.name}
      />
    );
  }

  // --------------------------------------------------------
  // PHASE: Design Selection
  // --------------------------------------------------------
  if (phase === 'designs' || phase === 'designing') {
    return (
      <DesignSelection
        frontOptions={designOptions?.front || []}
        backOptions={designOptions?.back || []}
        selectedFrontId={selectedFrontId}
        selectedBackId={selectedBackId}
        onSelectFront={(id) => setSelectedFrontId(id)}
        onSelectBack={(id) => setSelectedBackId(id)}
        onConfirm={handleDesignConfirm}
        onBack={() => setPhase('coverText')}
        isLoading={isGeneratingDesigns}
        messagePreview={selectedMessage || undefined}
        cardFormat={cardFormat}
        coverTextPreference={coverTextPreference}
      />
    );
  }

  // --------------------------------------------------------
  // PHASE: Review
  // --------------------------------------------------------
  if (phase === 'review') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">Review your details</h2>
            <p className="text-slate-500">
              {personalizationPercent}% personalized based on {answeredCount} details.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {answeredQuestions.map((question, index) => {
              const questionIndex = questions.findIndex((q) => q.id === question.id);
              return (
                <div key={question.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Step {index + 1}</div>
                    <div className="font-medium text-slate-900">{formatText(question.text)}</div>
                    <div className="text-sm text-slate-500 mt-1">{renderAnswer(answers[question.id])}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setPhase('questions');
                      setCurrentStepIndex(questionIndex);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setPhase('questions')}>
              Back
            </Button>
            <Button
              size="lg"
              onClick={async () => {
                setIsGeneratingMessages(true);
                try {
                  setRegenerationCount(0);
                  const messages = await generateMessageOptions(answers, 0, []);
                  setGeneratedMessages(messages);
                  setPhase('messages');
                } catch (error) {
                  console.error('Failed to generate messages:', error);
                  alert('Failed to generate messages. Please try again.');
                } finally {
                  setIsGeneratingMessages(false);
                }
              }}
              isLoading={isGeneratingMessages}
            >
              Reveal Messages <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // PHASE: Questions (Wizard)
  // --------------------------------------------------------
  const progress = ((currentStepIndex + 1) / questions.length) * 100;

  // Render Input Helper
  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            className="w-full text-2xl border-b-2 border-slate-300 py-2 focus:outline-none focus:border-brand-500 bg-transparent transition-colors placeholder-slate-300"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && answers[currentQuestion.id] && handleNext()}
            autoFocus
          />
        );
      case 'textarea':
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="w-full text-xl border-2 border-slate-200 rounded-xl p-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white transition-all min-h-[150px] placeholder-slate-300"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            autoFocus
          />
        );
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  handleAnswer(opt.value);
                  // Auto advance for single select grid
                  setTimeout(() => {
                    if (currentStepIndex < questions.length - 1) {
                      setCurrentStepIndex(prev => prev + 1);
                    }
                  }, 200);
                }}
                className={`p-6 rounded-xl border-2 text-left transition-all flex flex-col items-center justify-center gap-2 hover:border-brand-300 hover:bg-brand-50
                  ${answers[currentQuestion.id] === opt.value 
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500 text-brand-900' 
                    : 'border-slate-200 bg-white text-slate-600'}`}
              >
                <span className="text-3xl">{opt.icon}</span>
                <span className="font-medium text-center">{opt.label}</span>
              </button>
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="flex flex-col gap-3">
            {currentQuestion.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  handleAnswer(opt.value);
                  setTimeout(() => setCurrentStepIndex(prev => prev + 1), 100);
                }}
                className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                  ${answers[currentQuestion.id] === opt.value 
                    ? 'border-brand-500 bg-brand-50 text-brand-900' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200'}`}
              >
                {opt.icon && <span className="text-xl">{opt.icon}</span>}
                <span className="font-medium">{opt.label}</span>
                {answers[currentQuestion.id] === opt.value && <Check size={16} className="ml-auto text-brand-500" />}
              </button>
            ))}
          </div>
        );
      case 'pills':
        return (
          <div className="flex flex-wrap gap-3">
             {currentQuestion.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  handleAnswer(opt.value);
                  setTimeout(() => setCurrentStepIndex(prev => prev + 1), 100);
                }}
                className={`px-6 py-3 rounded-full border-2 font-medium transition-all
                  ${answers[currentQuestion.id] === opt.value 
                    ? 'border-brand-500 bg-brand-500 text-white' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );
      case 'multiselect':
        const selected = (answers[currentQuestion.id] as string[]) || [];
        const maxSelections = typeof currentQuestion.maxSelections === 'number'
          ? currentQuestion.maxSelections
          : Number.POSITIVE_INFINITY;
        const toggleSelection = (val: string) => {
          if (selected.includes(val)) {
            handleAnswer(selected.filter(v => v !== val));
          } else {
            if (selected.length < maxSelections) {
               handleAnswer([...selected, val]);
            }
          }
        };
        return (
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {currentQuestion.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleSelection(opt.value)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3
                  ${selected.includes(opt.value)
                    ? 'border-brand-500 bg-brand-50 text-brand-900' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200'}`}
              >
                <span className="text-xl">{opt.icon}</span>
                <span className="font-medium">{opt.label}</span>
                {selected.includes(opt.value) && <Check size={16} className="ml-auto text-brand-500" />}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const isCurrentValid = !currentQuestion.required || 
    (answers[currentQuestion.id] && 
      (Array.isArray(answers[currentQuestion.id]) 
        ? answers[currentQuestion.id].length > 0 
        : true));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Panel - Question Flow */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="text-slate-500" />
          </button>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Step {currentStepIndex + 1} of {questions.length}
          </div>
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
          {personalizationPercent}% personalized so far
        </div>

        {/* Question Content */}
        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
           {/* Progress Bar for Mobile */}
           <div className="w-full bg-slate-200 h-1 mb-8 rounded-full md:hidden">
              <div 
                className="bg-brand-500 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>

           {currentQuestion.eyebrow && (
             <span className="text-brand-600 font-medium mb-3 block animate-fade-in">
               {currentQuestion.eyebrow}
             </span>
           )}
           
           <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8 leading-tight">
             {formatText(currentQuestion.text)}
           </h2>

           <div className="mb-8">
             {renderInput()}
           </div>

           <div className="flex items-center gap-4 mt-auto md:mt-0">
              {!currentQuestion.required && (
                <Button variant="outline" onClick={handleNext}>
                  Skip if nothing comes to mind
                </Button>
              )}
              <Button 
                onClick={handleNext} 
                disabled={!isCurrentValid}
                isLoading={isGeneratingMessages}
                className="w-full md:w-auto ml-auto"
                size="lg"
              >
                {currentStepIndex === questions.length - 1 ? (
                  <>Review <Sparkles className="w-4 h-4 ml-2" /></>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
           </div>
        </div>
      </div>

      {/* Right Panel - Dynamic Preview (Desktop Only) */}
      <div className="hidden md:flex w-1/2 bg-slate-900 text-white p-12 flex-col relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6 border-b border-white/10 pb-4">
               <h3 className="text-xs uppercase tracking-widest text-brand-300 font-bold mb-2">Building your card for</h3>
               <p className="text-2xl font-serif">{answers['name'] || '...'}</p>
            </div>
            
            <div className="space-y-4">
               {answers['relationshipType'] && (
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-300">Relationship</span>
                   <span className="font-medium">{answers['relationshipType']}</span>
                 </div>
               )}
               {answers['occasion'] && (
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-300">Occasion</span>
                   <span className="font-medium">{answers['occasion']}</span>
                 </div>
               )}
               {answers['vibe'] && (
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-300">Vibe</span>
                   <span className="font-medium">
                     {Array.isArray(answers['vibe']) ? answers['vibe'].join(', ') : answers['vibe']}
                   </span>
                 </div>
               )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
               <p className="text-sm text-slate-300 italic text-center">
                 "We're crafting a unique design and message based on {Object.keys(answers).length} details you've provided."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
