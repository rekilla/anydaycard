import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, X } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Refs for audio handling
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setError(null);
    setStatus('connecting');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputContext = new AudioContextClass({ sampleRate: 16000 });
      const outputContext = new AudioContextClass({ sampleRate: 24000 });
      
      inputContextRef.current = inputContext;
      audioContextRef.current = outputContext;

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are a creative and warm greeting card consultant for AnyDayCard. 
          Your goal is to help the user brainstorm ideas for a card. 
          Ask them who they want to send a card to, what the occasion is, and help them find the right "vibe". 
          Keep your responses concise, encouraging, and conversational.`,
        },
        callbacks: {
          onopen: () => {
            console.log('Live Session Opened');
            setStatus('listening');
            setIsActive(true);

            // Setup Input Stream
            const source = inputContext.createMediaStreamSource(stream);
            const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContext.destination);
            
            processorRef.current = scriptProcessor;
            sourceRef.current = source;
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio) {
              setStatus('speaking');
              const ctx = audioContextRef.current;
              if (!ctx) return;

              // Ensure seamless playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                  setStatus('listening');
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
              console.log('Interrupted');
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }
          },
          onclose: () => {
            console.log('Live Session Closed');
            stopSession();
          },
          onerror: (e) => {
            console.error('Live Session Error', e);
            setError("Connection error");
            stopSession();
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start live session", err);
      setError("Could not access microphone or connect.");
      setStatus('idle');
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('idle');
    
    // Close session if possible (wrapper specific, but here we cleanup streams)
    if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close && s.close());
    }

    // Stop Microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Disconnect Audio Nodes
    if (sourceRef.current) sourceRef.current.disconnect();
    if (processorRef.current) processorRef.current.disconnect();

    // Close Contexts
    if (inputContextRef.current) inputContextRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    
    // Reset Refs
    inputContextRef.current = null;
    audioContextRef.current = null;
    sourceRef.current = null;
    processorRef.current = null;
    sessionRef.current = null;
    nextStartTimeRef.current = 0;
    sourcesRef.current.clear();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2">
              <Sparkles className="text-yellow-300" size={20} />
              Brainstorm with AI
            </h3>
            <p className="text-indigo-100 text-sm max-w-xs">
              Not sure what to write? Chat with our voice assistant to get inspired before you start.
            </p>
          </div>
          {isActive && (
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${status === 'speaking' ? 'bg-green-400 animate-pulse' : 'bg-white'}`}></div>
              <span className="text-xs font-bold uppercase tracking-wider">
                {status === 'connecting' ? 'Connecting...' : status === 'speaking' ? 'AI Speaking' : 'Listening'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isActive ? (
            <button
              onClick={startSession}
              className="group flex items-center gap-3 bg-white text-indigo-600 px-6 py-4 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
            >
              <div className="bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-200 transition-colors">
                 <Mic size={24} />
              </div>
              Start Voice Chat
            </button>
          ) : (
             <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-16 bg-black/20 rounded-xl flex items-center justify-center gap-1 px-4">
                   {/* Fake visualizer bars */}
                   {[...Array(8)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 bg-white/80 rounded-full transition-all duration-75 ${status !== 'idle' ? 'animate-pulse' : ''}`}
                        style={{ 
                          height: status === 'speaking' || status === 'listening' 
                            ? `${Math.random() * 24 + 8}px` 
                            : '4px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                   ))}
                </div>
                <button
                  onClick={stopSession}
                  className="bg-red-500/80 hover:bg-red-600 text-white p-4 rounded-full transition-all shadow-lg hover:scale-105"
                  title="End Chat"
                >
                  <MicOff size={24} />
                </button>
             </div>
          )}
        </div>
        
        {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <X size={14} /> {error}
            </div>
        )}
      </div>
    </div>
  );
};