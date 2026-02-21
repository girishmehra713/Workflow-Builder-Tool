import { z } from 'zod'

export const actionDelaySchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
  duration: z.number().min(1, 'Duration must be at least 1').describe('Delay duration'),
  unit: z.enum(['seconds', 'minutes', 'hours']).default('seconds').describe('Time unit'),
})
