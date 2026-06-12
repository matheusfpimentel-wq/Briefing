import type { BriefingData } from './schema.js'
import {
  ACKNOWLEDGEMENTS,
  AGE_RANGE,
  AUDIENCE_VIBE,
  ENERGY_PHASES_CORPORATE,
  ENERGY_PHASES_DEFAULT,
  ENERGY_SCALE,
  EVENT_TYPE,
  MOMENTS,
  OPTIONAL_SERVICES,
  REFERENCE_TYPE,
  ROLE,
  SOUND_STRUCTURE,
  innovationLabel,
  lbl,
} from './labels.js'

const ACCENT = '#a855f7'
const ACCENT2 = '#ec4899'
const BG = '#0d0b14'
const CARD = '#171221'
const TEXT = '#e9e4f5'
const MUTED = '#9b91b3'

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function waLink(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, '')
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${withCountry}`
}

function songLine(title: string, link?: string): string {
  const safe = esc(title)
  if (link && /^https?:\/\//i.test(link)) {
    return `${safe} — <a href="${esc(link)}" style="color:${ACCENT};">ouvir</a>`
  }
  return safe
}

function section(title: string, inner: string): string {
  if (!inner.trim()) return ''
  return `
    <tr><td style="padding:0 24px;">
      <div style="background:${CARD};border:1px solid #2c2440;border-radius:14px;padding:20px;margin-bottom:16px;">
        <h2 style="margin:0 0 14px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:${ACCENT};">${esc(title)}</h2>
        ${inner}
      </div>
    </td></tr>`
}

function kv(label: string, value: string): string {
  if (!value) return ''
  return `<p style="margin:0 0 8px;font-size:14px;color:${TEXT};"><strong style="color:${MUTED};font-weight:600;">${esc(label)}:</strong> ${value}</p>`
}

function energyBar(label: string, value: number): string {
  const pct = (value / 5) * 100
  return `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;color:${TEXT};margin-bottom:4px;">
        <span>${esc(label)}</span><span style="color:${ACCENT};">${value}/5 · ${esc(ENERGY_SCALE[value] || '')}</span>
      </div>
      <div style="background:#2c2440;border-radius:8px;height:10px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,${ACCENT},${ACCENT2});height:10px;width:${pct}%;"></div>
      </div>
    </div>`
}

export function buildEmailHtml(data: BriefingData): string {
  const energyPhases = data.event_type === 'corporativo' ? ENERGY_PHASES_CORPORATE : ENERGY_PHASES_DEFAULT
  const momentDefs = MOMENTS[data.event_type] || []

  const header = `
    <tr><td style="padding:24px;">
      <div style="background:linear-gradient(135deg,${ACCENT},${ACCENT2});border-radius:16px;padding:24px;">
        <p style="margin:0 0 6px;font-size:13px;color:#fce7f3;">Novo briefing recebido</p>
        <h1 style="margin:0;font-size:22px;color:#fff;">${esc(lbl(EVENT_TYPE, data.event_type))} de ${esc(data.respondent_name)}</h1>
        <p style="margin:10px 0 0;font-size:14px;color:#fce7f3;">
          ${[data.event_date, [data.start_time, data.end_time].filter(Boolean).join('–'), data.venue].filter(Boolean).map(esc).join(' · ')}
        </p>
      </div>
    </td></tr>`

  const contato = section(
    'Evento e contato',
    kv('Cliente', `${esc(data.respondent_name)} (${esc(lbl(ROLE, data.respondent_role))})`) +
      kv('Tipo', esc(lbl(EVENT_TYPE, data.event_type))) +
      kv('Local', esc(data.venue)) +
      kv('Data', esc(data.event_date)) +
      kv('Horário', [data.start_time, data.end_time].filter(Boolean).map(esc).join(' às ')) +
      kv('E-mail', `<a href="mailto:${esc(data.email)}" style="color:${ACCENT};">${esc(data.email)}</a>`) +
      kv('WhatsApp', `<a href="${waLink(data.whatsapp)}" style="color:${ACCENT};">${esc(data.whatsapp)}</a>`),
  )

  const publico = section(
    'Leitura do público',
    kv('Convidados', esc(data.guest_count)) +
      kv('Faixas etárias', data.age_ranges.map((v) => esc(lbl(AGE_RANGE, v))).join(', ')) +
      kv('Vibe', data.audience_vibe.map((v) => esc(lbl(AUDIENCE_VIBE, v))).join(', ')) +
      kv('Descrição', esc(data.audience_description)) +
      '<div style="margin-top:14px;">' +
      energyPhases.map((p) => energyBar(p.label, (data as Record<string, unknown>)[p.key] as number)).join('') +
      '</div>' +
      `<p style="margin:14px 0 0;font-size:14px;color:${TEXT};"><strong style="color:${MUTED};font-weight:600;">Curva de inovação:</strong> ${data.innovation}/10 (${esc(innovationLabel(data.innovation))})</p>`,
  )

  const topGenres =
    data.top_genres.length > 0
      ? `<p style="margin:0 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Vibes (em ordem):</p><ol style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${data.top_genres
          .map((v) => `<li>${esc(v)}</li>`)
          .join('')}</ol>`
      : ''
  const vetados =
    data.vetoed_genres.length > 0
      ? `<p style="margin:0 0 10px;font-size:14px;"><strong style="color:${MUTED};">Vetadas:</strong> <span style="color:#f472b6;font-weight:600;">${data.vetoed_genres
          .map((v) => esc(v))
          .join(', ')}</span></p>`
      : ''
  const mustPlay = data.must_play.filter((m) => m.title_artist.trim())
  const mustPlayHtml =
    mustPlay.length > 0
      ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Têm que tocar:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${mustPlay
          .map((m) => `<li>${songLine(m.title_artist, m.link)}</li>`)
          .join('')}</ul>`
      : ''
  const doNotPlay = data.do_not_play.filter((d) => d.trim())
  const doNotPlayHtml =
    doNotPlay.length > 0
      ? `<p style="margin:0 0 10px;font-size:14px;"><strong style="color:${MUTED};">Lista negra:</strong> <span style="color:#f472b6;">${doNotPlay.map(esc).join(', ')}</span></p>`
      : ''
  const refs = data.references.filter((r) => r.value.trim())
  const refsHtml =
    refs.length > 0
      ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Referências:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${refs
          .map((r) => `<li>${esc(lbl(REFERENCE_TYPE, r.type))}: ${songLine(r.value, /^https?:\/\//i.test(r.value) ? r.value : undefined)}</li>`)
          .join('')}</ul>`
      : ''

  const attractions = data.other_attractions.filter((a) => a.description.trim())
  const attractionsHtml = attractions.length
    ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Outras atrações musicais:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${attractions
        .map((a) => `<li>${esc(a.description)}${[a.time, a.duration].filter(Boolean).length ? ` (${[a.time, a.duration].filter(Boolean).map(esc).join(', ')})` : ''}</li>`)
        .join('')}</ul>`
    : ''

  const musica = section(
    'Direção musical',
    topGenres + vetados + mustPlayHtml + doNotPlayHtml + refsHtml + kv('Música-assinatura', esc(data.signature_song)) + attractionsHtml,
  )

  const momentRows = momentDefs
    .filter((def) => data.moments?.[def.id]?.enabled)
    .map((def) => {
      const songs = (data.moments[def.id].songs || []).filter((s) => s.title_artist.trim())
      const songsHtml = songs.length ? songs.map((s) => songLine(s.title_artist, s.link)).join('<br>') : `<em style="color:${MUTED};">a definir</em>`
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #2c2440;font-size:14px;color:${TEXT};"><strong>${esc(def.label)}</strong><br>${songsHtml}</td></tr>`
    })
    .join('')
  const otherMoments = data.other_moments.trim()
    ? `<p style="margin:14px 0 0;font-size:14px;color:${TEXT};"><strong style="color:${MUTED};">Outros momentos:</strong> ${esc(data.other_moments)}</p>`
    : ''
  const roteiro = section('Roteiro de momentos especiais', momentRows ? `<table width="100%" cellpadding="0" cellspacing="0">${momentRows}</table>${otherMoments}` : otherMoments)

  const servicesHtml = data.optional_services.length
    ? `<p style="margin:0 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Serviços desejados:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${data.optional_services
        .map((v) => `<li>${esc(lbl(OPTIONAL_SERVICES, v))}</li>`)
        .join('')}</ul>`
    : ''
  const acksHtml = data.acknowledgements.length
    ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Ciências confirmadas (${data.acknowledgements.length}/${Object.keys(ACKNOWLEDGEMENTS).length}):</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:13px;">${data.acknowledgements
        .map((id) => `<li>${esc(lbl(ACKNOWLEDGEMENTS, id))}</li>`)
        .join('')}</ul>`
    : ''
  const operacao = section('Operação', kv('Estrutura de som', esc(lbl(SOUND_STRUCTURE, data.sound_structure))) + servicesHtml + acksHtml + kv('Observações', esc(data.notes)))

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:${BG};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        ${header}
        ${contato}
        ${publico}
        ${musica}
        ${roteiro}
        ${operacao}
        <tr><td style="padding:8px 24px 32px;text-align:center;color:${MUTED};font-size:12px;">
          Ficha gerada automaticamente pelo Briefing Mazik.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function pdfFilename(data: BriefingData): string {
  const slug = (data.respondent_name || 'briefing')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `briefing-${slug || 'mazik'}${data.event_date ? `-${data.event_date}` : ''}.pdf`
}

export async function sendBriefingEmail(data: BriefingData, pdfBase64?: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev'

  if (!apiKey || !to) {
    throw new Error('RESEND_API_KEY e NOTIFY_EMAIL precisam estar configuradas.')
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const subject = `Novo briefing: ${lbl(EVENT_TYPE, data.event_type)} de ${data.respondent_name} — ${data.event_date || 'data a definir'}`

  const attachments = pdfBase64 ? [{ filename: pdfFilename(data), content: Buffer.from(pdfBase64, 'base64') }] : undefined

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html: buildEmailHtml(data),
    replyTo: data.email || undefined,
    attachments,
  })

  if (error) {
    throw new Error(typeof error === 'string' ? error : (error as { message?: string }).message || 'Falha ao enviar e-mail')
  }
}
