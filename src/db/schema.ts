import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const trainingPlans = sqliteTable('training_plan', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  lengthWeeks: integer('length_weeks').notNull(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const trainingPlanDays = sqliteTable('training_plan_day', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  planId: integer('plan_id')
    .notNull()
    .references(() => trainingPlans.id, { onDelete: 'cascade' }),
  week: integer('week').notNull(),
  dayOfWeek: integer('day_of_week').notNull(),
  dayOfPlan: integer('day_of_plan').notNull(),
  description: text('description').notNull().default(''),
  minMiles: real('min_miles').notNull().default(0),
  maxMiles: real('max_miles').notNull().default(0),
});
