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
