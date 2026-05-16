import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_SERVER_URL = 'https://mcp.slack.com/sse';

let mcpClient = null;

async function getMCPClient() {
  if (mcpClient) return mcpClient;

  const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_USER_TOKEN}`,
      },
    },
  });

  mcpClient = new Client({
    name: 'dev-day-agent',
    version: '1.0.0',
  });

  await mcpClient.connect(transport);
  return mcpClient;
}

export async function readSOPCanvas() {
  const client = await getMCPClient();

  const result = await client.callTool({
    name: 'slack_read_canvas',
    arguments: {
      canvas_id: process.env.SOP_CANVAS_ID,
    },
  });

  const content = result.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n');

  return content;
}
