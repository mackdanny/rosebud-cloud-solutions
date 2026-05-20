# RCS AI Chatbot — Design Spec

## Overview

Add a Claude-powered AI chatbot to the Rosebud Cloud Solutions website. The chatbot appears as a floating bubble on all pages, expands into a branded chat panel, and answers visitor questions about RCS services using Claude Haiku via a Cloudflare Worker backend.

## Architecture

Two independently deployed components:

### Frontend (React component in rosebud-react)
- `ChatBubble` — floating bottom-right button with magenta gradient, subtle pulse animation after 3s delay
- `ChatPanel` — expandable chat UI with message history, quick-action chips, text input
- State lives in React component state (no persistence across page refreshes)
- Calls the Cloudflare Worker endpoint over HTTPS
- Framer Motion for open/close animations (consistent with site patterns)

### Backend (Cloudflare Worker)
- Single POST endpoint: `/api/chat`
- Receives: `{ messages: [{ role, content }] }` (conversation history)
- Prepends a fixed system prompt containing RCS knowledge base
- Calls Claude Haiku API (`claude-haiku-4-5-20251001`)
- Streams response back to the frontend via Server-Sent Events
- API key stored in Worker environment variables (never exposed to browser)
- Rate limiting: max 10 requests per minute per IP via Cloudflare's built-in rate limiting

### Data Flow
```
User types message
  → React ChatPanel component
  → POST to Cloudflare Worker (/api/chat)
  → Worker prepends system prompt + RCS knowledge
  → Claude Haiku API (streaming)
  → SSE stream back to frontend
  → Rendered progressively in chat panel
```

No database. No session storage. No authentication required.

## Frontend Design

### ChatBubble Component
- Position: fixed, bottom-right corner (24px from edges)
- Size: 56px circle
- Style: magenta gradient (`linear-gradient(135deg, #A000B5, #d946ef)`)
- Icon: chat bubble icon (Material Symbols Outlined `chat_bubble`)
- Animation: subtle pulse/glow effect after 3 seconds on page, using Framer Motion
- Z-index: high enough to float above all page content
- Respects `prefers-reduced-motion` (disables pulse)
- On click: opens ChatPanel, bubble hides

### ChatPanel Component
- Position: fixed, bottom-right corner
- Size: ~380px wide × ~520px tall (desktop), full-width on mobile
- Appearance: dark surface (`#0F1435`) with `#0B0F2A` message area, matching site theme
- Border: subtle magenta-tinted border (`rgba(160, 0, 181, 0.2)`)
- Shadow: deep shadow for elevation
- Animation: scale + fade in from bottom-right (Framer Motion)

#### Header
- Bot avatar: 32px magenta gradient circle with ✦ sparkle icon
- Title: "Rosebud Assistant"
- Subtitle: "AI-powered · Typically instant"
- Close button (✕) top-right

#### Message Area
- Bot messages: left-aligned, dark surface cards with subtle border, avatar beside first message
- User messages: right-aligned, magenta gradient background, white text
- Scrollable, auto-scrolls to newest message
- Streaming responses render progressively (word by word)

#### Quick-Action Chips (Initial State)
Shown below the greeting message, disappear after first user interaction:
- "Our Services" — triggers overview of the 6 service areas
- "Case Studies" — triggers summary of available case studies
- "How We Work" — triggers engagement process overview
- "Get in Touch" — triggers contact information / lead capture

#### Input Area
- Rounded text input with placeholder: "Ask me anything..."
- Send button: 32px magenta gradient circle with arrow icon
- Always visible and active (chips are suggestions, not gates)
- Enter key submits, Shift+Enter for newline
- Footer: "Powered by Claude AI" in muted text

### Mobile Behaviour
- Panel expands to full width, ~70% viewport height
- Bubble moves to bottom-right with smaller margins (16px)
- Touch-friendly tap targets (min 44px)

### Accessibility
- Focus trap when panel is open
- Escape key closes panel
- ARIA labels on all interactive elements
- Screen reader announcements for new messages
- Keyboard navigable (Tab through chips, input, close button)

## Knowledge Base

### Approach: Hybrid
Site content as the foundation, plus a curated knowledge document.

### System Prompt Structure
The Cloudflare Worker prepends a system prompt that includes:
1. **Role definition**: "You are Rosebud's AI assistant, helping visitors understand RCS cloud services"
2. **Tone**: Professional, knowledgeable, approachable — matches the site's premium but accessible voice
3. **Site content summary**: condensed versions of service pages, case studies, FAQs, about page, how-we-work
4. **Curated additions**: engagement process, typical timelines, team expertise (no pricing)
5. **Guardrails**:
   - Never quote specific prices — redirect to contact page or offer lead capture
   - Never make claims about SLAs, guarantees, or commitments not in the knowledge base
   - Stay on topic (cloud services, Azure, RCS offerings)
   - For off-topic questions: politely redirect
   - Identify as an AI assistant, never pretend to be human
6. **Redirect behaviour**: When unable to answer or asked about pricing:
   - Acknowledge the question
   - Suggest visiting the contact page (with link)
   - Offer to collect name/email for follow-up ("Or I can take your details and have someone reach out")

### Knowledge Document
A markdown file (`src/data/chatbotKnowledge.md` or similar) containing curated content that goes beyond the site:
- How engagements typically start (initial call → scoping → proposal)
- Typical project timelines by service area
- Team credentials and certifications summary
- Common questions and preferred answers
- Explicitly excluded: pricing, SLAs, contractual terms

This file is embedded in the Worker's system prompt at deploy time.

## Lead Capture

When a visitor provides their name and email through the chat, the Worker submits the details to the existing Web3Forms integration (same service powering the contact form). No new email service needed.

### Flow
1. Bot offers to collect details (pricing question, or visitor asks to be contacted)
2. Bot asks for name and email conversationally (not a form — natural chat flow)
3. Bot confirms the details back to the visitor before submitting
4. Worker POSTs to Web3Forms API with:
   - Name, email, and a summary of what the visitor was asking about
   - Subject line: "Chatbot Lead: [visitor's topic of interest]"
   - Source field: "AI Chatbot" (to distinguish from contact form submissions)
5. Visitor gets confirmation: "Done — someone from the team will be in touch shortly"

### Worker Endpoint
- `POST /api/lead` — separate from `/api/chat`
- Request body: `{ name: string, email: string, topic: string }`
- Submits to Web3Forms using the same API key (passed as Worker env var `WEB3FORMS_KEY`)
- Returns success/failure to frontend
- Same rate limiting as chat endpoint

## Cloudflare Worker

### Endpoint
- `POST /api/chat`
- Request body: `{ messages: [{ role: "user" | "assistant", content: string }] }`
- Response: SSE stream of assistant message chunks
- CORS: restricted to `www.rosebudcloudsolutions.co.uk` (and localhost for development)

### Rate Limiting
- 10 requests per minute per IP
- Returns 429 with friendly message when exceeded

### Environment Variables
- `ANTHROPIC_API_KEY` — Claude API key
- `WEB3FORMS_KEY` — Web3Forms API key (same as site's contact form)
- `ALLOWED_ORIGINS` — comma-separated list of allowed CORS origins

### Conversation Limits
- Max conversation history sent to API: last 20 messages (to control token usage)
- Max input message length: 1000 characters
- System prompt + knowledge base: estimated ~2000 tokens

### Error Handling
- API errors: return friendly message ("I'm having trouble right now, please try again shortly")
- Rate limit: return specific message ("I need a moment — please try again in a minute")
- Network errors: frontend shows retry option

## CSP & Security Updates

### Content Security Policy
Add Cloudflare Worker domain to `connect-src` in `staticwebapp.config.json`:
```
connect-src 'self' https://api.web3forms.com https://<worker-subdomain>.workers.dev
```

### No Other Security Changes Needed
- No new script sources (component is part of the React bundle)
- No new frame sources
- No cookies or local storage used

## Testing Strategy

### Frontend
- Component renders correctly (bubble visible, panel opens/closes)
- Quick-action chips trigger correct messages
- Message rendering (user vs bot styling)
- Mobile responsive behaviour
- Accessibility (keyboard nav, screen reader)
- Streaming message display

### Backend
- Worker responds to valid requests
- Rate limiting works correctly
- CORS rejects unauthorized origins
- System prompt is correctly prepended
- Handles API errors gracefully
- Message history truncation works

### Integration
- End-to-end conversation flow
- Pricing question triggers redirect + lead capture option
- Long conversations don't exceed token limits

## Deployment

### Phase 1: Development (Personal Fork)
- Build feature on a branch
- Push to personal GitHub fork
- Cloudflare Worker deployed to a dev subdomain
- Frontend points to dev Worker URL via environment variable

### Phase 2: Production (RCS Origin)
- Merge feature branch to main
- Push to RCS origin
- Update Cloudflare Worker to production
- Update CORS to production domain only
- Update CSP headers

## File Structure (New Files)

```
rosebud-react/
├── src/
│   ├── components/
│   │   ├── ChatBubble.tsx        # Floating bubble component
│   │   └── ChatPanel.tsx         # Expandable chat panel
│   ├── data/
│   │   └── chatbotKnowledge.md   # Curated knowledge base content
│   └── hooks/
│       └── useChatbot.ts         # Chat state management & API calls

cloudflare-worker/                # Separate repo or directory
├── src/
│   ├── index.ts                  # Worker entry point & routing
│   ├── chat.ts                   # Claude API integration
│   ├── lead.ts                   # Web3Forms lead submission
│   └── knowledge.ts              # System prompt + knowledge base
├── wrangler.toml                 # Cloudflare Worker config
└── package.json
```
