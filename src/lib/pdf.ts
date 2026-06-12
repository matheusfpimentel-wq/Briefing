// Geração do PDF do briefing no navegador (cliente).
// Usado tanto para o botão "Baixar PDF" quanto para anexar no e-mail
// (o base64 viaja no envio e o servidor anexa via Resend).

import { jsPDF } from 'jspdf'
import {
  ACKNOWLEDGEMENTS,
  AGE_RANGE_OPTIONS,
  AUDIENCE_VIBE_OPTIONS,
  ENERGY_SCALE_LABELS,
  EVENT_TYPE_OPTIONS,
  OPTIONAL_SERVICES,
  REFERENCE_TYPE_OPTIONS,
  ROLE_OPTIONS,
  SOUND_STRUCTURE_OPTIONS,
  energyPhases,
  innovationLabel,
  labelOf,
  momentsFor,
} from '@/config/options'
import type { BriefingData } from './types'

const PURPLE: [number, number, number] = [147, 51, 234]
const PINK: [number, number, number] = [236, 72, 153]
const DARK: [number, number, number] = [28, 25, 38]
const MUTED: [number, number, number] = [120, 113, 138]
const TRACK: [number, number, number] = [236, 233, 245]

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
  doc.setFillColor(...PINK)
  doc.rect(0, 96, pageW, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('BRIEFING MAZIK', margin, 46)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  const subtitle = `${labelOf(EVENT_TYPE_OPTIONS, data.event_type)} de ${data.respondent_name || ''}`.trim()
  doc.text(subtitle, margin, 68)
  const dateLine = [data.event_date, [data.start_time, data.end_time].filter(Boolean).join(' a '), data.venue].filter(Boolean).join('   |   ')
  if (dateLine) {
    doc.setFontSize(10)
    doc.text(dateLine, margin, 86)
  }
  y = 128

  const heading = (t: string) => {
    ensure(48)
    doc.setFillColor(...PURPLE)
    doc.rect(margin, y - 9, 4, 14, 'F')
    doc.setTextColor(...PURPLE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(t.toUpperCase(), margin + 12, y + 2)
    y += 12
    doc.setDrawColor(...TRACK)
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

  const bullets = (label: string, items: string[], ordered = false) => {
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
    clean.forEach((item, idx) => {
      const marker = ordered ? `${idx + 1}.` : '•'
      const lines = doc.splitTextToSize(item, contentW - 18)
      ensure(lines.length * 14)
      doc.text(marker, margin + 2, y)
      doc.text(lines, margin + 18, y)
      y += lines.length * 14 + 2
    })
    y += 8
  }

  const energyBar = (label: string, value: number) => {
    ensure(34)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text(`${label}: ${value}/5 (${ENERGY_SCALE_LABELS[value]})`, margin, y)
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
  kv('Data e horário', [data.event_date, [data.start_time, data.end_time].filter(Boolean).join(' a ')].filter(Boolean).join('  ·  '))

  // ── Público ──
  heading('Público')
  kv('Convidados', data.guest_count)
  kv('Faixas etárias', data.age_ranges.map((v) => labelOf(AGE_RANGE_OPTIONS, v)).join(', '))
  kv('Vibe', data.audience_vibe.map((v) => labelOf(AUDIENCE_VIBE_OPTIONS, v)).join(', '))
  kv('Descrição', data.audience_description)

  // ── Atmosfera ──
  heading('Atmosfera por fase')
  energyPhases(data.event_type).forEach((p) => energyBar(p.label, data[p.key] as number))
  kv('Curva de inovação', `${data.innovation}/10 (${innovationLabel(data.innovation)})`)

  // ── Música ──
  heading('Direção musical')
  bullets('Vibes (em ordem de prioridade)', data.top_genres, true)
  kv('Vibes vetadas', data.vetoed_genres.join(', '))
  bullets(
    'Têm que tocar',
    data.must_play.filter((m) => m.title_artist.trim()).map((m) => `${m.title_artist}${m.link ? `  (${m.link})` : ''}`),
  )
  bullets('Não tocar', data.do_not_play)
  bullets(
    'Referências',
    data.references.filter((r) => r.value.trim()).map((r) => `${labelOf(REFERENCE_TYPE_OPTIONS, r.type)}: ${r.value}`),
  )
  kv('Música-assinatura', data.signature_song)
  bullets(
    'Outras atrações musicais',
    data.other_attractions
      .filter((a) => a.description.trim())
      .map((a) => `${a.description}${[a.time, a.duration].filter(Boolean).length ? ` (${[a.time, a.duration].filter(Boolean).join(', ')})` : ''}`),
  )

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
  bullets(
    'Serviços opcionais desejados',
    data.optional_services.map((v) => labelOf(OPTIONAL_SERVICES, v)),
  )
  kv('Observações', data.notes)

  // Quadro de ciências
  const acked = ACKNOWLEDGEMENTS.filter((a) => data.acknowledgements.includes(a.id))
  if (acked.length) {
    bullets(`Quadro de ciências (${acked.length}/${ACKNOWLEDGEMENTS.length} confirmados)`, acked.map((a) => a.text))
  }

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
