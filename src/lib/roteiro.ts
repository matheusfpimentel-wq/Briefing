// Monta o roteiro cronológico do evento a partir dos momentos especiais,
// momentos livres e atrações contratadas. Considera a virada da meia-noite
// (horários antes do início do evento contam como o dia seguinte).

import { momentsFor } from '@/config/options'
import type { BriefingData } from './types'

export interface RoteiroItem {
  key: string
  label: string
  time: string
  detail: string
}

function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function toTimeStr(min: number): string {
  const mm = ((min % 1440) + 1440) % 1440
  const h = Math.floor(mm / 60)
  const m = mm % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Minutos desde o início do evento (horários antes do início = dia seguinte).
 * Sem horário de início definido, assume um evento noturno (âncora 17h):
 * assim 00:00 vem depois de 22:00, como é o mais comum. */
export function sortVal(time: string, startTime: string): number {
  if (!time) return Number.POSITIVE_INFINITY
  const t = toMin(time)
  const s = startTime ? toMin(startTime) : 18 * 60
  return t >= s ? t - s : t - s + 1440
}

interface RawItem extends RoteiroItem {
  durationMin: number
}

function rawItems(data: BriefingData): RawItem[] {
  const items: RawItem[] = []

  momentsFor(data.event_type).forEach((def) => {
    const m = data.moments[def.id]
    if (!m?.enabled) return
    const songs = m.songs.filter((s) => s.title_artist.trim()).map((s) => s.title_artist)
    items.push({ key: `moment:${def.id}`, label: def.label, time: m.time || '', detail: songs.join(' · '), durationMin: 0 })
  })

  data.custom_moments.forEach((c, i) => {
    if (!c.description.trim()) return
    items.push({ key: `custom:${i}`, label: c.description, time: c.time || '', detail: c.song || '', durationMin: 0 })
  })

  data.other_attractions.forEach((a, i) => {
    if (!a.description.trim()) return
    const dur = Number(a.duration) || 0
    let detail = 'Atração'
    if (dur > 0) {
      const end = a.time ? ` (até ${toTimeStr(toMin(a.time) + dur)})` : ''
      detail = `Atração · ${dur} min${end}`
    }
    items.push({ key: `attr:${i}`, label: a.description, time: a.time || '', detail, durationMin: dur })
  })

  return items
}

export function buildRoteiro(data: BriefingData): RoteiroItem[] {
  const items = rawItems(data)
  const order = data.roteiro_order
  const start = data.start_time

  if (order.length) {
    const idx = (k: string) => {
      const i = order.indexOf(k)
      return i === -1 ? Number.POSITIVE_INFINITY : i
    }
    items.sort((a, b) => {
      const ia = idx(a.key)
      const ib = idx(b.key)
      if (ia === Number.POSITIVE_INFINITY && ib === Number.POSITIVE_INFINITY) return sortVal(a.time, start) - sortVal(b.time, start)
      return ia - ib
    })
  } else {
    items.sort((a, b) => sortVal(a.time, start) - sortVal(b.time, start))
  }

  return items.map(({ key, label, time, detail }) => ({ key, label, time, detail }))
}

/** Ordena as chaves por horário (para o botão "ordenar por horário"). */
export function sortKeysByTime(data: BriefingData): string[] {
  const start = data.start_time
  return [...rawItems(data)].sort((a, b) => sortVal(a.time, start) - sortVal(b.time, start)).map((i) => i.key)
}

/** Detecta sobreposições de horário entre itens com hora definida. */
export function findOverlaps(data: BriefingData): string[] {
  const start = data.start_time
  const timed = rawItems(data)
    .filter((i) => i.time)
    .map((i) => ({ label: i.label, s: sortVal(i.time, start), e: sortVal(i.time, start) + i.durationMin }))

  const warnings: string[] = []
  for (let a = 0; a < timed.length; a++) {
    for (let b = a + 1; b < timed.length; b++) {
      const x = timed[a]
      const y = timed[b]
      // sobreposição real (não apenas encostar)
      if (x.s < y.e && y.s < x.e && !(x.e === x.s && y.e === y.s)) {
        warnings.push(`"${x.label}" e "${y.label}" se sobrepõem no horário.`)
      }
    }
  }
  return warnings
}
