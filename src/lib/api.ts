// Cliente HTTP para as funções serverless. O frontend NUNCA fala com o
// Supabase diretamente — tudo passa por /api.

import type { BriefingData } from './types'

export interface ApiResult {
  ok: boolean
  error?: string
}

async function postJson(path: string, body: unknown): Promise<ApiResult> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let payload: { ok?: boolean; error?: string } = {}
  try {
    payload = await res.json()
  } catch {
    /* resposta sem corpo */
  }

  if (!res.ok || payload.ok === false) {
    const fallback =
      res.status === 404
        ? 'Erro 404: as funções da API não foram encontradas (verifique o deploy na Vercel).'
        : res.status >= 500
          ? `Erro ${res.status}: o servidor falhou (confira as variáveis de ambiente e os logs na Vercel).`
          : `Não foi possível concluir agora (erro ${res.status}). Tente novamente.`
    return { ok: false, error: payload.error || fallback }
  }
  return { ok: true }
}

/** Salvamento parcial (status in_progress). Falhas são silenciosas. */
export async function saveBriefing(id: string, data: BriefingData, currentStep: number): Promise<ApiResult> {
  try {
    return await postJson('/api/save', { id, data, currentStep })
  } catch {
    return { ok: false, error: 'offline' }
  }
}

/** Envio final (status completed). Tenta novamente em caso de falha de rede. */
export async function submitBriefing(id: string, data: BriefingData, pdf?: string, retries = 2): Promise<ApiResult> {
  let last: ApiResult = { ok: false, error: 'Falha desconhecida' }
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await postJson('/api/submit', { id, data, pdf })
      if (result.ok) return result
      last = result
      // Erros de validação (4xx) não devem ser repetidos cegamente,
      // mas mantemos o retry simples para falhas transitórias.
    } catch {
      last = { ok: false, error: 'Sem conexão. Verifique sua internet.' }
    }
    if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
  }
  return last
}
