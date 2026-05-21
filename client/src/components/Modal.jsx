import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {

  if (!isOpen) return null;
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true" 
      />

      <div
        className="relative z-10 bg-white rounded-lg shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()} 
      >
      
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 id="modal-title" className="text-xl font-semibold mb-4 pr-10">{title}</h2>
        <div>{children}</div>
        
      </div>
    </div>
  );
}