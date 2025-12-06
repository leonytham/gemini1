import React, { useState, useEffect, useCallback } from 'react';
import SparkleCanvas from './components/SparkleCanvas';
import Controls from './components/Controls';
import { AppState, ThemeColor } from './types';
import { Share2, Check } from 'lucide-react';

const DEFAULT_STATE: AppState = {
  message: "Sparkle & Shine",
  subMessage: "Move your mouse to spread the magic",
  primaryColor: ThemeColor.DeepPink,
  secondaryColor: '#ffffff'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isSharedMode, setIsSharedMode] = useState(false);

  // Load state from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = JSON.parse(atob(hash));
        setState({ ...DEFAULT_STATE, ...decoded });
        setIsSharedMode(true);
      } catch (e) {
        console.error("Failed to parse state from URL");
        // Clear invalid hash
        window.history.replaceState(null, '', ' ');
      }
    }
  }, []);

  const handleUpdate = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const handleShare = useCallback(() => {
    const json = JSON.stringify(state);
    const hash = btoa(json);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
  }, [state]);

  const handleInteractionStart = () => setIsInteracting(true);
  const handleInteractionEnd = () => setIsInteracting(false);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden selection:bg-pink-500/30"
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      <SparkleCanvas 
        primaryColor={state.primaryColor}
        secondaryColor={state.secondaryColor}
        isInteracting={isInteracting}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center z-10">
        <h1 
            className="font-script text-6xl md:text-8xl lg:text-9xl mb-4 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse"
            style={{ color: state.primaryColor, textShadow: `0 0 30px ${state.primaryColor}80` }}
        >
          {state.message}
        </h1>
        <p className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-md backdrop-blur-sm px-4 py-2 rounded-full bg-black/10">
          {state.subMessage}
        </p>
      </div>

      <div className="pointer-events-auto">
        <Controls 
          state={state} 
          onUpdate={handleUpdate} 
          onShare={handleShare} 
          isSharedMode={isSharedMode}
        />
      </div>

      {/* Toast Notification */}
      <div 
        className={`fixed top-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-medium transition-all duration-500 z-50 ${showCopiedToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}
      >
        <div className="bg-green-100 text-green-600 p-1 rounded-full">
            <Check className="w-4 h-4" />
        </div>
        Link copied to clipboard!
      </div>
    </div>
  );
};

export default App;