import React, { useState } from 'react';
import { GeneratedCard } from '../types';
import { RefreshCw, Edit2, ShoppingBag, RotateCw } from 'lucide-react';
import { Button } from './Button';

interface CardPreviewProps {
  card: GeneratedCard;
  onRegenerate: () => void;
  onCheckout: () => void;
  onChangeVibe: () => void;
  onStartOver: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ 
  card, 
  onRegenerate, 
  onCheckout, 
  onChangeVibe, 
  onStartOver 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(card.message);
  const productLabel = card.cardFormat === 'single-card'
    ? 'Premium Single Card'
    : card.cardFormat === 'book-open'
      ? 'Premium Book Open Card'
      : 'Premium Folded Card';
  const messageSideLabel = card.cardFormat === 'single-card' ? 'Back' : 'Inside';

  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-slate-900">Your Card</h2>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
            </Button>
            <Button variant="outline" size="sm" onClick={onChangeVibe}>
                <Edit2 className="w-4 h-4 mr-2" /> Change vibe
            </Button>
            <Button variant="outline" size="sm" onClick={onStartOver}>
                <RotateCw className="w-4 h-4 mr-2" /> Start over
            </Button>
        </div>
      </div>

      {/* Card Stage */}
      <div className="perspective-[1500px] w-full max-w-md aspect-[1/1.4] mb-8 relative group">
        <div 
            className={`card-inner w-full h-full relative transition-all duration-700 transform-style-3d shadow-2xl cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
            onClick={!isEditing ? toggleFlip : undefined}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Front */}
            <div className="card-front absolute w-full h-full backface-hidden rounded-lg overflow-hidden bg-white shadow-xl">
                {/* Texture Overlay */}
                <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply pointer-events-none z-10"></div>
                
                <img 
                    src={card.image} 
                    alt={card.artPrompt} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-600 z-20">
                    Front
                </div>
            </div>

            {/* Back (Inside) */}
            <div className="card-back absolute w-full h-full backface-hidden rounded-lg bg-[#fffdf9] p-8 md:p-12 shadow-xl flex flex-col justify-center items-center transform rotate-y-180 overflow-hidden" style={{ transform: 'rotateY(180deg)' }}>
                {card.backImage && (
                  <img
                    src={card.backImage}
                    alt="Back design"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-white/70"></div>
                {/* Paper Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-center">
                    {isEditing ? (
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-full bg-transparent border-2 border-dashed border-slate-300 rounded p-4 font-serif text-lg leading-relaxed focus:outline-none focus:border-brand-400 resize-none"
                            onClick={(e) => e.stopPropagation()} // Prevent flip when clicking text area
                        />
                    ) : (
                        <p className="font-serif text-xl md:text-2xl leading-relaxed text-slate-800 whitespace-pre-wrap text-center">
                            {message}
                        </p>
                    )}
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600 z-20 flex items-center gap-1">
                    {messageSideLabel}
                </div>
            </div>
        </div>
        
        {/* Flip Hint */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-slate-500 text-sm flex items-center gap-2 animate-bounce">
            <RotateCw size={16} /> Tap card to flip
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                    setIsFlipped(true); // Ensure we are looking at text
                    setIsEditing(!isEditing);
                }}
              >
                  <Edit2 className="w-4 h-4 mr-2" /> {isEditing ? 'Save Text' : 'Edit Text'}
              </Button>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600 font-medium">{productLabel}</span>
                  <span className="text-xl font-bold font-serif">$12.00</span>
              </div>
              <Button className="w-full" size="lg" onClick={onCheckout}>
                  <ShoppingBag className="w-4 h-4 mr-2" /> Checkout & Send
              </Button>
              <p className="text-xs text-center text-slate-400 mt-3">
                  Includes premium envelope, printing, and shipping.
              </p>
          </div>
      </div>
    </div>
  );
};
