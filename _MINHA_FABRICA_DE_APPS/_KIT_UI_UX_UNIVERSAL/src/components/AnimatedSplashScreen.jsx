import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const AnimatedSplashScreen = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Inicia o fade out após 2.2 segundos
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    // Remove o componente totalmente após 2.5 segundos (tempo do fade terminar)
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Brilhos de Fundo para dar o visual premium */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#863bff]/20 rounded-full blur-[80px]"></div>

      {/* Container principal */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo pulsante */}
        <div className="w-32 h-32 mb-8 animate-pulse shadow-[0_0_40px_rgba(134,59,255,0.3)] rounded-3xl overflow-hidden flex items-center justify-center bg-zinc-900 border border-zinc-800">
          {/* Logo Universal: pega a logo padrão do PWA (favicon ou icon) */}
          <img 
            src="/icon-192x192.png" 
            alt="App Logo" 
            className="w-24 h-24 object-contain animate-in zoom-in duration-1000"
            onError={(e) => {
              // Fallback caso a imagem não exista
              e.target.src = '/favicon.svg';
            }}
          />
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300 fill-mode-both">
          <Loader2 className="w-8 h-8 text-[#863bff] animate-spin" />
          <p className="text-zinc-400 font-medium tracking-widest text-sm uppercase">Carregando...</p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSplashScreen;
