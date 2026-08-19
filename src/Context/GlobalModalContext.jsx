import React, { createContext, useContext, useState, useCallback } from 'react';

const GlobalModalContext = createContext();

export const useGlobalModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};

export const GlobalModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'alert', // 'alert', 'confirm', 'prompt'
    title: '',
    message: '',
    isDestructive: false,
    placeholder: '',
    defaultValue: '',
    resolvePromise: null,
  });

  const showModal = useCallback(({ type, title, message, isDestructive = false, placeholder = '', defaultValue = '' }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: type || 'alert',
        title: title || (type === 'alert' ? 'Notification' : type === 'confirm' ? 'Confirmation' : 'Input Required'),
        message: message || '',
        isDestructive,
        placeholder,
        defaultValue,
        resolvePromise: resolve,
      });
    });
  }, []);

  const closeModal = useCallback((result) => {
    setModalState((prev) => {
      if (prev.resolvePromise) prev.resolvePromise(result);
      return { ...prev, isOpen: false, resolvePromise: null };
    });
  }, []);

  return (
    <GlobalModalContext.Provider value={{ showModal, modalState, closeModal }}>
      {children}
    </GlobalModalContext.Provider>
  );
};
