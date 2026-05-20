interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Env {
  WEB3FORMS_KEY: string;
}

export async function handleTranscript(
  messages: Message[],
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  if (!messages.length) {
    return new Response(
      JSON.stringify({ error: 'No messages to send.' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'Visitor' : 'Bot'}: ${m.content}`)
    .join('\n\n');

  const messageCount = messages.filter((m) => m.role === 'user').length;
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Referer: 'https://www.rosebudcloudsolutions.co.uk',
      Origin: 'https://www.rosebudcloudsolutions.co.uk',
    },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_KEY,
      botcheck: '',
      subject: `Chatbot Transcript (${messageCount} visitor messages)`,
      from_name: 'RCS Chatbot',
      name: 'RCS Chatbot',
      email: 'chatbot@rosebudcloudsolutions.co.uk',
      message: `Chat transcript — ${timestamp}\n\n${transcript}`,
      source: 'AI Chatbot Transcript',
    }),
  });

  const text = await response.text();
  let data: { success: boolean };
  try {
    data = JSON.parse(text) as { success: boolean };
  } catch {
    console.error('Web3Forms response:', text);
    return new Response(
      JSON.stringify({ error: `Web3Forms error: ${text.slice(0, 100)}` }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  if (!data.success) {
    return new Response(
      JSON.stringify({ error: 'Failed to send transcript.' }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
  );
}
