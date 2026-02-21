import { z } from 'zod'

export const actionHttpSchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
  url: z.string().url('Must be a valid URL').describe('Request URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('GET').describe('HTTP method'),
  headers: z.record(z.string(), z.string()).default({}).describe('Request headers'),
  body: z.string().optional().describe('Request body (JSON)'),
})
