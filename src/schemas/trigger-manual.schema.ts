import { z } from 'zod'

export const triggerManualSchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
})
