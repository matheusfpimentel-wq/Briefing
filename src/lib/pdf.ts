// Geração do PDF do briefing no navegador (cliente).
// Relatório premium: capa + uma seção por página, campos em caixas,
// fundo claro (imprimível), paleta violeta + dourado.

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
const VIOLET: RGB = [99, 36, 201]
const LAVENDER: RGB = [237, 233, 250]
const DARK_VIOLET: RGB = [76, 29, 149]
const GOLD: RGB = [176, 141, 73]
const INK: RGB = [33, 28, 46]
const MUTED: RGB = [122, 114, 136]
const BOX_BG: RGB = [248, 247, 252]
const BORDER: RGB = [227, 222, 240]
const TRACK: RGB = [228, 224, 240]

export function buildBriefingPdf(data: BriefingData): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 50
  const contentW = pageW - margin * 2
  const pad = 12
  let y = 0

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage()
      y = margin
    }
  }

  // ── Capa ──
  doc.setFillColor(...VIOLET)
  doc.rect(0, 0, pageW, pageH, 'F')
  doc.setFillColor(...GOLD)
  doc.rect(margin, 250, 54, 4, 'F')
  doc.setTextColor(214, 198, 245)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('BRIEFING MAZIK', margin, 230)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  const coverTitle = doc.splitTextToSize(`${labelOf(EVENT_TYPE_OPTIONS, data.event_type) || 'Evento'} de ${data.respondent_name || ''}`.trim(), contentW)
  doc.text(coverTitle, margin, 290)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(225, 215, 248)
  const coverSub = [formatDateBR(data.event_date), [data.start_time, data.end_time].filter(Boolean).join(' às '), data.venue].filter(Boolean).join('\n')
  if (coverSub) doc.text(coverSub.split('\n'), margin, 290 + coverTitle.length * 32 + 8)
  doc.setFontSize(10)
  doc.setTextColor(200, 184, 238)
  doc.text('Curadoria musical para o seu evento', margin, pageH - margin)

  // ── Cabeçalho de seção (sempre em nova página) ──
  const sectionPage = (label: string) => {
    doc.addPage()
    y = margin
    doc.setFillColor(...LAVENDER)
    doc.rect(0, 0, pageW, 64, 'F')
    doc.setFillColor(...GOLD)
    doc.rect(0, 64, pageW, 3, 'F')
    doc.setTextColor(...DARK_VIOLET)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text(label.toUpperCase(), margin, 40)
    y = 92
  }

  // Subtítulo dentro da seção
  const subTitle = (label: string) => {
    ensure(30)
    doc.setTextColor(...VIOLET)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(label, margin, y)
    y += 6
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(1.2)
    doc.line(margin, y, margin + 44, y)
    y += 16
  }

  // Caixa de um campo (label + valor)
  const box = (label: string, value?: string) => {
    if (!value || !value.trim()) return
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(value, contentW - pad * 2)
    const boxH = pad + 12 + lines.length * 14 + pad - 4
    ensure(boxH + 8)
    doc.setFillColor(...BOX_BG)
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(1)
    doc.rect(margin, y, contentW, boxH, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(label.toUpperCase(), margin + pad, y + 16)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...INK)
    doc.text(lines, margin + pad, y + 16 + 14)
    y += boxH + 8
  }

  // Caixa com lista
  const listBox = (label: string, items: string[], ordered = false) => {
    const clean = items.filter((i) => i && i.trim())
    if (!clean.length) return
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const wrapped = clean.map((it, idx) => doc.splitTextToSize(`${ordered ? `${idx + 1}.` : '•'}  ${it}`, contentW - pad * 2))
    const totalLines = wrapped.reduce((a, w) => a + w.length, 0)
    const boxH = pad + 12 + totalLines * 14 + pad - 4
    ensure(boxH + 8)
    doc.setFillColor(...BOX_BG)
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(1)
    doc.rect(margin, y, contentW, boxH, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(label.toUpperCase(), margin + pad, y + 16)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...INK)
    let ty = y + 16 + 14
    wrapped.forEach((w) => {
      doc.text(w, margin + pad, ty)
      ty += w.length * 14
    })
    y += boxH + 8
  }

  const energyBox = (label: string, value: number, max: number, scaleText: string) => {
    const boxH = 56
    ensure(boxH + 8)
    doc.setFillColor(...BOX_BG)
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(1)
    doc.rect(margin, y, contentW, boxH, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...INK)
    doc.text(label, margin + pad, y + 20)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...VIOLET)
    doc.text(`${value}/${max} · ${scaleText}`, margin + contentW - pad, y + 20, { align: 'right' })
    const barY = y + 34
    const barW = contentW - pad * 2
    doc.setFillColor(...TRACK)
    doc.rect(margin + pad, barY, barW, 8, 'F')
    doc.setFillColor(...VIOLET)
    doc.rect(margin + pad, barY, (barW * value) / max, 8, 'F')
    y += boxH + 8
  }

  // ═══════════ INFORMAÇÕES GERAIS ═══════════
  sectionPage('Informações gerais')
  subTitle('Evento')
  box('Cliente', `${data.respondent_name}${data.respondent_role ? ` (${labelOf(ROLE_OPTIONS, data.respondent_role)})` : ''}`)
  box('WhatsApp', data.whatsapp)
  box('E-mail', data.email)
  box('Local', data.venue)
  box('Data e horário', [formatDateBR(data.event_date), [data.start_time, data.end_time].filter(Boolean).join(' às ')].filter(Boolean).join('   ·   '))
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
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      const detailLines = item.detail ? doc.splitTextToSize(item.detail, contentW - 78 - pad) : []
      const boxH = Math.max(34, 22 + detailLines.length * 12 + 8)
      ensure(boxH + 6)
      doc.setFillColor(...BOX_BG)
      doc.setDrawColor(...BORDER)
      doc.setLineWidth(1)
      doc.rect(margin, y, contentW, boxH, 'FD')
      // faixa do horário
      doc.setFillColor(...LAVENDER)
      doc.rect(margin, y, 70, boxH, 'F')
      doc.setTextColor(...DARK_VIOLET)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(item.time || '—', margin + 35, y + boxH / 2 + 4, { align: 'center' })
      // conteúdo
      doc.setTextColor(...INK)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(item.label, margin + 70 + pad, y + 20)
      if (detailLines.length) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...MUTED)
        doc.text(detailLines, margin + 70 + pad, y + 34)
      }
      y += boxH + 6
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
