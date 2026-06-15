import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { changelogData } from '../changelogData';

const ChangelogModal = ({ onClosed }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica a última versão de changelog vista pelo usuário
    const lastSeenVersion = localStorage.getItem('lastSeenChangelogVersion');
    const currentVersion = changelogData.version;

    if (lastSeenVersion !== currentVersion) {
      // Se ele ainda não viu a versão atual, exibe o modal
      setIsOpen(true);
    } else {
      // Se já viu, podemos fechar silenciosamente e informar ao pai
      if (onClosed) onClosed();
    }
  }, [onClosed]);

  const handleClose = () => {
    // Salva a versão atual como "vista" para não mostrar de novo
    localStorage.setItem('lastSeenChangelogVersion', changelogData.version);
    setIsOpen(false);
    if (onClosed) onClosed();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-[#863bff]/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header Decorativo */}
        <div className="bg-gradient-to-r from-[#863bff] to-[#a061ff] p-6 relative overflow-hidden">
          {/* Brilhos de fundo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Novidades!</h2>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/90 mt-2 font-medium relative z-10">{changelogData.title}</p>
        </div>

        {/* Conteúdo scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-zinc-400 text-sm mb-6">
            Preparamos algumas melhorias incríveis para você nesta versão. Confira o que mudou:
          </p>

          <ul className="space-y-4">
            {changelogData.updates.map((update, index) => (
              <li key={index} className="flex items-start space-x-3 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800/80">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#863bff] shadow-[0_0_8px_#863bff] flex-shrink-0"></div>
                <span className="text-zinc-200 leading-relaxed text-sm">{update}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer / Botão de Ação */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-[#863bff] to-[#a061ff] hover:opacity-90 transition-opacity rounded-xl text-white font-bold text-lg shadow-lg shadow-[#863bff]/20 active:scale-[0.98]"
          >
            Entendi, vamos lá!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
