import { z } from 'zod';
import { eq, count } from 'drizzle-orm';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlans, trainingPlanDays } from '../../db/schema.ts';

export const getTrainingPlan = defineTool({
  name: 'get_training_plan',
  description: 'Get a training plan by ID with summary info.',
  inputSchema: {
    planId: z.number().describe('Training plan ID'),
  },
  annotations: { readOnlyHint: true },
  async handler({ planId }) {
    const plan = db
      .select()
      .from(trainingPlans)
      .where(eq(trainingPlans.id, planId))
      .get();

    if (!plan) {
      return {
        content: [
          { type: 'text' as const, text: `Plan ${planId} not found.` },
        ],
        isError: true,
      };
    }

    const [dayCount] = db
      .select({ count: count() })
      .from(trainingPlanDays)
      .where(eq(trainingPlanDays.planId, planId))
      .all();

    const text = [
      `## ${plan.name}`,
      plan.description ? `\n${plan.description}` : '',
      `\nWeeks: ${plan.lengthWeeks}`,
      `Days: ${dayCount?.count ?? 0}`,
      `Created: ${plan.createdAt}`,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      content: [{ type: 'text' as const, text }],
    };
  },
});
