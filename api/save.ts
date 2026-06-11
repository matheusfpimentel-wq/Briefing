import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getClientIp, rateLimit } from './_lib/rateLimit'
import { saveSchema } from './_lib/schema'
import { BRIEFINGS_TABLE, getSupabase } from './_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido.' })
  }

  // Rate limit: salvamentos parciais são frequentes, então é generoso.
  const ip = getClientIp(req)
  if (!rateLimit(`save:${ip}`, 120, 60_000)) {
    return res.status(429).json({ ok: false, error: 'Muitas requisições. Aguarde um instante.' })
  }

  const parsed = saveSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: 'Dados inválidos no salvamento.' })
  }

  const { id, data } = parsed.data

  try {
    const supabase = getSupabase()
    const now = new Date().toISOString()

    const { error } = await supabase.from(BRIEFINGS_TABLE).upsert(
      {
        id,
        status: 'in_progress',
        data,
        updated_at: now,
        respondent_name: data.respondent_name ?? null,
        event_type: data.event_type ?? null,
        event_date: data.event_date || null,
        email: data.email ?? null,
        whatsapp: data.whatsapp ?? null,
      },
      { onConflict: 'id' },
    )

    if (error) {
      console.error('[save] supabase error', error)
      return res.status(500).json({ ok: false, error: 'Não foi possível salvar agora.' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[save] error', err)
    return res.status(500).json({ ok: false, error: 'Erro interno ao salvar.' })
  }
}
