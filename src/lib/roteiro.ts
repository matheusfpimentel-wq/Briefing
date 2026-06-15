// Monta o roteiro cronológico do evento a partir dos momentos especiais
// e das atrações contratadas. Itens com horário entram em ordem; o resto
// segue a ordem manual (drag and drop) guardada em data.roteiro_order.

import { momentsFor } from '@/config/options'
import type { BriefingData } from './types'

export interface RoteiroItem {
  key: string
  label: string
  time: string
  detail: string
}

function rawItems(data: BriefingData): RoteiroItem[] {
  const items: RoteiroItem[] = []

  momentsFor(data.event_type).forEach((def) => {
    const m = data.moments[def.id]
    if (!m?.enabled) return
    const songs = m.songs.filter((s) => s.title_artist.trim()).map((s) => s.title_artist)
    items.push({ key: `moment:${def.id}`, label: def.label, time: m.time || '', detail: songs.join(' · ') })
  })

  data.other_attractions.forEach((a, i) => {
    if (!a.description.trim()) return
    items.push({
      key: `attr:${i}`,
      label: a.description,
      time: a.time || '',
      detail: a.duration ? `Atração · ${a.duration}` : 'Atração',
    })
  })

  return items
}

function byTime(a: RoteiroItem, b: RoteiroItem): number {
  if (a.time && b.time) return a.time.localeCompare(b.time)
  if (a.time) return -1
  if (b.time) return 1
  return 0
}

export function buildRoteiro(data: BriefingData): RoteiroItem[] {
  const items = rawItems(data)
  const order = data.roteiro_order

  if (order.length) {
    const idx = (k: string) => {
      const i = order.indexOf(k)
      return i === -1 ? Number.POSITIVE_INFINITY : i
    }
    items.sort((a, b) => {
      const ia = idx(a.key)
      const ib = idx(b.key)
      if (ia === Number.POSITIVE_INFINITY && ib === Number.POSITIVE_INFINITY) return byTime(a, b)
      return ia - ib
    })
  } else {
    items.sort(byTime)
  }

  return items
}

/** Ordena as chaves por horário (para o botão "ordenar por horário"). */
export function sortKeysByTime(data: BriefingData): string[] {
  return [...rawItems(data)].sort(byTime).map((i) => i.key)
}
