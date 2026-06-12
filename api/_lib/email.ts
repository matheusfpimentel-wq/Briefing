import type { BriefingData } from './schema'
import {
  AGE_RANGE,
  ENERGY_PHASES_CORPORATE,
  ENERGY_PHASES_DEFAULT,
  ENERGY_SCALE,
  EVENT_TYPE,
  GENRE,
  GUEST_REQUESTS,
  MOMENTS,
  ROLE,
  SOUND_STRUCTURE,
  lbl,
} from './labels'

const ACCENT = '#8b5cf6'
const BG = '#0f0f17'
const CARD = '#1a1a24'
const TEXT = '#e2e8f0'
const MUTED = '#94a3b8'

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
  return `
    <tr><td style="padding:0 24px;">
      <div style="background:${CARD};border:1px solid #2a2a38;border-radius:14px;padding:20px;margin-bottom:16px;">
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
      <div style="background:#2a2a38;border-radius:8px;height:10px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,${ACCENT},#c4b5fd);height:10px;width:${pct}%;"></div>
      </div>
    </div>`
}

export function buildEmailHtml(data: BriefingData): string {
  const energyPhases = data.event_type === 'corporativo' ? ENERGY_PHASES_CORPORATE : ENERGY_PHASES_DEFAULT
  const momentDefs = MOMENTS[data.event_type] || []

  // ── Cabeçalho ──
  const header = `
    <tr><td style="padding:24px;">
      <div style="background:linear-gradient(135deg,${ACCENT},#4c1d95);border-radius:16px;padding:24px;">
        <p style="margin:0 0 6px;font-size:13px;color:#ede9fe;">🎧 Novo briefing</p>
        <h1 style="margin:0;font-size:22px;color:#fff;">${esc(lbl(EVENT_TYPE, data.event_type))} de ${esc(data.respondent_name)}</h1>
        <p style="margin:10px 0 0;font-size:14px;color:#ede9fe;">
          ${[data.event_date, [data.start_time, data.end_time].filter(Boolean).join('–')].filter(Boolean).map(esc).join(' · ')}
        </p>
      </div>
    </td></tr>`

  // ── Cabeçalho / contato ──
  const contato = section(
    'Evento e contato',
    kv('Cliente', `${esc(data.respondent_name)} (${esc(lbl(ROLE, data.respondent_role))})`) +
      kv('Tipo', esc(lbl(EVENT_TYPE, data.event_type))) +
      kv('Data', esc(data.event_date)) +
      kv('Horário', [data.start_time, data.end_time].filter(Boolean).map(esc).join(' às ')) +
      kv('Local', esc(data.venue)) +
      kv('Convidados', esc(data.guest_count)) +
      kv('E-mail', `<a href="mailto:${esc(data.email)}" style="color:${ACCENT};">${esc(data.email)}</a>`) +
      kv('WhatsApp', `<a href="${waLink(data.whatsapp)}" style="color:${ACCENT};">${esc(data.whatsapp)}</a>`),
  )

  // ── Leitura do público ──
  const publico = section(
    'Leitura do público',
    kv('Faixas etárias', data.age_ranges.map((v) => esc(lbl(AGE_RANGE, v))).join(', ')) +
      kv('Descrição', esc(data.audience_description)) +
      '<div style="margin-top:14px;">' +
      energyPhases.map((p) => energyBar(p.label, (data as any)[p.key] as number)).join('') +
      '</div>',
  )

  // ── Direção musical ──
  const topGenres =
    data.top_genres.length > 0
      ? `<ol style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${data.top_genres
          .map((v) => `<li>${esc(v === 'outro' && data.top_genre_other ? data.top_genre_other : lbl(GENRE, v))}</li>`)
          .join('')}</ol>`
      : ''
  const vetados =
    data.vetoed_genres.length > 0
      ? `<p style="margin:0 0 10px;font-size:14px;"><strong style="color:${MUTED};">Vetados:</strong> <span style="color:#f87171;font-weight:600;">${data.vetoed_genres
          .map((v) => esc(lbl(GENRE, v)))
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
      ? `<p style="margin:0 0 10px;font-size:14px;"><strong style="color:${MUTED};">Lista negra:</strong> <span style="color:#f87171;">${doNotPlay
          .map(esc)
          .join(', ')}</span></p>`
      : ''

  const musica = section(
    'Direção musical',
    (topGenres ? `<p style="margin:0 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Top 5 gêneros:</p>${topGenres}` : '') +
      vetados +
      mustPlayHtml +
      doNotPlayHtml +
      kv('Playlist de referência', data.reference_playlist ? `<a href="${esc(data.reference_playlist)}" style="color:${ACCENT};">abrir playlist</a>` : '') +
      kv('Música-assinatura', esc(data.signature_song)),
  )

  // ── Roteiro de momentos ──
  const momentRows = momentDefs
    .filter((def) => data.moments?.[def.id]?.enabled)
    .map((def) => {
      const songs = (data.moments[def.id].songs || []).filter((s) => s.title_artist.trim())
      const songsHtml = songs.length ? songs.map((s) => songLine(s.title_artist, s.link)).join('<br>') : '<em style="color:' + MUTED + ';">a definir</em>'
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #2a2a38;font-size:14px;color:${TEXT};"><strong>${esc(def.label)}</strong><br>${songsHtml}</td></tr>`
    })
    .join('')

  const otherMoments = data.other_moments.trim()
    ? `<p style="margin:14px 0 0;font-size:14px;color:${TEXT};"><strong style="color:${MUTED};">Outros momentos:</strong> ${esc(data.other_moments)}</p>`
    : ''

  const roteiro =
    momentRows || otherMoments
      ? section('Roteiro de momentos especiais', `<table width="100%" cellpadding="0" cellspacing="0">${momentRows}</table>${otherMoments}`)
      : ''

  // ── Operação ──
  const mc = data.has_mc ? `Sim — ${[data.mc_name, data.mc_contact].filter(Boolean).map(esc).join(' · ') || 'sem detalhes'}` : 'Não'
  const operacao = section(
    'Operação',
    kv('Estrutura de som', esc(lbl(SOUND_STRUCTURE, data.sound_structure))) +
      kv('Política de pedidos', esc(lbl(GUEST_REQUESTS, data.guest_requests_policy))) +
      kv('MC / cerimonial', mc) +
      kv('Observações', esc(data.notes)),
  )

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

  // Import dinâmico: se a lib falhar ao carregar, o erro é capturável
  // (vira mensagem amigável em vez de derrubar a função).
  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const subject = `🎧 Novo briefing: ${lbl(EVENT_TYPE, data.event_type)} de ${data.respondent_name} — ${data.event_date || 'data a definir'}`

  const attachments = pdfBase64
    ? [{ filename: pdfFilename(data), content: Buffer.from(pdfBase64, 'base64') }]
    : undefined

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
