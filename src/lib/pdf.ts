// Geração do PDF do briefing no navegador (cliente).
// Relatório premium: seções claras, paleta violeta + dourado.

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
  VENDOR_TYPE_OPTIONS,
  energyPhases,
  innovationLabel,
  labelOf,
} from '@/config/options'
import { buildRoteiro } from './roteiro'
import type { BriefingData } from './types'

const VIOLET: [number, number, number] = [109, 40, 217]
const GOLD: [number, number, number] = [176, 141, 73]
const DARK: [number, number, number] = [31, 27, 46]
const MUTED: [number, number, number] = [110, 102, 122]
const TRACK: [number, number, number] = [230, 226, 240]

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

  // ── Capa / cabeçalho ──
  doc.setFillColor(...VIOLET)
  doc.rect(0, 0, pageW, 104, 'F')
  doc.setFillColor(...GOLD)
  doc.rect(0, 104, pageW, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('BRIEFING MAZIK', margin, 40)
  doc.setFontSize(21)
  const title = `${labelOf(EVENT_TYPE_OPTIONS, data.event_type) || 'Evento'} de ${data.respondent_name || ''}`.trim()
  doc.text(title, margin, 70)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const dateLine = [data.event_date, [data.start_time, data.end_time].filter(Boolean).join(' a '), data.venue].filter(Boolean).join('     ')
  if (dateLine) doc.text(dateLine, margin, 90)
  y = 132

  // Banda de seção principal
  const band = (text: string) => {
    ensure(54)
    doc.setFillColor(...VIOLET)
    doc.roundedRect(margin, y, contentW, 30, 5, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(text.toUpperCase(), margin + 14, y + 20)
    y += 46
  }

  // Subtítulo de seção
  const sub = (text: string) => {
    ensure(34)
    doc.setTextColor(...VIOLET)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(text.toUpperCase(), margin, y)
    y += 6
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(1)
    doc.line(margin, y, margin + 60, y)
    y += 16
  }

  const kv = (label: string, value?: string) => {
    if (!value) return
    ensure(28)
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

  const energyBar = (label: string, value: number, max: number, scaleText: string) => {
    ensure(34)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text(`${label}: ${value}/${max} (${scaleText})`, margin, y)
    y += 8
    doc.setFillColor(...TRACK)
    doc.roundedRect(margin, y, contentW, 8, 3, 3, 'F')
    doc.setFillColor(...VIOLET)
    doc.roundedRect(margin, y, (contentW * value) / max, 8, 3, 3, 'F')
    y += 22
  }

  // ═══════════ INFORMAÇÕES GERAIS ═══════════
  band('Informações gerais')

  sub('Evento')
  kv('Cliente', `${data.respondent_name}${data.respondent_role ? ` (${labelOf(ROLE_OPTIONS, data.respondent_role)})` : ''}`)
  kv('Contato', [data.whatsapp, data.email].filter(Boolean).join('   ·   '))
  kv('Tipo', labelOf(EVENT_TYPE_OPTIONS, data.event_type))
  kv('Local', data.venue)
  kv('Data e horário', [data.event_date, [data.start_time, data.end_time].filter(Boolean).join(' a ')].filter(Boolean).join('  ·  '))

  sub('Público')
  kv('Convidados', data.guest_count)
  kv('Faixas etárias', data.age_ranges.map((v) => labelOf(AGE_RANGE_OPTIONS, v)).join(', '))
  kv('Vibe', data.audience_vibe.map((v) => labelOf(AUDIENCE_VIBE_OPTIONS, v)).join(', '))
  kv('Descrição', data.audience_description)

  // ═══════════ CURADORIA MUSICAL ═══════════
  band('Curadoria musical')

  sub('Atmosfera escolhida')
  energyPhases(data.event_type).forEach((p) => energyBar(p.label, data[p.key] as number, 5, ENERGY_SCALE_LABELS[data[p.key] as number]))
  energyBar('Curva de inovação', data.innovation, 10, innovationLabel(data.innovation))

  sub('Direção')
  bullets('Vibes (em ordem de prioridade)', data.top_genres, true)
  bullets(
    'Têm que tocar',
    data.must_play.filter((m) => m.title_artist.trim()).map((m) => `${m.title_artist}${m.link ? `  (${m.link})` : ''}`),
  )
  kv('Vibes vetadas', data.vetoed_genres.join(', '))
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

  // ═══════════ ROTEIRO ═══════════
  const roteiro = buildRoteiro(data)
  if (roteiro.length) {
    band('Roteiro')
    roteiro.forEach((item) => {
      ensure(30)
      // coluna de horário
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...GOLD)
      doc.text(item.time || '—', margin, y)
      // label + detalhe
      doc.setTextColor(...DARK)
      doc.text(item.label, margin + 56, y)
      let lineH = 16
      if (item.detail) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...MUTED)
        const lines = doc.splitTextToSize(item.detail, contentW - 56)
        doc.text(lines, margin + 56, y + 13)
        lineH += lines.length * 11
      }
      y += lineH + 4
      doc.setDrawColor(...TRACK)
      doc.setLineWidth(0.5)
      doc.line(margin + 56, y - 4, margin + contentW, y - 4)
    })
  }

  // ═══════════ OPERAÇÃO ═══════════
  band('Operação')
  bullets(
    'Serviços opcionais desejados',
    data.optional_services.map((v) => labelOf(OPTIONAL_SERVICES, v)),
  )
  bullets(
    'Fornecedores',
    data.vendors
      .filter((v) => v.name.trim() || v.contact.trim())
      .map((v) => `${labelOf(VENDOR_TYPE_OPTIONS, v.type)}: ${[v.name, v.contact].filter(Boolean).join(', ')}`),
  )
  kv('Observações', data.notes)
  const acked = ACKNOWLEDGEMENTS.filter((a) => data.acknowledgements.includes(a.id))
  if (acked.length) bullets(`Quadro de ciências (${acked.length}/${ACKNOWLEDGEMENTS.length})`, acked.map((a) => a.text))

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
