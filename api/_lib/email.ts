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
  VENDOR_TYPE,
  innovationLabel,
  lbl,
} from './labels.js'

const VIOLET = '#6d28d9'
const GOLD = '#b08d49'
const PAGE = '#f4f2f8'
const CARD = '#ffffff'
const TEXT = '#1f1b2e'
const MUTED = '#6e667a'
const TRACK = '#e6e2f0'

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toMinE(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

function fmtDate(iso: string): string {
  const m = (iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso
}

function waLink(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, '')
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${withCountry}`
}

function songLine(title: string, link?: string): string {
  const safe = esc(title)
  if (link && /^https?:\/\//i.test(link)) return `${safe} — <a href="${esc(link)}" style="color:${VIOLET};">ouvir</a>`
  return safe
}

function band(text: string): string {
  return `<tr><td style="padding:18px 24px 6px;"><div style="background:${VIOLET};border-radius:8px;padding:10px 16px;"><span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${esc(text)}</span></div></td></tr>`
}

function sub(title: string, inner: string): string {
  if (!inner.trim()) return ''
  return `<tr><td style="padding:6px 24px;">
    <div style="background:${CARD};border:1px solid ${TRACK};border-radius:12px;padding:18px;margin-bottom:8px;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${VIOLET};border-bottom:2px solid ${GOLD};display:inline-block;padding-bottom:3px;">${esc(title)}</p>
      ${inner}
    </div>
  </td></tr>`
}

function kv(label: string, value: string): string {
  if (!value) return ''
  return `<p style="margin:0 0 8px;font-size:14px;color:${TEXT};"><strong style="color:${MUTED};font-weight:600;">${esc(label)}:</strong> ${value}</p>`
}

function energyBar(label: string, value: number, max: number, scaleText: string): string {
  const pct = (value / max) * 100
  return `<div style="margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;font-size:13px;color:${TEXT};margin-bottom:4px;">
      <span>${esc(label)}</span><span style="color:${VIOLET};">${value}/${max} · ${esc(scaleText)}</span>
    </div>
    <div style="background:${TRACK};border-radius:8px;height:9px;overflow:hidden;"><div style="background:${VIOLET};height:9px;width:${pct}%;"></div></div>
  </div>`
}

interface RItem { label: string; time: string; detail: string; key: string }

function serverRoteiro(data: BriefingData): RItem[] {
  const items: RItem[] = []
  ;(MOMENTS[data.event_type] || []).forEach((def) => {
    const m = data.moments?.[def.id]
    if (!m?.enabled) return
    const songs = (m.songs || []).filter((s) => s.title_artist.trim()).map((s) => s.title_artist)
    items.push({ key: `moment:${def.id}`, label: def.label, time: m.time || '', detail: songs.join(' · ') })
  })
  data.custom_moments.forEach((c, i) => {
    if (!c.description.trim()) return
    items.push({ key: `custom:${i}`, label: c.description, time: c.time || '', detail: c.song || '' })
  })
  data.other_attractions.forEach((a, i) => {
    if (!a.description.trim()) return
    const dur = Number(a.duration) || 0
    items.push({ key: `attr:${i}`, label: a.description, time: a.time || '', detail: dur ? `Atração · ${dur} min` : 'Atração' })
  })
  const order = data.roteiro_order || []
  const anchor = data.start_time ? toMinE(data.start_time) : 18 * 60
  const sval = (time: string) => {
    if (!time) return Number.POSITIVE_INFINITY
    const t = toMinE(time)
    return t >= anchor ? t - anchor : t - anchor + 1440
  }
  const byTime = (a: RItem, b: RItem) => sval(a.time) - sval(b.time)
  if (order.length) {
    const idx = (k: string) => {
      const i = order.indexOf(k)
      return i === -1 ? Number.POSITIVE_INFINITY : i
    }
    items.sort((a, b) => {
      const ia = idx(a.key)
      const ib = idx(b.key)
      return ia === Number.POSITIVE_INFINITY && ib === Number.POSITIVE_INFINITY ? byTime(a, b) : ia - ib
    })
  } else {
    items.sort(byTime)
  }
  return items
}

export function buildEmailHtml(data: BriefingData, editUrl = ''): string {
  const phases = data.event_type === 'corporativo' ? ENERGY_PHASES_CORPORATE : ENERGY_PHASES_DEFAULT

  const header = `<tr><td style="padding:24px;">
    <div style="background:${VIOLET};border-radius:14px;padding:22px;border-bottom:3px solid ${GOLD};">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;color:#d8c9f5;text-transform:uppercase;">Briefing Mazik · Curadoria musical</p>
      <h1 style="margin:0;font-size:21px;color:#fff;">${esc(lbl(EVENT_TYPE, data.event_type) || 'Evento')} de ${esc(data.respondent_name)}</h1>
      <p style="margin:10px 0 0;font-size:13px;color:#e5dbf8;">${[fmtDate(data.event_date), [data.start_time, data.end_time].filter(Boolean).join('–'), data.venue].filter(Boolean).map(esc).join(' · ')}</p>
    </div>
  </td></tr>`

  const editBlock = editUrl
    ? `<tr><td style="padding:0 24px 8px;">
        <div style="border:1px solid ${TRACK};border-radius:12px;padding:14px 16px;background:${CARD};">
          <p style="margin:0 0 8px;font-size:13px;color:${MUTED};">Quer ajustar com o cliente na reunião?</p>
          <a href="${esc(editUrl)}" style="display:inline-block;background:${VIOLET};color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:9px 16px;border-radius:8px;">Continuar editando este briefing</a>
          <p style="margin:8px 0 0;font-size:11px;color:${MUTED};word-break:break-all;">${esc(editUrl)}</p>
        </div>
      </td></tr>`
    : ''

  // INFORMAÇÕES GERAIS
  const evento = sub(
    'Evento',
    kv('Cliente', `${esc(data.respondent_name)} (${esc(lbl(ROLE, data.respondent_role))})`) +
      kv('Tipo', esc(lbl(EVENT_TYPE, data.event_type))) +
      kv('Local', esc(data.venue)) +
      kv('Data', esc(fmtDate(data.event_date))) +
      kv('Horário', [data.start_time, data.end_time].filter(Boolean).map(esc).join(' às ')) +
      kv('E-mail', `<a href="mailto:${esc(data.email)}" style="color:${VIOLET};">${esc(data.email)}</a>`) +
      kv('WhatsApp', `<a href="${waLink(data.whatsapp)}" style="color:${VIOLET};">${esc(data.whatsapp)}</a>`),
  )
  const publico = sub(
    'Público',
    kv('Convidados', esc(data.guest_count)) +
      kv('Faixas etárias', data.age_ranges.map((v) => esc(lbl(AGE_RANGE, v))).join(', ')) +
      kv('Vibe', data.audience_vibe.map((v) => esc(lbl(AUDIENCE_VIBE, v))).join(', ')) +
      kv('Descrição', esc(data.audience_description)),
  )

  // CURADORIA MUSICAL
  const atmosfera = sub(
    'Atmosfera escolhida',
    phases.map((p) => energyBar(p.label, (data as Record<string, unknown>)[p.key] as number, 5, ENERGY_SCALE[(data as Record<string, unknown>)[p.key] as number] || '')).join('') +
      energyBar('Curva de inovação', data.innovation, 10, innovationLabel(data.innovation)),
  )

  const topGenres = data.top_genres.length
    ? `<p style="margin:0 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Vibes (em ordem):</p><ol style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${data.top_genres.map((v) => `<li>${esc(v)}</li>`).join('')}</ol>`
    : ''
  const vetados = data.vetoed_genres.length
    ? `<p style="margin:0 0 10px;font-size:14px;"><strong style="color:${MUTED};">Vetadas:</strong> <span style="color:#b91c1c;font-weight:600;">${data.vetoed_genres.map((v) => esc(v)).join(', ')}</span></p>`
    : ''
  const mustPlay = data.must_play.filter((m) => m.title_artist.trim())
  const mustPlayHtml = mustPlay.length
    ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Têm que tocar:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${mustPlay.map((m) => `<li>${songLine(m.title_artist, m.link)}</li>`).join('')}</ul>`
    : ''
  const doNotPlay = data.do_not_play.filter((d) => d.trim())
  const doNotPlayHtml = doNotPlay.length
    ? `<p style="margin:0 0 10px;font-size:14px;"><strong style="color:${MUTED};">Lista negra:</strong> <span style="color:#b91c1c;">${doNotPlay.map(esc).join(', ')}</span></p>`
    : ''
  const refs = data.references.filter((r) => r.value.trim())
  const refsHtml = refs.length
    ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Referências:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${refs.map((r) => `<li>${esc(lbl(REFERENCE_TYPE, r.type))}: ${songLine(r.value, /^https?:\/\//i.test(r.value) ? r.value : undefined)}</li>`).join('')}</ul>`
    : ''
  const attractions = data.other_attractions.filter((a) => a.description.trim())
  const attractionsHtml = attractions.length
    ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Outras atrações musicais:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${attractions.map((a) => `<li>${esc(a.description)}${[a.time, a.duration].filter(Boolean).length ? ` (${[a.time, a.duration].filter(Boolean).map(esc).join(', ')})` : ''}</li>`).join('')}</ul>`
    : ''
  const direcao = sub('Direção', topGenres + mustPlayHtml + vetados + doNotPlayHtml + refsHtml + attractionsHtml + kv('Música-assinatura', esc(data.signature_song)))

  // ROTEIRO
  const roteiroItems = serverRoteiro(data)
  const roteiroRows = roteiroItems
    .map(
      (it) =>
        `<tr>
          <td style="padding:9px 10px 9px 0;font-size:14px;font-weight:700;color:${GOLD};white-space:nowrap;vertical-align:top;border-bottom:1px solid ${TRACK};">${esc(it.time || '—')}</td>
          <td style="padding:9px 0;font-size:14px;color:${TEXT};border-bottom:1px solid ${TRACK};"><strong>${esc(it.label)}</strong>${it.detail ? `<br><span style="color:${MUTED};font-size:13px;">${esc(it.detail)}</span>` : ''}</td>
        </tr>`,
    )
    .join('')
  const roteiroInner = roteiroRows ? `<table width="100%" cellpadding="0" cellspacing="0">${roteiroRows}</table>` : ''
  const roteiro = roteiroInner.trim() ? sub('Sequência do evento', roteiroInner) : ''

  // OPERAÇÃO
  const servicesHtml = data.optional_services.length
    ? `<p style="margin:0 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Serviços desejados:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${data.optional_services.map((v) => `<li>${esc(lbl(OPTIONAL_SERVICES, v))}</li>`).join('')}</ul>`
    : ''
  const acksHtml = data.acknowledgements.length
    ? `<p style="margin:10px 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Ciências confirmadas (${data.acknowledgements.length}/${Object.keys(ACKNOWLEDGEMENTS).length}):</p><ul style="margin:0;padding-left:20px;color:${TEXT};font-size:13px;">${data.acknowledgements.map((id) => `<li>${esc(lbl(ACKNOWLEDGEMENTS, id))}</li>`).join('')}</ul>`
    : ''
  const vendors = data.vendors.filter((v) => v.name.trim() || v.contact.trim())
  const vendorsHtml = vendors.length
    ? `<p style="margin:0 0 4px;font-size:14px;color:${MUTED};font-weight:600;">Fornecedores:</p><ul style="margin:0 0 10px;padding-left:20px;color:${TEXT};font-size:14px;">${vendors.map((v) => `<li>${esc(lbl(VENDOR_TYPE, v.type))}: ${[v.name, v.contact].filter(Boolean).map(esc).join(' · ')}</li>`).join('')}</ul>`
    : ''
  const operacao = sub('Operação', servicesHtml + vendorsHtml + kv('Observações', esc(data.notes)) + acksHtml)

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:${PAGE};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        ${header}
        ${editBlock}
        ${band('Informações gerais')}${evento}${publico}
        ${band('Curadoria musical')}${atmosfera}${direcao}
        ${roteiro ? band('Roteiro') + roteiro : ''}
        ${band('Operação')}${operacao}
        <tr><td style="padding:14px 24px 32px;text-align:center;color:${MUTED};font-size:12px;">Ficha gerada automaticamente pelo Briefing Mazik.</td></tr>
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

export async function sendBriefingEmail(data: BriefingData, pdfBase64?: string, editUrl = ''): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev'
  if (!apiKey || !to) throw new Error('RESEND_API_KEY e NOTIFY_EMAIL precisam estar configuradas.')

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const subject = `Novo briefing: ${lbl(EVENT_TYPE, data.event_type)} de ${data.respondent_name} — ${fmtDate(data.event_date) || 'data a definir'}`
  const attachments = pdfBase64 ? [{ filename: pdfFilename(data), content: Buffer.from(pdfBase64, 'base64') }] : undefined

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html: buildEmailHtml(data, editUrl),
    replyTo: data.email || undefined,
    attachments,
  })
  if (error) throw new Error(typeof error === 'string' ? error : (error as { message?: string }).message || 'Falha ao enviar e-mail')
}
