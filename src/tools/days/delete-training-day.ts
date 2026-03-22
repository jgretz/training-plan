import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlanDays } from '../../db/schema.ts';

export const deleteTrainingDay = defineTool({
  name: 'delete_training_day',
  description: 'Delete a training day.',
  inputSchema: {
    dayId: z.number().describe('Training day ID to delete'),
  },
  annotations: { destructiveHint: true },
  async handler({ dayId }) {
    const result = db
      .delete(trainingPlanDays)
      .where(eq(trainingPlanDays.id, dayId))
      .returning()
      .get();

    if (!result) {
      return {
        content: [
          { type: 'text' as const, text: `Day ${dayId} not found.` },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `Deleted day ${result.dayOfPlan} (week ${result.week}, day ${result.dayOfWeek})`,
        },
      ],
    };
  },
});
