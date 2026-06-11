// Validações reutilizáveis no cliente (validação por etapa).
// A validação definitiva acontece no servidor (api/_lib/schema.ts).

export const isEmail = (v: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export const isUrl = (v: string): boolean => {
  if (!v.trim()) return true // opcional
  try {
    const u = new URL(v.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// Telefone BR: exige DDD + número (10 ou 11 dígitos)
export const isPhoneBR = (v: string): boolean => {
  const digits = v.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

// Máscara progressiva: (99) 99999-9999
export const maskPhoneBR = (v: string): string => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.replace(/(\d{0,2})/, '($1')
  if (d.length <= 6) return d.replace(/(\d{2})(\d{0,4})/, '($1) $2')
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}
