import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

let mcpClient = null;
let toolsCache = null;

async function getMCPClient() {
  if (mcpClient) return mcpClient;

  const transport = new StreamableHTTPClientTransport(
    new URL('https://mcp.slack.com/mcp'),
    { requestInit: { headers: { Authorization: `Bearer ${process.env.SLACK_USER_TOKEN}` } } },
  );

  const client = new Client({ name: 'dev-day-agent', version: '1.0.0' });
  await client.connect(transport);
  mcpClient = client;
  return mcpClient;
}
  
export async function listMCPTools() {
  if (toolsCache) return toolsCache;
  const client = await getMCPClient();
  const result = await client.listTools();
  toolsCache = result.tools;
  return toolsCache;
}

export async function executeMCPTool(name, args) {
  const client = await getMCPClient();
  const result = await client.callTool({ name, arguments: args });
  return result.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n');
}

