import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../hooks/useChatbot';

interface ChatPanelProps {
  readonly messages: ChatMessage[];
  readonly onSend: (content: string) => Promise<void>;
  readonly onClose: () => void;
  readonly isStreaming: boolean;
  readonly error: string | null;
  readonly hasInteracted: boolean;
}

const QUICK_ACTIONS = [
  { label: 'Our Services', message: 'What services does Rosebud Cloud Solutions offer?' },
  { label: 'Case Studies', message: 'Can you tell me about your case studies?' },
  { label: 'How We Work', message: 'How does an engagement with RCS typically work?' },
  { label: 'Get in Touch', message: "I'd like to speak with someone from the team." },
];

const GREETING =
  "Hi! I'm Rosebud's AI assistant. I can help you explore our cloud services, case studies, and how we work. What would you like to know?";

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSend,
  onClose,
  isStreaming,
  error,
  hasInteracted,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed bottom-6 right-6 z-50 flex w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:w-[420px] md:bottom-8 md:right-8"
      style={{
        height: 'min(640px, calc(100vh - 6rem))',
        background: '#0F1435',
        borderColor: 'rgba(160, 0, 181, 0.2)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
      }}
      role="dialog"
      aria-label="Chat with Rosebud Assistant"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(160, 0, 181, 0.2)' }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: 'linear-gradient(135deg, #A000B5, #d946ef)' }}
        >
          <span className="text-sm text-white">✦</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-headline)' }}>
            Rosebud Assistant
          </div>
          <div className="text-xs text-[#b0bec5]">AI-powered · Typically instant</div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#b0bec5] transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close chat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" style={{ background: '#0B0F2A' }}>
        {/* Greeting */}
        <BotMessage content={GREETING} />

        {/* Quick action chips */}
        {!hasInteracted && (
          <div className="mt-3 flex flex-wrap gap-2 pl-8">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => onSend(action.message)}
                disabled={isStreaming}
                className="cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-[rgba(160,0,181,0.2)] disabled:opacity-50"
                style={{
                  background: 'rgba(160, 0, 181, 0.12)',
                  borderColor: 'rgba(160, 0, 181, 0.3)',
                  color: '#d946ef',
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Conversation */}
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <UserMessage key={i} content={msg.content} />
          ) : (
            <BotMessage key={i} content={msg.content} isStreaming={isStreaming && i === messages.length - 1} />
          ),
        )}

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid #1a1f4a' }}>
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            maxLength={1000}
            className="max-h-20 flex-1 resize-none rounded-2xl border px-3.5 py-2 text-sm text-white placeholder-[#b0bec5] outline-none"
            style={{
              background: '#0F1435',
              borderColor: '#2D345B',
            }}
            disabled={isStreaming}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isStreaming}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity disabled:cursor-default disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #A000B5, #d946ef)' }}
            aria-label="Send message"
          >
            <span className="material-symbols-outlined text-base text-white">arrow_upward</span>
          </button>
        </div>
        <div className="mt-1.5 text-center text-[10px] text-[#4a5178]">Powered by Claude AI</div>
      </div>
    </motion.div>
  );
};

function formatInline(text: string, keyOffset: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = keyOffset;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={key++} className="font-semibold">{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function formatMessage(text: string): React.ReactNode[] {
  const paragraphs = text.split(/\n\n+/);
  if (paragraphs.length <= 1) {
    return formatInline(text, 0);
  }
  return paragraphs.map((p, i) => (
    <p key={i} className={i > 0 ? 'mt-2' : ''}>
      {formatInline(p, i * 100)}
    </p>
  ));
}

function BotMessage({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  return (
    <div className="mt-3 flex gap-2">
      <div
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'linear-gradient(135deg, #A000B5, #d946ef)' }}
      >
        <span className="text-[10px] text-white">✦</span>
      </div>
      <div
        className="rounded-bl-xl rounded-br-xl rounded-tr-xl border px-3 py-2.5 text-sm leading-relaxed text-white"
        style={{
          background: '#0F1435',
          borderColor: '#1a1f4a',
          maxWidth: '85%',
        }}
      >
        {content ? formatMessage(content) : (isStreaming ? <StreamingDots /> : null)}
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="mt-3 flex justify-end">
      <div
        className="rounded-bl-xl rounded-br-xl rounded-tl-xl px-3 py-2.5 text-sm leading-relaxed text-white"
        style={{
          background: 'linear-gradient(135deg, #A000B5, #7c00a0)',
          maxWidth: '75%',
        }}
      >
        {content}
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#b0bec5]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}
