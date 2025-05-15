export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { api_key, model, messages } = req.body;

  if (!api_key || !model || !messages) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
      })
    });

    const data = await openaiRes.json();
    const content = data.choices?.[0]?.message?.content || 'No response.';

    res.status(200).json({ content });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy server error' });
  }
}
