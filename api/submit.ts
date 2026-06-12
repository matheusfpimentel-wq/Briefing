import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendBriefingEmail } from './_lib/email'
import { getClientIp, rateLimit } from './_lib/rateLimit'
import { submitSchema } from './_lib/schema'
import { BRIEFINGS_TABLE, getSupabase } from './_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido.' })
  }

  const ip = getClientIp(req)
  if (!rateLimit(`submit:${ip}`, 10, 60_000)) {
    return res.status(429).json({ ok: false, error: 'Você enviou muitos briefings em pouco tempo. Aguarde um minuto.' })
  }

  const parsed = submitSchema.safeParse(req.body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return res.status(400).json({ ok: false, error: first?.message || 'Confira os campos obrigatórios antes de enviar.' })
  }

  const { id, data, pdf } = parsed.data

  try {
    const supabase = getSupabase()
    const now = new Date().toISOString()

    const { error: dbError } = await supabase.from(BRIEFINGS_TABLE).upsert(
      {
        id,
        status: 'completed',
        data,
        updated_at: now,
        submitted_at: now,
        respondent_name: data.respondent_name,
        event_type: data.event_type,
        event_date: data.event_date || null,
        email: data.email,
        whatsapp: data.whatsapp,
      },
      { onConflict: 'id' },
    )

    if (dbError) {
      console.error('[submit] supabase error', dbError)
      return res.status(500).json({ ok: false, error: 'Não consegui salvar seu briefing. Tente novamente.' })
    }

    // E-mail de notificação. Se falhar, o registro já está salvo —
    // avisamos o cliente para tentar de novo (reenvio é idempotente).
    try {
      await sendBriefingEmail(data, pdf)
    } catch (mailErr) {
      console.error('[submit] email error', mailErr)
      return res.status(502).json({ ok: false, error: 'Seu briefing foi salvo, mas houve um erro no envio do aviso. Tente novamente.' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[submit] error', err)
    return res.status(500).json({ ok: false, error: 'Erro interno. Tente novamente em instantes.' })
  }
}
