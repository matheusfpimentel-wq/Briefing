// Geração do PDF do briefing no navegador (cliente).
// Paleta violeta + lavanda (sem dourado, sem degradê). Fundo claro que
// cobre a página inteira; painéis brancos limpos; uma seção por página.

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
import { formatDateBR } from './format'
import type { BriefingData } from './types'

type RGB = [number, number, number]
const VIOLET: RGB = [109, 40, 217]
const DARK_VIOLET: RGB = [76, 29, 149]
const LAVENDER: RGB = [236, 232, 250]
const INK: RGB = [33, 28, 46]
const MUTED: RGB = [120, 114, 136]
const LINE: RGB = [226, 221, 238]
const PANEL: RGB = [255, 255, 255]
const PAGE: RGB = [241, 239, 248]
const PAGE_GLOW: RGB = [248, 246, 253]

const A = (s: string): string =>
  (s || '')
    .replace(/[•·]/g, '-')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, '...')

export function buildBriefingPdf(data: BriefingData): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 50
  const contentW = pageW - margin * 2
  const pad = 14
  let y = 0

  // Fundo que cobre a página toda: lavanda claro + brilho difuso central
  const paintBg = () => {
    doc.setFillColor(...PAGE)
    doc.rect(0, 0, pageW, pageH, 'F')
    doc.setFillColor(...PAGE_GLOW)
    doc.ellipse(pageW * 0.5, pageH * 0.34, pageW * 0.62, pageH * 0.4, 'F')
  }

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage()
      paintBg()
      y = margin
    }
  }

  // ── Capa ──
  paintBg()
  doc.setFillColor(...VIOLET)
  doc.rect(0, 0, pageW, 132, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('BRIEFING MAZIK', margin, 70)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(224, 213, 248)
  doc.text('CURADORIA MUSICAL', margin, 86)

  doc.setTextColor(...INK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  const coverTitle = doc.splitTextToSize(A(`${labelOf(EVENT_TYPE_OPTIONS, data.event_type) || 'Evento'} de ${data.respondent_name || ''}`.trim()), contentW)
  doc.text(coverTitle, margin, 230)
  let cy = 230 + coverTitle.length * 32 + 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(...MUTED)
  ;[formatDateBR(data.event_date), [data.start_time, data.end_time].filter(Boolean).join(' as '), data.venue].filter(Boolean).forEach((line) => {
    doc.text(A(line), margin, cy)
    cy += 19
  })
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text('Ficha de curadoria gerada pelo Briefing Mazik', margin, pageH - margin)

  const sectionPage = (label: string) => {
    doc.addPage()
    paintBg()
    // faixa de seção em lavanda com texto violeta escuro (sem dourado)
    doc.setFillColor(...LAVENDER)
    doc.rect(margin, margin, contentW, 34, 'F')
    doc.setTextColor(...DARK_VIOLET)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(A(label).toUpperCase(), margin + 12, margin + 22)
    y = margin + 34 + 22
  }

  const subTitle = (label: string) => {
    ensure(28)
    doc.setTextColor(...DARK_VIOLET)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(A(label).toUpperCase(), margin, y)
    y += 6
    doc.setDrawColor(...VIOLET)
    doc.setLineWidth(1.5)
    doc.line(margin, y, margin + 38, y)
    y += 16
  }

  const drawPanel = (h: number) => {
    doc.setFillColor(...PANEL)
    doc.setDrawColor(...LINE)
    doc.setLineWidth(1)
    doc.rect(margin, y, contentW, h, 'FD')
  }

  const box = (label: string, raw?: string) => {
    if (!raw || !raw.trim()) return
    const value = A(raw)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(value, contentW - pad * 2)
    const h = pad + 12 + lines.length * 14 + pad - 4
    ensure(h + 8)
    drawPanel(h)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(A(label).toUpperCase(), margin + pad, y + 16)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...INK)
    doc.text(lines, margin + pad, y + 16 + 14)
    y += h + 8
  }

  const listBox = (label: string, items: string[], ordered = false) => {
    const clean = items.filter((i) => i && i.trim()).map(A)
    if (!clean.length) return
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const wrapped = clean.map((it, idx) => doc.splitTextToSize(`${ordered ? `${idx + 1}.` : '-'}  ${it}`, contentW - pad * 2))
    const totalLines = wrapped.reduce((a, w) => a + w.length, 0)
    const h = pad + 12 + totalLines * 14 + pad - 4
    ensure(h + 8)
    drawPanel(h)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(A(label).toUpperCase(), margin + pad, y + 16)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...INK)
    let ty = y + 16 + 14
    wrapped.forEach((w) => {
      doc.text(w, margin + pad, ty)
      ty += w.length * 14
    })
    y += h + 8
  }

  const energyBox = (label: string, value: number, max: number, scaleText: string) => {
    const h = 54
    ensure(h + 8)
    drawPanel(h)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...INK)
    doc.text(A(label), margin + pad, y + 20)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...VIOLET)
    doc.text(A(`${value}/${max}  -  ${scaleText}`), margin + contentW - pad, y + 20, { align: 'right' })
    const barX = margin + pad
    const barW = contentW - pad * 2
    const barY = y + 32
    doc.setFillColor(...LINE)
    doc.rect(barX, barY, barW, 8, 'F')
    doc.setFillColor(...VIOLET)
    doc.rect(barX, barY, (barW * value) / max, 8, 'F')
    y += h + 8
  }

  // ═══════════ INFORMAÇÕES GERAIS ═══════════
  sectionPage('Informações gerais')
  subTitle('Evento')
  box('Cliente', `${data.respondent_name}${data.respondent_role ? ` (${labelOf(ROLE_OPTIONS, data.respondent_role)})` : ''}`)
  box('WhatsApp', data.whatsapp)
  box('E-mail', data.email)
  box('Local', data.venue)
  box('Data e horário', [formatDateBR(data.event_date), [data.start_time, data.end_time].filter(Boolean).join(' as ')].filter(Boolean).join('    '))
  y += 6
  subTitle('Público')
  box('Convidados', data.guest_count)
  box('Faixas etárias', data.age_ranges.map((v) => labelOf(AGE_RANGE_OPTIONS, v)).join(', '))
  box('Vibe', data.audience_vibe.map((v) => labelOf(AUDIENCE_VIBE_OPTIONS, v)).join(', '))
  box('Descrição', data.audience_description)

  // ═══════════ CURADORIA MUSICAL ═══════════
  sectionPage('Curadoria musical')
  subTitle('Atmosfera escolhida')
  energyPhases(data.event_type).forEach((p) => energyBox(p.label, data[p.key] as number, 5, ENERGY_SCALE_LABELS[data[p.key] as number]))
  energyBox('Curva de inovação', data.innovation, 10, innovationLabel(data.innovation))
  y += 6
  subTitle('Direção')
  listBox('Vibes (em ordem de prioridade)', data.top_genres, true)
  listBox(
    'Têm que tocar',
    data.must_play.filter((m) => m.title_artist.trim()).map((m) => `${m.title_artist}${m.link ? `  (${m.link})` : ''}`),
  )
  box('Vibes vetadas', data.vetoed_genres.join(', '))
  listBox('Não tocar', data.do_not_play)
  listBox(
    'Referências',
    data.references.filter((r) => r.value.trim()).map((r) => `${labelOf(REFERENCE_TYPE_OPTIONS, r.type)}: ${r.value}`),
  )
  box('Música-assinatura', data.signature_song)
  listBox(
    'Outras atrações musicais',
    data.other_attractions
      .filter((a) => a.description.trim())
      .map((a) => `${a.description}${[a.time, Number(a.duration) ? `${a.duration} min` : ''].filter(Boolean).length ? ` (${[a.time, Number(a.duration) ? `${a.duration} min` : ''].filter(Boolean).join(', ')})` : ''}`),
  )

  // ═══════════ ROTEIRO ═══════════
  const roteiro = buildRoteiro(data)
  if (roteiro.length) {
    sectionPage('Roteiro')
    roteiro.forEach((item) => {
      const detail = A(item.detail)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      const detailLines = detail ? doc.splitTextToSize(detail, contentW - 78 - pad) : []
      const h = Math.max(36, 22 + detailLines.length * 12 + 8)
      ensure(h + 6)
      drawPanel(h)
      doc.setFillColor(...LAVENDER)
      doc.rect(margin, y, 64, h, 'F')
      doc.setTextColor(...DARK_VIOLET)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(item.time || '-', margin + 32, y + h / 2 + 4, { align: 'center' })
      doc.setTextColor(...INK)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(A(item.label), margin + 64 + pad, y + 20)
      if (detailLines.length) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...MUTED)
        doc.text(detailLines, margin + 64 + pad, y + 34)
      }
      y += h + 6
    })
  }

  // ═══════════ OPERAÇÃO ═══════════
  sectionPage('Operação')
  listBox(
    'Serviços opcionais desejados',
    data.optional_services.map((v) => labelOf(OPTIONAL_SERVICES, v)),
  )
  listBox(
    'Fornecedores',
    data.vendors
      .filter((v) => v.name.trim() || v.contact.trim())
      .map((v) => `${labelOf(VENDOR_TYPE_OPTIONS, v.type)}: ${[v.name, v.contact].filter(Boolean).join(', ')}`),
  )
  box('Observações', data.notes)
  const acked = ACKNOWLEDGEMENTS.filter((a) => data.acknowledgements.includes(a.id))
  if (acked.length) listBox(`Quadro de ciências (${acked.length}/${ACKNOWLEDGEMENTS.length})`, acked.map((a) => a.text))

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
