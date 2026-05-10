import React from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappHref } from '../config/client-config';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export function WhatsAppFAB(): JSX.Element {
  const handleClick = (): void => {
    toast.success('Connecting to WhatsApp...');
  };

  return (
    <motion.a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 1
      }}
      className="group fixed bottom-6 right-4 z-50 md:right-6"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute inset-0 animate-pulse-slow rounded-full bg-[#25D366] opacity-60 blur-md transition-opacity group-hover:opacity-100"></div>
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl md:transition-transform md:duration-300 md:group-hover:scale-110">
        <MessageCircle className="h-7 w-7 shrink-0" aria-hidden />
      </div>
    </motion.a>
  );
}
