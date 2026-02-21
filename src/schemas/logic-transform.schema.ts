import { z } from 'zod'

export const logicTransformSchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
  expression: z.string().min(1, 'Expression is required').describe('Transform expression'),
  outputVariable: z.string().min(1, 'Output variable is required').describe('Variable name for the result'),
})
