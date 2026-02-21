import { z } from 'zod'

export const logicConditionSchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
  field: z.string().min(1, 'Field is required').describe('Field to evaluate'),
  operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']).describe('Comparison operator'),
  value: z.string().min(1, 'Value is required').describe('Value to compare against'),
})
