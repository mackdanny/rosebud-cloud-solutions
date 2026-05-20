# RCS AI Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Claude-powered AI chatbot to the RCS website with a floating bubble UI, streaming responses, and lead capture via Web3Forms.

**Architecture:** Two independently deployed components — a React frontend (ChatBubble + ChatPanel + useChatbot hook) rendered on all pages, and a Cloudflare Worker backend that proxies requests to Claude Haiku and handles lead submission to Web3Forms. Communication via SSE streaming over HTTPS.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, Cloudflare Workers, Claude Haiku API (direct fetch, no SDK), Web3Forms API.

**Spec:** `docs/superpowers/specs/2026-05-20-chatbot-design.md`

---

## File Structure

### New files in rosebud-react

| File | Responsibility |
|------|---------------|
| `src/components/ChatBubble.tsx` | Floating bottom-right button with pulse animation |
| `src/components/ChatPanel.tsx` | Expandable chat panel UI (messages, chips, input) |
| `src/hooks/useChatbot.ts` | Chat state, streaming API calls, lead capture |

### Modified files in rosebud-react

| File | Change |
|------|--------|
| `src/App.tsx` | Mount ChatBubble + ChatPanel inside router |
| `.env.example` | Add `VITE_CHATBOT_API_URL` |
| `.env.local` | Add local Worker URL |
| `public/staticwebapp.config.json` | Add Worker domain to CSP `connect-src` |

### New project: cloudflare-worker/

| File | Responsibility |
|------|---------------|
| `cloudflare-worker/package.json` | Dependencies and scripts |
| `cloudflare-worker/tsconfig.json` | TypeScript config for Workers |
| `cloudflare-worker/wrangler.toml` | Worker name, compatibility, env vars |
| `cloudflare-worker/src/index.ts` | Entry point: routing, CORS, rate limiting |
| `cloudflare-worker/src/chat.ts` | Claude API streaming handler |
| `cloudflare-worker/src/lead.ts` | Web3Forms lead submission |
| `cloudflare-worker/src/knowledge.ts` | System prompt with RCS knowledge base |

---

## Task 1: Create Feature Branch

**Files:** None

- [ ] **Step 1: Create and switch to feature branch**

```bash
git checkout -b feature/chatbot
```

- [ ] **Step 2: Verify branch**

```bash
git branch --show-current
```

Expected: `feature/chatbot`

---

## Task 2: Scaffold Cloudflare Worker Project

**Files:**
- Create: `cloudflare-worker/package.json`
- Create: `cloudflare-worker/tsconfig.json`
- Create: `cloudflare-worker/wrangler.toml`

- [ ] **Step 1: Create the cloudflare-worker directory**

```bash
mkdir -p cloudflare-worker/src
```

- [ ] **Step 2: Create package.json**

Write to `cloudflare-worker/package.json`:

```json
{
  "name": "rcs-chatbot-worker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250214.0",
    "typescript": "^5.7.0",
    "wrangler": "^4.0.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

Write to `cloudflare-worker/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 4: Create wrangler.toml**

Write to `cloudflare-worker/wrangler.toml`:

```toml
name = "rcs-chatbot"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[vars]
ALLOWED_ORIGINS = "http://localhost:5173,https://www.rosebudcloudsolutions.co.uk"
```

Note: `ANTHROPIC_API_KEY` and `WEB3FORMS_KEY` are set as secrets via `wrangler secret put`, not in this file.

- [ ] **Step 5: Install dependencies**

```bash
cd cloudflare-worker && npm install
```

- [ ] **Step 6: Commit scaffold**

```bash
git add cloudflare-worker/
git commit -m "feat(chatbot): scaffold Cloudflare Worker project"
```

---

## Task 3: Build Worker Knowledge Base

**Files:**
- Create: `cloudflare-worker/src/knowledge.ts`

- [ ] **Step 1: Create knowledge.ts with system prompt**

Write to `cloudflare-worker/src/knowledge.ts`:

```typescript
export function getSystemPrompt(): string {
  return `You are Rosebud's AI assistant on the Rosebud Cloud Solutions website. You help visitors understand RCS's cloud services, expertise, and approach. You are professional, knowledgeable, and approachable.

## About Rosebud Cloud Solutions
Rosebud Cloud Solutions (RCS) is a UK-based cloud consultancy specialising in Microsoft Azure. They provide enterprise-grade cloud infrastructure, security, and optimisation services. RCS is a Microsoft Solutions Partner for Data & AI and Infrastructure.

## Services

### Azure Foundation & Landing Zones
Design and deploy secure, scalable Azure environments using Infrastructure as Code (Terraform or Bicep). Includes management groups, Azure Policy, networking, identity integration, and governance frameworks aligned to the Microsoft Cloud Adoption Framework.

### Cloud Security & Compliance
Identity and access management, governance frameworks, Microsoft Defender for Cloud, zero-trust architecture, and alignment with standards like Cyber Essentials, ISO 27001, and NIST.

### DevSecOps & Automation
Embed security into CI/CD pipelines. Secret management, dependency scanning, container security, Infrastructure as Code scanning, and automated compliance gates.

### Cloud Optimisation & FinOps
Right-sizing, reserved capacity planning, cost anomaly detection, and FinOps practices. Typical savings of 20–40% on cloud spend.

### Cloud Architecture & Design
Strategic advisory and adoption planning. Independent guidance on cloud strategy, architecture reviews, and technology selection.

### Managed Cloud & Security Support
Ongoing management, monitoring, incident response, and proactive operations for Azure environments.

## How Engagements Work
RCS typically starts with an initial conversation to understand your needs, followed by a scoping exercise and a tailored proposal. They work as an extension of your team, providing hands-on expertise rather than just recommendations. Typical timelines vary by service — a landing zone engagement might be 4–8 weeks, while managed support is ongoing.

## Team Credentials
The team holds the following Microsoft certifications:
- Azure Solutions Architect Expert
- Azure Administrator Associate
- DevOps Engineer Expert
- Azure Network Engineer Associate
- AI Engineer Associate
- Azure Virtual Desktop Specialty

RCS holds Microsoft Solutions Partner designations for Data & AI and Infrastructure.

## Case Studies
RCS has delivered projects across multiple industries:
- Financial Services: Built a Tier-1 secure Azure platform for a major financial institution
- Public Sector: Designed hybrid identity solutions for a UK regulator
- Healthcare, legal, and retail engagements also completed

Visitors can explore detailed case studies on the website at /case-studies.

## Rules — Follow These Strictly
1. NEVER quote specific prices, costs, or fee ranges. Every engagement is tailored. For pricing questions, say something like: "Every engagement is scoped to your specific needs, so pricing varies. I'd recommend speaking with the team for a proper conversation about your requirements." Then offer to collect their details or link to the contact page at /contact.
2. NEVER make claims about SLAs, uptime guarantees, or contractual commitments not listed above.
3. Stay focused on cloud services, Azure, and RCS's offerings. For off-topic questions, politely redirect.
4. Always identify as an AI assistant. Never pretend to be a human team member.
5. Keep responses concise — 2–3 short paragraphs maximum. Use a professional but approachable tone.
6. When linking to pages on the site, use relative paths like /services/azure-landing-zones or /contact.

## Lead Capture
When a visitor wants to be contacted or you cannot answer their question fully:
1. Offer to collect their name and email so the team can follow up.
2. Ask for their name first, then their email.
3. Once you have both, confirm the details back to them.
4. After confirmation, include this exact marker at the very end of your response (it will be hidden from the visitor):
   [LEAD_CAPTURE:name|email|topic summary]
   Example: [LEAD_CAPTURE:Sarah Chen|sarah@example.com|Azure Landing Zone scoping for financial services]
5. After the marker, do NOT add any more text.`;
}
```

- [ ] **Step 2: Commit**

```bash
git add cloudflare-worker/src/knowledge.ts
git commit -m "feat(chatbot): add knowledge base and system prompt"
```

---

## Task 4: Build Worker Chat Handler

**Files:**
- Create: `cloudflare-worker/src/chat.ts`

- [ ] **Step 1: Create chat.ts with streaming Claude API handler**

Write to `cloudflare-worker/src/chat.ts`:

```typescript
import { getSystemPrompt } from './knowledge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Env {
  ANTHROPIC_API_KEY: string;
}

export async function handleChat(
  messages: Message[],
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  const truncated = messages.slice(-20);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      stream: true,
      system: getSystemPrompt(),
      messages: truncated,
    }),
  });

  if (!response.ok || !response.body) {
    return new Response(
      JSON.stringify({ error: "I'm having trouble right now, please try again shortly." }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const relay = async () => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;

          try {
            const event = JSON.parse(data);
            if (event.type === 'content_block_delta' && event.delta?.text) {
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
              );
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } finally {
      await writer.write(encoder.encode('data: [DONE]\n\n'));
      await writer.close();
    }
  };

  relay();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...corsHeaders,
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add cloudflare-worker/src/chat.ts
git commit -m "feat(chatbot): add streaming chat handler for Claude API"
```

---

## Task 5: Build Worker Lead Handler

**Files:**
- Create: `cloudflare-worker/src/lead.ts`

- [ ] **Step 1: Create lead.ts with Web3Forms submission**

Write to `cloudflare-worker/src/lead.ts`:

```typescript
interface LeadData {
  name: string;
  email: string;
  topic: string;
}

interface Env {
  WEB3FORMS_KEY: string;
}

export async function handleLead(
  lead: LeadData,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  if (!lead.name?.trim() || !lead.email?.trim()) {
    return new Response(
      JSON.stringify({ error: 'Name and email are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_KEY,
      subject: `Chatbot Lead: ${lead.topic || 'General enquiry'}`,
      from_name: lead.name.trim(),
      name: lead.name.trim(),
      email: lead.email.trim(),
      message: `Topic: ${lead.topic || 'General enquiry'}\n\nThis lead was captured via the AI chatbot on the RCS website.`,
      source: 'AI Chatbot',
    }),
  });

  const data = await response.json() as { success: boolean };

  if (!data.success) {
    return new Response(
      JSON.stringify({ error: 'Failed to submit lead. Please try again.' }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add cloudflare-worker/src/lead.ts
git commit -m "feat(chatbot): add lead capture handler via Web3Forms"
```

---

## Task 6: Build Worker Entry Point

**Files:**
- Create: `cloudflare-worker/src/index.ts`

- [ ] **Step 1: Create index.ts with routing, CORS, and rate limiting**

Write to `cloudflare-worker/src/index.ts`:

```typescript
import { handleChat } from './chat';
import { handleLead } from './lead';

interface Env {
  ANTHROPIC_API_KEY: string;
  WEB3FORMS_KEY: string;
  ALLOWED_ORIGINS: string;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function getCorsHeaders(request: Request, env: Env): Record<string, string> | null {
  const origin = request.headers.get('Origin');
  if (!origin) return { 'Access-Control-Allow-Origin': '*' };

  const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
  if (!allowed.includes(origin)) return null;

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = getCorsHeaders(request, env);
    if (!corsHeaders) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'I need a moment — please try again in a minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      );
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/chat') {
      const body = await request.json() as { messages?: { role: string; content: string }[] };
      if (!body.messages || !Array.isArray(body.messages)) {
        return new Response(
          JSON.stringify({ error: 'Invalid request: messages array required.' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
      }

      const lastMessage = body.messages[body.messages.length - 1];
      if (lastMessage?.content && lastMessage.content.length > 1000) {
        return new Response(
          JSON.stringify({ error: 'Message too long. Please keep messages under 1000 characters.' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
      }

      return handleChat(body.messages as { role: 'user' | 'assistant'; content: string }[], env, corsHeaders);
    }

    if (url.pathname === '/api/lead') {
      const body = await request.json() as { name?: string; email?: string; topic?: string };
      return handleLead(
        { name: body.name || '', email: body.email || '', topic: body.topic || '' },
        env,
        corsHeaders,
      );
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
```

- [ ] **Step 2: Verify the Worker compiles**

```bash
cd cloudflare-worker && npx wrangler deploy --dry-run --outdir dist
```

Expected: Successful build with no type errors. Output bundle in `dist/`.

- [ ] **Step 3: Add dist to .gitignore**

Append to `cloudflare-worker/.gitignore` (create if needed):

```
node_modules
dist
.wrangler
```

- [ ] **Step 4: Commit**

```bash
git add cloudflare-worker/src/index.ts cloudflare-worker/.gitignore
git commit -m "feat(chatbot): add Worker entry point with routing, CORS, rate limiting"
```

---

## Task 7: Test Worker Locally

**Files:** None (verification only)

**Prerequisites:** You need an Anthropic API key. Set it as a secret for local dev.

- [ ] **Step 1: Create .dev.vars for local secrets**

Write to `cloudflare-worker/.dev.vars`:

```
ANTHROPIC_API_KEY=your-api-key-here
WEB3FORMS_KEY=your-web3forms-key-here
```

This file is automatically read by `wrangler dev` and should NOT be committed. Add it to `.gitignore` — it's already covered by the `.wrangler` pattern but add explicitly:

Append `.dev.vars` to `cloudflare-worker/.gitignore`.

- [ ] **Step 2: Start the Worker locally**

```bash
cd cloudflare-worker && npx wrangler dev
```

Expected: Worker starts on `http://localhost:8787`.

- [ ] **Step 3: Test the chat endpoint**

In a separate terminal:

```bash
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What services does RCS offer?"}]}'
```

Expected: SSE stream of text chunks, ending with `data: [DONE]`. Content should describe the 6 RCS services.

- [ ] **Step 4: Test the lead endpoint**

```bash
curl -X POST http://localhost:8787/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","topic":"Testing chatbot"}'
```

Expected: `{"success":true}` (if Web3Forms key is valid) or `{"error":"..."}` (if using a placeholder key).

- [ ] **Step 5: Test rate limiting**

```bash
for i in $(seq 1 12); do
  echo "Request $i:"
  curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8787/api/chat \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"hi"}]}'
  echo ""
done
```

Expected: First 10 return `200`, requests 11 and 12 return `429`.

- [ ] **Step 6: Test CORS rejection**

```bash
curl -s -o /dev/null -w "%{http_code}" -X OPTIONS http://localhost:8787/api/chat \
  -H "Origin: https://evil.com"
```

Expected: `403` (origin not in allowed list).

- [ ] **Step 7: Stop the Worker, commit .gitignore update**

Stop `wrangler dev` with Ctrl+C.

```bash
git add cloudflare-worker/.gitignore
git commit -m "chore(chatbot): add .dev.vars to Worker gitignore"
```

---

## Task 8: Build useChatbot Hook

**Files:**
- Create: `src/hooks/useChatbot.ts`

- [ ] **Step 1: Create the useChatbot hook**

Write to `src/hooks/useChatbot.ts`:

```typescript
import { useState, useCallback, useRef } from 'react';

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

const LEAD_CAPTURE_REGEX = /\[LEAD_CAPTURE:([^|]+)\|([^|]+)\|([^\]]+)\]/;

async function submitLead(name: string, email: string, topic: string): Promise<void> {
  await fetch(`${API_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, topic }),
  });
}

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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
            const parsed = JSON.parse(data) as { text: string };
            fullContent += parsed.text;

            const displayContent = fullContent.replace(LEAD_CAPTURE_REGEX, '').trimEnd();
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: 'assistant', content: displayContent },
            ]);
          } catch {
            // Skip malformed chunks
          }
        }
      }

      const leadMatch = fullContent.match(LEAD_CAPTURE_REGEX);
      if (leadMatch) {
        submitLead(leadMatch[1], leadMatch[2], leadMatch[3]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  return { messages, isOpen, setIsOpen, sendMessage, isStreaming, error, hasInteracted };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useChatbot.ts
git commit -m "feat(chatbot): add useChatbot hook with streaming and lead capture"
```

---

## Task 9: Build ChatBubble Component

**Files:**
- Create: `src/components/ChatBubble.tsx`

- [ ] **Step 1: Create ChatBubble.tsx**

Write to `src/components/ChatBubble.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ChatBubble.tsx
git commit -m "feat(chatbot): add ChatBubble floating button component"
```

---

## Task 10: Build ChatPanel Component

**Files:**
- Create: `src/components/ChatPanel.tsx`

- [ ] **Step 1: Create ChatPanel.tsx**

Write to `src/components/ChatPanel.tsx`:

```tsx
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
      className="fixed bottom-6 right-6 z-50 flex w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:w-[380px] md:bottom-8 md:right-8"
      style={{
        height: 'min(520px, calc(100vh - 6rem))',
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
        {content || (isStreaming ? <StreamingDots /> : null)}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ChatPanel.tsx
git commit -m "feat(chatbot): add ChatPanel UI component"
```

---

## Task 11: Integrate into App.tsx and Configure Env

**Files:**
- Modify: `src/App.tsx`
- Modify: `.env.example`
- Modify: `.env.local`

- [ ] **Step 1: Read current App.tsx to find the exact mount point**

Read `src/App.tsx` and identify where `<Nav />` and `<Footer />` are rendered. The chatbot components should be added as siblings, inside the `BrowserRouter` but outside `Suspense`.

- [ ] **Step 2: Add chatbot imports and mount to App.tsx**

Add these imports at the top of `src/App.tsx`:

```typescript
import { AnimatePresence } from 'framer-motion';
import { ChatBubble } from './components/ChatBubble';
import { ChatPanel } from './components/ChatPanel';
import { useChatbot } from './hooks/useChatbot';
```

Note: `AnimatePresence` may already be imported — check first and skip if so.

In the `AppRoutes` function, add the `useChatbot` hook call and render the components. Place them after `<Footer />`, before the closing `</div>`:

```tsx
export function AppRoutes() {
  const chatbot = useChatbot();

  return (
    <Preloader>
      <div className="min-h-screen bg-background text-on-background">
        <ScrollToTop />
        <Nav />
        <Suspense fallback={null}>
          <Routes>
            {/* ... existing routes ... */}
          </Routes>
        </Suspense>
        <Footer />
        <AnimatePresence>
          {!chatbot.isOpen && (
            <ChatBubble onClick={() => chatbot.setIsOpen(true)} isOpen={chatbot.isOpen} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {chatbot.isOpen && (
            <ChatPanel
              messages={chatbot.messages}
              onSend={chatbot.sendMessage}
              onClose={() => chatbot.setIsOpen(false)}
              isStreaming={chatbot.isStreaming}
              error={chatbot.error}
              hasInteracted={chatbot.hasInteracted}
            />
          )}
        </AnimatePresence>
      </div>
    </Preloader>
  );
}
```

- [ ] **Step 3: Update .env.example**

Append to `.env.example`:

```
VITE_CHATBOT_API_URL=
```

- [ ] **Step 4: Update .env.local**

Append to `.env.local`:

```
VITE_CHATBOT_API_URL=http://localhost:8787
```

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx .env.example
git commit -m "feat(chatbot): mount chatbot components in App.tsx"
```

Note: `.env.local` is not committed (it's in `.gitignore` via `*.local`).

---

## Task 12: Update CSP Headers

**Files:**
- Modify: `public/staticwebapp.config.json`

- [ ] **Step 1: Read current staticwebapp.config.json**

Read `public/staticwebapp.config.json` and find the `Content-Security-Policy` header value.

- [ ] **Step 2: Add Worker domain to connect-src**

In the CSP header string, find `connect-src 'self' https://api.web3forms.com` and add the Worker domain. During development, add both localhost and the eventual production Worker URL:

Change the `connect-src` directive from:
```
connect-src 'self' https://api.web3forms.com
```
to:
```
connect-src 'self' https://api.web3forms.com https://rcs-chatbot.*.workers.dev
```

Note: The `*` wildcard covers any Cloudflare account subdomain. Once the Worker is deployed and you know the exact subdomain, tighten this to the specific URL.

- [ ] **Step 3: Commit**

```bash
git add public/staticwebapp.config.json
git commit -m "feat(chatbot): add Worker domain to CSP connect-src"
```

---

## Task 13: End-to-End Verification

**Files:** None (verification only)

- [ ] **Step 1: Start the Worker locally**

```bash
cd cloudflare-worker && npx wrangler dev
```

Confirm it starts on `http://localhost:8787`.

- [ ] **Step 2: Start the Vite dev server**

In a separate terminal:

```bash
npm run dev
```

Confirm it starts on `http://localhost:5173`.

- [ ] **Step 3: Open the site in a browser and verify the bubble**

Open `http://localhost:5173`. Verify:
- The chat bubble appears in the bottom-right corner after page load
- It has the magenta gradient and chat icon
- After ~3 seconds, a subtle pulse animation plays
- Clicking the bubble opens the chat panel

- [ ] **Step 4: Verify the chat panel UI**

After clicking the bubble, verify:
- The panel animates in from the bottom-right
- Header shows "Rosebud Assistant" with "AI-powered" subtitle
- Greeting message is displayed
- Four quick-action chips appear below the greeting
- Text input is visible and focused
- Close button (✕) works and shows the bubble again

- [ ] **Step 5: Test a conversation**

Type "What services do you offer?" and press Enter. Verify:
- User message appears right-aligned with magenta background
- Streaming dots appear while waiting
- Bot response streams in word by word
- Response describes RCS's services
- Quick-action chips disappear after first interaction

- [ ] **Step 6: Test a quick-action chip**

Close and reopen the chat (to reset state). Click "Case Studies". Verify:
- The chip's question is sent as a user message
- Bot responds with information about case studies
- Chips disappear

- [ ] **Step 7: Test the pricing redirect**

Ask "How much does a landing zone cost?". Verify:
- The bot does NOT quote specific prices
- It suggests speaking with the team
- It offers to collect details or links to /contact

- [ ] **Step 8: Test lead capture**

Say "Yes, I'd like to leave my details". Then provide a name and email when asked. Verify:
- The bot confirms the details
- No `[LEAD_CAPTURE:...]` marker is visible in the displayed message
- The lead was submitted (check Worker logs in the wrangler terminal for the Web3Forms request)

- [ ] **Step 9: Test mobile responsiveness**

Open browser dev tools, switch to a mobile viewport (e.g. 375px wide). Verify:
- Bubble is visible with smaller margins
- Panel expands to full width
- Text is readable, input is usable
- Touch targets are large enough

- [ ] **Step 10: Test keyboard accessibility**

With the panel open:
- Press Escape → panel closes
- Tab through interactive elements → focus moves through chips, input, send button, close button
- Enter in the input → sends the message

---

## Task 14: Push to Personal Fork

**Files:** None

- [ ] **Step 1: Verify all changes are committed**

```bash
git status
```

Expected: Clean working tree with no uncommitted changes.

- [ ] **Step 2: Push feature branch to personal fork**

```bash
git push personal feature/chatbot
```

Expected: Branch pushed to `mackdanny/rosebud-cloud-solutions` on GitHub.

- [ ] **Step 3: Verify the branch on GitHub**

```bash
gh browse --repo mackdanny/rosebud-cloud-solutions -- tree/feature/chatbot
```

Confirm the branch and all commits are visible.

---

## Post-Implementation Notes

### Deploying the Cloudflare Worker

When ready to deploy the Worker to Cloudflare:

```bash
cd cloudflare-worker

# Login to Cloudflare (first time only)
npx wrangler login

# Set secrets
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put WEB3FORMS_KEY

# Deploy
npx wrangler deploy
```

The deploy will output the Worker URL (e.g. `https://rcs-chatbot.<account>.workers.dev`). Update `VITE_CHATBOT_API_URL` in `.env.local` to point to this URL for testing against the deployed Worker.

### Going Live (RCS Origin)

When approved for production:
1. Update the CSP `connect-src` in `staticwebapp.config.json` to the exact Worker subdomain
2. Update `ALLOWED_ORIGINS` in `wrangler.toml` to production domain only
3. Merge feature branch to main: `git checkout main && git merge feature/chatbot`
4. Push to RCS origin: `git push origin main`
