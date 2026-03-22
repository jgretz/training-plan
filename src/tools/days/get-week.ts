import { z } from 'zod';
import { eq, and, asc } from 'drizzle-orm';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlanDays } from '../../db/schema.ts';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getWeek = defineTool({
  name: 'get_week',
  description: 'Get all days for a given week of a training plan.',
  inputSchema: {
    planId: z.number().describe('Training plan ID'),
    week: z.number().describe('Week number (1-based)'),
  },
  annotations: { readOnlyHint: true },
  async handler({ planId, week }) {
    const days = db
      .select()
      .from(trainingPlanDays)
      .where(
        and(
          eq(trainingPlanDays.planId, planId),
          eq(trainingPlanDays.week, week),
        ),
      )
      .orderBy(asc(trainingPlanDays.dayOfWeek))
      .all();

    if (days.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `No days found for plan ${planId}, week ${week}.`,
          },
        ],
        isError: true,
      };
    }

    const lines = days.map((d) => {
      const dayName = DAY_NAMES[d.dayOfWeek - 1] ?? `Day ${d.dayOfWeek}`;
      const miles =
        d.minMiles === 0 && d.maxMiles === 0
          ? ''
          : ` (${d.minMiles}-${d.maxMiles} mi)`;
      return `### ${dayName}${miles}\n${d.description}`;
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: `## Week ${week}\n\n${lines.join('\n\n')}`,
        },
      ],
    };
  },
});
