import { listMCPTools } from '../mcp-client.js';

const ALLOWED_TOOLS = [
  'slack_read_channel',
  'slack_read_thread',
  'slack_read_canvas',
  'slack_search_public',
  'slack_search_public_and_private',
  'slack_search_channels',
  'slack_search_users',
];

let anthropicToolsCache = null;

export async function getSlackTools() {
  if (anthropicToolsCache) return anthropicToolsCache;

  const mcpTools = await listMCPTools();
  anthropicToolsCache = mcpTools
    .filter((t) => ALLOWED_TOOLS.includes(t.name))
    .map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema,
    }));

  return anthropicToolsCache;
}

export function getToolDisplayTitle(toolName, args) {
  switch (toolName) {
    case 'slack_read_channel':
      return 'Reading channel messages...';
    case 'slack_read_thread':
      return 'Reading thread conversation...';
    case 'slack_read_canvas':
      return 'Reading canvas document...';
    case 'slack_search_public':
      return `Searching for "${args.query || 'messages'}"...`;
    case 'slack_search_public_and_private':
      return `Searching for "${args.query || 'messages'}"...`;
    case 'slack_search_channels':
      return `Finding channels matching "${args.query || ''}"...`;
    case 'slack_search_users':
      return 'Looking up users...';
    default:
      return `Executing ${toolName}...`;
  }
}
