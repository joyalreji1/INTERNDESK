import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* University Modal Window */}
      <div
        className={`relative w-full ${widthClasses[maxWidth]} bg-white border border-[#D4DCE6] rounded-sm shadow-md z-10 overflow-hidden max-h-[90vh] flex flex-col`}
      >
        {/* Blue Header Strip */}
        <div className="bg-[#356F9D] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#28587E]">
          <div>
            <h3 className="text-sm font-bold tracking-wide">{title}</h3>
            {description && <p className="text-xs text-[#EAF2FC] mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#EAF2FC] hover:text-white hover:bg-[#28587E] p-1 rounded-sm transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto text-sm text-[#333333] space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
