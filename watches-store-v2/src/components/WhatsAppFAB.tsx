import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { whatsappHref } from '../config/client-config';

export function WhatsAppFAB(): JSX.Element {
  const handleClick = (): void => {
    toast.success('Opening WhatsApp...');
  };

  return (
    <motion.a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lg shadow-[#128C7E]/30 transition-transform hover:scale-110 hover:bg-[#075E54] focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:ring-offset-2 focus:ring-offset-brand-bg"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', repeatDelay: 1 }}
      >
        <MessageCircle className="h-7 w-7 text-white" aria-hidden />
      </motion.div>
    </motion.a>
  );
}
