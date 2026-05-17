import Anthropic from '@anthropic-ai/sdk';
import { executeMCPTool } from './mcp-client.js';
import { getToolDisplayTitle } from './tools/slack-mcp-tools.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_TOOL_ITERATIONS = 5;

/**
 * @param {import("@slack/web-api").ChatStreamer} streamer
 * @param {any[]} prompts
 * @param {{ tools?: any[], systemPrompt?: string }} [options]
 */
export async function callLLM(streamer, prompts, options = {}) {
  const { tools = [], systemPrompt } = options;
  const messages = prompts.map((p) => ({ role: p.role, content: p.content }));

  if (tools.length === 0) {
    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages,
      ...(systemPrompt && { system: systemPrompt }),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        await streamer.append({ markdown_text: event.delta.text });
      }
    }
    return;
  }

  let iterations = 0;
  while (iterations < MAX_TOOL_ITERATIONS) {
    iterations++;

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages,
      tools,
      ...(systemPrompt && { system: systemPrompt }),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        await streamer.append({ markdown_text: event.delta.text });
      }
    }

    const response = await stream.finalMessage();

    if (response.stop_reason !== 'tool_use') break;

    const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use');
    const toolResults = [];

    for (const toolUse of toolUseBlocks) {
      const displayTitle = getToolDisplayTitle(toolUse.name, toolUse.input);

      await streamer.append({
        chunks: [{ type: 'task_update', id: toolUse.id, title: displayTitle, status: 'in_progress' }],
      });

      try {
        const result = await executeMCPTool(toolUse.name, toolUse.input);
        await streamer.append({
          chunks: [{ type: 'task_update', id: toolUse.id, title: displayTitle, status: 'complete' }],
        });
        toolResults.push({ type: 'tool_result', tool_use_id: toolUse.id, content: result });
      } catch (err) {
        await streamer.append({
          chunks: [{ type: 'task_update', id: toolUse.id, title: displayTitle, status: 'error', output: err.message }],
        });
        toolResults.push({ type: 'tool_result', tool_use_id: toolUse.id, content: `Error: ${err.message}`, is_error: true });
      }
    }

    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResults });
  }
}
