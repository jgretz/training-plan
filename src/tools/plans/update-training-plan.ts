import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlans } from '../../db/schema.ts';

export const updateTrainingPlan = defineTool({
  name: 'update_training_plan',
  description: 'Update a training plan metadata.',
  inputSchema: {
    planId: z.number().describe('Training plan ID'),
    name: z.string().optional().describe('New plan name'),
    description: z.string().optional().describe('New description'),
    lengthWeeks: z.number().optional().describe('New length in weeks'),
  },
  annotations: { idempotentHint: true },
  async handler({ planId, name, description, lengthWeeks }) {
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (lengthWeeks !== undefined) updates.lengthWeeks = lengthWeeks;

    const result = db
      .update(trainingPlans)
      .set(updates)
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
          text: `Updated plan [${result.id}] "${result.name}"`,
        },
      ],
    };
  },
});
