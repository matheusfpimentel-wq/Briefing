// Geração do PDF do briefing no navegador (cliente).
// Usado tanto para o botão "Baixar PDF" quanto para anexar no e-mail
// (o base64 viaja no envio e o servidor anexa via Resend).

import { jsPDF } from 'jspdf'
import {
  AGE_RANGE_OPTIONS,
  ENERGY_SCALE_LABELS,
  EVENT_TYPE_OPTIONS,
  GENRE_OPTIONS,
  GUEST_REQUESTS_OPTIONS,
  ROLE_OPTIONS,
  SOUND_STRUCTURE_OPTIONS,
  energyPhases,
  labelOf,
  momentsFor,
} from '@/config/options'
import type { BriefingData } from './types'

const PURPLE: [number, number, number] = [124, 58, 237]
const DARK: [number, number, number] = [30, 30, 40]
const MUTED: [number, number, number] = [110, 110, 120]
const TRACK: [number, number, number] = [232, 232, 238]

export function buildBriefingPdf(data: BriefingData): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 48
  const contentW = pageW - margin * 2
  let y = 0

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage()
      y = margin
    }
  }

  // ── Cabeçalho ──
  doc.setFillColor(...PURPLE)
  doc.rect(0, 0, pageW, 96, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('🎧 Briefing Mazik', margin, 46)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  const subtitle = `${labelOf(EVENT_TYPE_OPTIONS, data.event_type)} de ${data.respondent_name || '—'}`
  doc.text(subtitle, margin, 70)
  const dateLine = [data.event_date, [data.start_time, data.end_time].filter(Boolean).join('–')].filter(Boolean).join('  ·  ')
  if (dateLine) doc.text(dateLine, margin, 86)
  y = 128

  const heading = (t: string) => {
    ensure(46)
    doc.setTextColor(...PURPLE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(t.toUpperCase(), margin, y)
    y += 7
    doc.setDrawColor(...PURPLE)
    doc.setLineWidth(1)
    doc.line(margin, y, margin + contentW, y)
    y += 16
  }

  const kv = (label: string, value?: string) => {
    if (!value) return
    ensure(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(label.toUpperCase(), margin, y)
    y += 13
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...DARK)
    const lines = doc.splitTextToSize(value, contentW)
    ensure(lines.length * 14)
    doc.text(lines, margin, y)
    y += lines.length * 14 + 8
  }

  const bullets = (label: string, items: string[]) => {
    const clean = items.filter((i) => i && i.trim())
    if (!clean.length) return
    ensure(24)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(label.toUpperCase(), margin, y)
    y += 14
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...DARK)
    clean.forEach((item) => {
      const lines = doc.splitTextToSize(item, contentW - 16)
      ensure(lines.length * 14)
      doc.text('•', margin + 2, y)
      doc.text(lines, margin + 16, y)
      y += lines.length * 14 + 2
    })
    y += 8
  }

  const energyBar = (label: string, value: number) => {
    ensure(34)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text(`${label} — ${value}/5 (${ENERGY_SCALE_LABELS[value]})`, margin, y)
    y += 8
    doc.setFillColor(...TRACK)
    doc.roundedRect(margin, y, contentW, 8, 3, 3, 'F')
    doc.setFillColor(...PURPLE)
    doc.roundedRect(margin, y, (contentW * value) / 5, 8, 3, 3, 'F')
    y += 22
  }

  // ── Evento e contato ──
  heading('Evento e contato')
  kv('Cliente', `${data.respondent_name}${data.respondent_role ? ` (${labelOf(ROLE_OPTIONS, data.respondent_role)})` : ''}`)
  kv('WhatsApp', data.whatsapp)
  kv('E-mail', data.email)
  kv('Local', data.venue)
  kv('Convidados', data.guest_count)

  // ── Público ──
  heading('Público')
  kv('Faixas etárias', data.age_ranges.map((v) => labelOf(AGE_RANGE_OPTIONS, v)).join(', '))
  kv('Descrição', data.audience_description)

  // ── Atmosfera ──
  heading('Atmosfera por fase')
  energyPhases(data.event_type).forEach((p) => energyBar(p.label, data[p.key] as number))

  // ── Música ──
  heading('Direção musical')
  bullets(
    'Top 5 gêneros (em ordem)',
    data.top_genres.map((v, i) => `${i + 1}. ${v === 'outro' && data.top_genre_other ? data.top_genre_other : labelOf(GENRE_OPTIONS, v)}`),
  )
  kv('Gêneros vetados', data.vetoed_genres.map((v) => labelOf(GENRE_OPTIONS, v)).join(', '))
  bullets(
    'Têm que tocar',
    data.must_play.filter((m) => m.title_artist.trim()).map((m) => `${m.title_artist}${m.link ? `  (${m.link})` : ''}`),
  )
  bullets('Não tocar', data.do_not_play)
  kv('Playlist de referência', data.reference_playlist)
  kv('Música-assinatura', data.signature_song)

  // ── Momentos especiais ──
  const momentDefs = momentsFor(data.event_type).filter((def) => data.moments[def.id]?.enabled)
  if (momentDefs.length || data.other_moments.trim()) {
    heading('Roteiro de momentos especiais')
    momentDefs.forEach((def) => {
      const songs = data.moments[def.id].songs.filter((s) => s.title_artist.trim())
      kv(def.label, songs.length ? songs.map((s) => `${s.title_artist}${s.link ? ` (${s.link})` : ''}`).join('  ·  ') : 'A definir')
    })
    kv('Outros momentos', data.other_moments)
  }

  // ── Operação ──
  heading('Operação')
  kv('Estrutura de som', labelOf(SOUND_STRUCTURE_OPTIONS, data.sound_structure))
  kv('Política de pedidos', labelOf(GUEST_REQUESTS_OPTIONS, data.guest_requests_policy))
  kv('MC / cerimonial', data.has_mc ? [data.mc_name, data.mc_contact].filter(Boolean).join(' — ') || 'Sim' : 'Não')
  kv('Observações', data.notes)

  return doc
}

export function briefingFilename(data: BriefingData): string {
  const slug = (data.respondent_name || 'briefing')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `briefing-${slug || 'mazik'}${data.event_date ? `-${data.event_date}` : ''}.pdf`
}

/** Dispara o download no navegador. */
export function downloadBriefingPdf(data: BriefingData): void {
  buildBriefingPdf(data).save(briefingFilename(data))
}

/** Retorna o PDF em base64 (sem o prefixo data URI), para enviar ao servidor. */
export function briefingPdfBase64(data: BriefingData): string {
  const uri = buildBriefingPdf(data).output('datauristring')
  return uri.split(',')[1] ?? ''
}
