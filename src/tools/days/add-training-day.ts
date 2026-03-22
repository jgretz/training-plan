import { z } from 'zod';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlanDays } from '../../db/schema.ts';

export const addTrainingDay = defineTool({
  name: 'add_training_day',
  description: 'Add a day to a training plan.',
  inputSchema: {
    planId: z.number().describe('Training plan ID'),
    week: z.number().describe('Week number (1-based)'),
    dayOfWeek: z.number().describe('Day of week (1=Mon, 7=Sun)'),
    description: z.string().describe('Day description'),
    minMiles: z.number().describe('Minimum miles for the day'),
    maxMiles: z.number().describe('Maximum miles for the day'),
  },
  async handler({ planId, week, dayOfWeek, description, minMiles, maxMiles }) {
    const dayOfPlan = (week - 1) * 7 + dayOfWeek;

    const result = db
      .insert(trainingPlanDays)
      .values({
        planId,
        week,
        dayOfWeek,
        dayOfPlan,
        description,
        minMiles,
        maxMiles,
      })
      .returning()
      .get();

    return {
      content: [
        {
          type: 'text' as const,
          text: `Added day ${result.dayOfPlan} (week ${week}, day ${dayOfWeek}) to plan ${planId}`,
        },
      ],
    };
  },
});
