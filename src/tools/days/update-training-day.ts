import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlanDays } from '../../db/schema.ts';

export const updateTrainingDay = defineTool({
  name: 'update_training_day',
  description: 'Update a training day.',
  inputSchema: {
    dayId: z.number().describe('Training day ID'),
    description: z.string().optional().describe('New description'),
    minMiles: z.number().optional().describe('New minimum miles'),
    maxMiles: z.number().optional().describe('New maximum miles'),
  },
  annotations: { idempotentHint: true },
  async handler({ dayId, description, minMiles, maxMiles }) {
    const updates: Record<string, unknown> = {};
    if (description !== undefined) updates.description = description;
    if (minMiles !== undefined) updates.minMiles = minMiles;
    if (maxMiles !== undefined) updates.maxMiles = maxMiles;

    if (Object.keys(updates).length === 0) {
      return {
        content: [
          { type: 'text' as const, text: 'No fields to update.' },
        ],
        isError: true,
      };
    }

    const result = db
      .update(trainingPlanDays)
      .set(updates)
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
          text: `Updated day ${result.dayOfPlan} (week ${result.week}, day ${result.dayOfWeek})`,
        },
      ],
    };
  },
});
