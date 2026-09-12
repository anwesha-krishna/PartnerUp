import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'sparkle':
        return <Sparkles className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    }
  };

  const getBorderTheme = () => {
    switch (type) {
      case 'sparkle':
        return 'border-amber-500/40 bg-slate-900/95 shadow-amber-500/10';
      case 'info':
        return 'border-indigo-500/40 bg-slate-900/95 shadow-indigo-500/10';
      case 'warning':
        return 'border-rose-500/40 bg-slate-900/95 shadow-rose-500/10';
      default:
        return 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-white text-xs font-semibold shadow-2xl backdrop-blur-md ${getBorderTheme()}`}>
        {getIcon()}
        <span className="max-w-xs">{message}</span>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
