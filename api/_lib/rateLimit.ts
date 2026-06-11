import type { VercelRequest } from '@vercel/node'

// Rate limiting simples em memória por IP. Observação: em serverless o
// estado vive por instância (não é global), mas serve como proteção
// básica contra abuso/loops. Para algo robusto, usar Upstash/Redis.

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string') return fwd.split(',')[0].trim()
  if (Array.isArray(fwd) && fwd.length) return fwd[0]
  return req.socket?.remoteAddress || 'unknown'
}

/**
 * Retorna true se a requisição está dentro do limite, false se excedeu.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}
