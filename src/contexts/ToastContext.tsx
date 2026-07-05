import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ToastContextType {
  toastMessage: string | null;
  isCopiedId: string | null;
  showToast: (message: string) => void;
  handleCopyText: (text: string, id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const handleCopyText = useCallback((text: string, id: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopiedId(id);
          setTimeout(() => setIsCopiedId(null), 3000);
          showToast('Copiado para a área de transferência!');
        })
        .catch(() => showToast('Erro ao copiar texto.'));
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopiedId(id);
        setTimeout(() => setIsCopiedId(null), 3000);
        showToast('Copiado para a área de transferência!');
      } catch (err) {
        showToast('Erro ao copiar texto.');
      }
      document.body.removeChild(textArea);
    }
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toastMessage, isCopiedId, showToast, handleCopyText }}>
      {children}
    </ToastContext.Provider>
  );
}
