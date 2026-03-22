import { z } from 'zod';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlans } from '../../db/schema.ts';

export const createTrainingPlan = defineTool({
  name: 'create_training_plan',
  description: 'Create a new training plan.',
  inputSchema: {
    name: z.string().describe('Plan name'),
    description: z.string().optional().describe('Plan description'),
    lengthWeeks: z.number().describe('Number of weeks in the plan'),
  },
  async handler({ name, description, lengthWeeks }) {
    const result = db
      .insert(trainingPlans)
      .values({
        name,
        description: description ?? '',
        lengthWeeks,
      })
      .returning()
      .get();

    return {
      content: [
        {
          type: 'text' as const,
          text: `Created plan [${result.id}] "${result.name}" (${result.lengthWeeks} weeks)`,
        },
      ],
    };
  },
});
