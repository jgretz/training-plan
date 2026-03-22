import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineTool } from '../types.ts';
import { db } from '../../db/index.ts';
import { trainingPlanDays } from '../../db/schema.ts';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getDay = defineTool({
  name: 'get_day',
  description:
    'Get a specific day from a training plan. Provide either (week + dayOfWeek) or dayOfPlan.',
  inputSchema: {
    planId: z.number().describe('Training plan ID'),
    week: z.number().optional().describe('Week number (1-based)'),
    dayOfWeek: z
      .number()
      .optional()
      .describe('Day of week (1=Mon, 7=Sun)'),
    dayOfPlan: z
      .number()
      .optional()
      .describe('Overall day number in the plan (1-based)'),
  },
  annotations: { readOnlyHint: true },
  async handler({ planId, week, dayOfWeek, dayOfPlan }) {
    let day;

    if (dayOfPlan !== undefined) {
      day = db
        .select()
        .from(trainingPlanDays)
        .where(
          and(
            eq(trainingPlanDays.planId, planId),
            eq(trainingPlanDays.dayOfPlan, dayOfPlan),
          ),
        )
        .get();
    } else if (week !== undefined && dayOfWeek !== undefined) {
      day = db
        .select()
        .from(trainingPlanDays)
        .where(
          and(
            eq(trainingPlanDays.planId, planId),
            eq(trainingPlanDays.week, week),
            eq(trainingPlanDays.dayOfWeek, dayOfWeek),
          ),
        )
        .get();
    } else {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Provide either (week + dayOfWeek) or dayOfPlan.',
          },
        ],
        isError: true,
      };
    }

    if (!day) {
      return {
        content: [
          { type: 'text' as const, text: 'Day not found.' },
        ],
        isError: true,
      };
    }

    const dayName = DAY_NAMES[day.dayOfWeek - 1] ?? `Day ${day.dayOfWeek}`;
    const miles =
      day.minMiles === 0 && day.maxMiles === 0
        ? 'No mileage'
        : `${day.minMiles}-${day.maxMiles} miles`;

    const text = [
      `## Week ${day.week}, ${dayName} (Day ${day.dayOfPlan})`,
      `Miles: ${miles}`,
      '',
      day.description,
    ].join('\n');

    return {
      content: [{ type: 'text' as const, text }],
    };
  },
});
