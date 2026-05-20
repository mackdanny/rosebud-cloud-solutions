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
