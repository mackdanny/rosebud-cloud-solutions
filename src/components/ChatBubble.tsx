import { motion } from 'framer-motion';

interface ChatBubbleProps {
  readonly onClick: () => void;
  readonly isOpen: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg md:bottom-8 md:right-8"
      style={{
        background: 'linear-gradient(135deg, #A000B5, #d946ef)',
        boxShadow: '0 4px 20px rgba(160, 0, 181, 0.4)',
      }}
      aria-label="Open chat assistant"
    >
      <span className="material-symbols-outlined text-2xl text-white">chat_bubble</span>

      {/* Pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ border: '2px solid rgba(160, 0, 181, 0.5)' }}
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: [1, 1.5, 1.5], opacity: [0, 0.4, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          delay: 3,
        }}
      />
    </motion.button>
  );
};
