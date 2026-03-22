import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlans } from '../../db/schema.ts';

export const deleteTrainingPlan = defineTool({
  name: 'delete_training_plan',
  description:
    'Delete a training plan and all its days (cascade).',
  inputSchema: {
    planId: z.number().describe('Training plan ID to delete'),
  },
  annotations: { destructiveHint: true },
  async handler({ planId }) {
    const result = db
      .delete(trainingPlans)
      .where(eq(trainingPlans.id, planId))
      .returning()
      .get();

    if (!result) {
      return {
        content: [
          { type: 'text' as const, text: `Plan ${planId} not found.` },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `Deleted plan [${result.id}] "${result.name}" and all its days.`,
        },
      ],
    };
  },
});
