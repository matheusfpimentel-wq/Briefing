/** Formata uma data ISO (YYYY-MM-DD) para DD/MM/AAAA. */
export function formatDateBR(iso: string): string {
  if (!iso) return ''
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso
}
