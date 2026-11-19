import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  triggerRef,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Focus first element when modal opens
  useEffect(() => {
    if (!isOpen || !panelRef.current) {
      return undefined;
    }
    const focusable =
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable[0]?.focus();
    return undefined;
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
    // Return focus to the trigger after close animation
    setTimeout(() => triggerRef.current?.focus(), 200);
  }, [onClose, triggerRef]);

  // Escape + focus trap
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      );
      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          {/* Backdrop — tabIndex=-1 keeps it out of focus order; Escape handles keyboard close */}
          <motion.button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={handleClose}
            className="absolute inset-0 w-full h-full cursor-default bg-black/60 border-0 p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Panel: full-screen on mobile, centered card on sm+ */}
          <motion.div
            ref={panelRef}
            className="relative w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] bg-white overflow-y-auto sm:mx-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-6 right-6 z-10 p-1 text-black hover:opacity-60 transition-opacity"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="pt-16 pb-16 px-8 sm:px-14">
              <h2
                id="contact-modal-title"
                className="font-savoyBold text-2xl lg:text-3xl mb-10"
              >
                {title}
              </h2>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
