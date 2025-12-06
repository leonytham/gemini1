import React, { useState } from 'react';
import { AppState, ThemeColor } from '../types';
import { generateLoveNote } from '../services/geminiService';
import { Share2, Wand2, Palette, Type, X, Heart } from 'lucide-react';

interface ControlsProps {
  state: AppState;
  onUpdate: (newState: Partial<AppState>) => void;
  onShare: () => void;
  isSharedMode: boolean;
}

const Controls: React.FC<ControlsProps> = ({ state, onUpdate, onShare, isSharedMode }) => {
  const [isOpen, setIsOpen] = useState(!isSharedMode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'style'>('text');

  const handleAI = async (tone: string) => {
    setIsGenerating(true);
    const message = await generateLoveNote(tone);
    onUpdate({ message });
    setIsGenerating(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-white/20 transition-all shadow-lg animate-bounce"
      >
        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full sm:w-[400px] sm:bottom-6 sm:left-6 z-20">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
          <h2 className="font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            Customize Heart
          </h2>
          <button onClick={() => setIsOpen(false)} className="hover:text-white text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab('text')}
            className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'text' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Type className="w-4 h-4" /> Message
          </button>
          <button 
             onClick={() => setActiveTab('style')}
             className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'style' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Palette className="w-4 h-4" /> Colors
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 overflow-y-auto">
          
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-bold">Main Message</label>
                <textarea 
                  value={state.message}
                  onChange={(e) => onUpdate({ message: e.target.value })}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[80px]"
                  placeholder="Enter your message..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-bold">Sub Message</label>
                <input 
                  type="text"
                  value={state.subMessage}
                  onChange={(e) => onUpdate({ subMessage: e.target.value })}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="From..."
                />
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                  <Wand2 className="w-3 h-3" /> AI Generator (Gemini)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {['Romantic', 'Funny', 'Poetic'].map((tone) => (
                    <button
                      key={tone}
                      disabled={isGenerating}
                      onClick={() => handleAI(tone)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-md py-2 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? '...' : tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-3 font-bold">Theme Presets</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(ThemeColor).map(([name, color]) => (
                    <button
                      key={name}
                      onClick={() => onUpdate({ primaryColor: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${state.primaryColor === color ? 'border-white ring-2 ring-white/20' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      title={name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-3 font-bold">Custom Mix</label>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Primary</label>
                        <input 
                            type="color" 
                            value={state.primaryColor}
                            onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                            className="w-full h-10 rounded-lg cursor-pointer bg-transparent"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Secondary</label>
                         <input 
                            type="color" 
                            value={state.secondaryColor}
                            onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                            className="w-full h-10 rounded-lg cursor-pointer bg-transparent"
                        />
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-800/50">
          <button 
            onClick={onShare}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-pink-500/20 active:scale-95"
          >
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>

      </div>
    </div>
  );
};

export default Controls;