import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @param {import("@slack/web-api").ChatStreamer} streamer
 * @param {any[]} prompts
 */
export async function callLLM(streamer, prompts) {
  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: prompts,
    stream: true,
  });

  for await (const event of response) {
    if (event.type === 'response.output_text.delta' && event.delta) {
      await streamer.append({
        markdown_text: event.delta,
      });
    }
  }
}
