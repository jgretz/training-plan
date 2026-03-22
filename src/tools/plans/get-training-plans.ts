import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlans } from '../../db/schema.ts';

export const getTrainingPlans = defineTool({
  name: 'get_training_plans',
  description: 'List all training plans.',
  inputSchema: {},
  annotations: { readOnlyHint: true },
  async handler() {
    const plans = db.select().from(trainingPlans).all();

    if (plans.length === 0) {
      return {
        content: [{ type: 'text' as const, text: 'No training plans found.' }],
      };
    }

    const lines = plans.map(
      (p) => `- [${p.id}] ${p.name} (${p.lengthWeeks} weeks)`,
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: `## Training Plans (${plans.length})\n${lines.join('\n')}`,
        },
      ],
    };
  },
});
