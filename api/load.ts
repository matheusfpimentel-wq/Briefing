import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getClientIp, rateLimit } from './_lib/rateLimit.js'
import { BRIEFINGS_TABLE, getSupabase } from './_lib/supabase.js'

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

// GET /api/load?id=<uuid> — carrega um briefing existente para continuar a edição.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Método não permitido.' })
  }

  const ip = getClientIp(req)
  if (!rateLimit(`load:${ip}`, 60, 60_000)) {
    return res.status(429).json({ ok: false, error: 'Muitas requisições. Aguarde um instante.' })
  }

  const id = typeof req.query.id === 'string' ? req.query.id : ''
  if (!UUID_RE.test(id)) {
    return res.status(400).json({ ok: false, error: 'ID inválido.' })
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from(BRIEFINGS_TABLE).select('data, status').eq('id', id).maybeSingle()

    if (error) {
      console.error('[load] supabase error', error)
      return res.status(500).json({ ok: false, error: 'Não foi possível carregar o briefing.' })
    }
    if (!data) {
      return res.status(404).json({ ok: false, error: 'Briefing não encontrado.' })
    }

    return res.status(200).json({ ok: true, data: data.data, status: data.status })
  } catch (err) {
    console.error('[load] error', err)
    return res.status(500).json({ ok: false, error: 'Erro interno ao carregar.' })
  }
}
