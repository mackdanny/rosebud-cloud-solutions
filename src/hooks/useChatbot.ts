import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatbotReturn {
  messages: ChatMessage[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  isStreaming: boolean;
  error: string | null;
  hasInteracted: boolean;
}

const API_URL = import.meta.env.VITE_CHATBOT_API_URL || '';
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

const LEAD_CAPTURE_REGEX = /\[LEAD_CAPTURE:([^|]+)\|([^|]+)\|([^\]]+)\]/;

async function submitToWeb3Forms(data: Record<string, string>): Promise<void> {
  await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, botcheck: '', ...data }),
  });
}

async function submitLead(name: string, email: string, topic: string): Promise<void> {
  await submitToWeb3Forms({
    subject: `Chatbot Lead: ${topic || 'General enquiry'}`,
    from_name: name,
    name,
    email,
    message: `Topic: ${topic || 'General enquiry'}\n\nThis lead was captured via the AI chatbot on the RCS website.`,
    source: 'AI Chatbot',
  });
}

async function submitTranscript(messages: ChatMessage[]): Promise<void> {
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'Visitor' : 'Bot'}: ${m.content}`)
    .join('\n\n');

  const messageCount = messages.filter((m) => m.role === 'user').length;
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

  await submitToWeb3Forms({
    subject: `Chatbot Transcript (${messageCount} visitor messages)`,
    from_name: 'RCS Chatbot',
    name: 'RCS Chatbot',
    email: 'chatbot@rosebudcloudsolutions.co.uk',
    message: `Chat transcript — ${timestamp}\n\n${transcript}`,
    source: 'AI Chatbot Transcript',
  });
}

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const transcriptSentRef = useRef(false);
  const transcriptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Send transcript 2 minutes after chat is closed (cancels if reopened)
  useEffect(() => {
    if (!isOpen && hasInteracted && messages.length > 0 && !transcriptSentRef.current) {
      transcriptTimerRef.current = setTimeout(() => {
        transcriptSentRef.current = true;
        submitTranscript(messages).catch(() => { /* best effort */ });
      }, 120_000);
    }

    return () => {
      if (transcriptTimerRef.current) {
        clearTimeout(transcriptTimerRef.current);
        transcriptTimerRef.current = null;
      }
    };
  }, [isOpen, hasInteracted, messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    setHasInteracted(true);
    setError(null);

    const userMessage: ChatMessage = { role: 'user', content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    setMessages([...updatedMessages, assistantMessage]);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    // Timeout after 30 seconds
    const timeoutId = setTimeout(() => abortRef.current?.abort(), 30_000);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      if (!response.body) throw new Error('No response stream available.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';

        for (const chunk of chunks) {
          if (!chunk.startsWith('data: ')) continue;
          const data = chunk.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string };
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              fullContent += parsed.text;

              const displayContent = fullContent.replace(LEAD_CAPTURE_REGEX, '').trimEnd();
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: displayContent },
              ]);
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== 'Skip') {
              throw parseErr;
            }
          }
        }
      }

      const leadMatch = fullContent.match(LEAD_CAPTURE_REGEX);
      if (leadMatch) {
        submitLead(leadMatch[1], leadMatch[2], leadMatch[3]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Response timed out. Please try again.');
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      clearTimeout(timeoutId);
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  return { messages, isOpen, setIsOpen, sendMessage, isStreaming, error, hasInteracted };
}
