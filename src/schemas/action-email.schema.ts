import { z } from 'zod'

export const actionEmailSchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
  to: z.string().email('Must be a valid email').describe('Recipient email'),
  subject: z.string().min(1, 'Subject is required').describe('Email subject'),
  body: z.string().min(1, 'Body is required').describe('Email body'),
})
