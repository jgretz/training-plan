import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpTool } from './types.ts';
import { getTrainingPlans } from './plans/get-training-plans.ts';
import { getTrainingPlan } from './plans/get-training-plan.ts';
import { createTrainingPlan } from './plans/create-training-plan.ts';
import { updateTrainingPlan } from './plans/update-training-plan.ts';
import { deleteTrainingPlan } from './plans/delete-training-plan.ts';
import { getWeek } from './days/get-week.ts';
import { getDay } from './days/get-day.ts';
import { addTrainingDay } from './days/add-training-day.ts';
import { updateTrainingDay } from './days/update-training-day.ts';
import { deleteTrainingDay } from './days/delete-training-day.ts';

export const tools: McpTool[] = [
  getTrainingPlans,
  getTrainingPlan,
  createTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  getWeek,
  getDay,
  addTrainingDay,
  updateTrainingDay,
  deleteTrainingDay,
];

export function registerTools(server: McpServer): void {
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      },
      tool.handler,
    );
  }
}
