import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { requireUser } from '../../utils/auth'
import type { Resend } from 'resend'
import { getResendClient, getResendFrom } from '../../utils/resend'

const payloadSchema = z.object({
  to: z.string().email().transform(value => value.toLowerCase().trim()),
  subject: z.string().min(1).max(200),
  html: z.string().min(1).max(200000).optional(),
  text: z.string().min(1).max(200000).optional()
}).refine(value => value.html || value.text, {
  message: 'Either html or text is required'
})

export default defineEventHandler(async (event) => {
  await requireUser(event)
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  const resend = getResendClient()
  const from = getResendFrom()

  const emailPayload: Parameters<Resend['emails']['send']>[0] = body.data.html
    ? {
        from,
        to: body.data.to,
        subject: body.data.subject,
        html: body.data.html,
        ...(body.data.text ? { text: body.data.text } : {})
      }
    : {
        from,
        to: body.data.to,
        subject: body.data.subject,
        text: body.data.text as string
      }

  const result = await resend.emails.send(emailPayload)

  if (result.error) {
    throw createError({
      statusCode: 502,
      statusMessage: result.error.message || 'Resend error'
    })
  }

  return { id: result.data?.id }
})
