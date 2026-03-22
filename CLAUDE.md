# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MCP server for storing and querying running training plans. SQLite + Drizzle ORM for persistence, exposed via `@modelcontextprotocol/sdk` stdio transport.

## Commands

```bash
bun run dev                    # Start MCP server
bun test                       # Run tests
bun run db:generate -- --name=<name>  # Generate drizzle migration
bun run scripts/import-swap-100m.ts   # Import SWAP 100M plan
```

## Architecture

Follows the same patterns as `strava-mcp` and `coros`:

- `src/index.ts` — Entry point: migrate DB, create McpServer, register tools, connect stdio
- `src/db/schema.ts` — Drizzle table definitions (training_plan, training_plan_day)
- `src/db/index.ts` — SQLite connection singleton (`~/.config/training-plan-mcp/training.db`)
- `src/tools/types.ts` — `defineTool()` helper and `McpTool` type
- `src/tools/index.ts` — Tool registry array + `registerTools()` function
- `src/tools/{plans,days}/` — One file per MCP tool

Tools query the database directly via Drizzle (no API layer needed since there's no external service).

## Database

SQLite at `~/.config/training-plan-mcp/training.db`. Migrations run automatically on server start. Schema has two tables:

- **training_plan**: name, description, length_weeks
- **training_plan_day**: plan_id (FK cascade), week, day_of_week (1=Mon), day_of_plan (computed), description, min_miles, max_miles
