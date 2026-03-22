import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { runMigrations } from './db/migrate.ts';
import { registerTools } from './tools/index.ts';

runMigrations();

const server = new McpServer({
  name: 'training-plan-mcp',
  version: '0.1.0',
});

registerTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
