import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * @param {import("@slack/web-api").ChatStreamer} streamer
 * @param {any[]} prompts
 */
export async function callLLM(streamer, prompts) {
  const messages = prompts.map((p) => ({ role: p.role, content: p.content }));

  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      await streamer.append({
        markdown_text: event.delta.text,
      });
    }
  }
}
