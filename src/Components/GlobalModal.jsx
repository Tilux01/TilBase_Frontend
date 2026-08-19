import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { useGlobalModal } from '../Context/GlobalModalContext';

const GlobalModal = () => {
  const { modalState, closeModal } = useGlobalModal();
  const [inputValue, setInputValue] = useState('');

  // Reset input when modal opens/changes
  useEffect(() => {
    if (modalState.isOpen && modalState.type === 'prompt') {
      setInputValue(modalState.defaultValue || '');
    }
  }, [modalState.isOpen, modalState.type, modalState.defaultValue]);

  if (!modalState.isOpen) return null;

  const { type, title, message, isDestructive, placeholder } = modalState;

  const handleConfirm = () => {
    if (type === 'prompt') {
      closeModal(inputValue);
    } else {
      closeModal(true); // alert returns true, confirm returns true
    }
  };

  const handleCancel = () => {
    if (type === 'prompt') {
      closeModal(null);
    } else if (type === 'confirm') {
      closeModal(false);
    }
  };

  let Icon = Info;
  let iconColor = "text-blue-500";
  let iconBg = "bg-blue-500/10";
  let confirmText = "OK";
  let cancelText = "Cancel";

  if (type === 'confirm' && isDestructive) {
    Icon = AlertTriangle;
    iconColor = "text-red-500";
    iconBg = "bg-red-500/10";
    confirmText = "Yes, Delete";
  } else if (type === 'confirm') {
    Icon = CheckCircle2;
    iconColor = "text-primary";
    iconBg = "bg-primary-container";
    confirmText = "Confirm";
  } else if (type === 'prompt') {
    Icon = Info;
    iconColor = "text-secondary";
    iconBg = "bg-secondary-container";
    confirmText = "Submit";
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
        onClick={type !== 'alert' ? handleCancel : () => closeModal(true)}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-surface-container-lowest dark:bg-[#111827] border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} mb-2`}>
              <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2.5} />
            </div>
            {type !== 'alert' && (
              <button 
                onClick={handleCancel}
                className="text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-highest p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6 whitespace-pre-wrap">{message}</p>

            {type === 'prompt' && (
              <div className="mb-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder || "Enter value..."}
                  className="w-full bg-surface-container border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-surface-container/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-black/5 dark:border-white/5">
            {type !== 'alert' && (
              <button 
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
              >
                {cancelText}
              </button>
            )}
            
            <button 
              onClick={handleConfirm}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                isDestructive && type === 'confirm'
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                  : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalModal;
