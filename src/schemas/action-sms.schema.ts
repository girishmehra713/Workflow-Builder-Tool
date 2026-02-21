import { z } from 'zod'

export const actionSmsSchema = z.object({
  label: z.string().min(1, 'Label is required').describe('Node label'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').describe('Recipient phone number'),
  message: z.string().min(1, 'Message is required').describe('SMS message content'),
})
