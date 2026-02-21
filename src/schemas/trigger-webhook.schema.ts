import { z } from 'zod'

export const triggerWebhookSchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
  webhookUrl: z.string().url('Must be a valid URL').describe('Webhook endpoint URL'),
  method: z.enum(['GET', 'POST', 'PUT']).default('POST').describe('HTTP method'),
})
