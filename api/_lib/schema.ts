import { z } from 'zod'

// Validação no servidor. Espelha src/lib/types.ts.

const songRef = z.object({
  title_artist: z.string().max(300).default(''),
  link: z.string().max(1000).optional().default(''),
})

const momentValue = z.object({
  enabled: z.boolean().default(false),
  songs: z.array(songRef).max(20).default([]),
})

// Schema completo (todos os campos), usado de forma tolerante no /save
// e estrito no /submit.
export const briefingDataSchema = z.object({
  respondent_name: z.string().max(200).default(''),
  respondent_role: z.string().max(60).default(''),
  whatsapp: z.string().max(40).default(''),
  email: z.string().max(200).default(''),
  event_type: z.string().max(40).default(''),
  event_date: z.string().max(20).default(''),
  start_time: z.string().max(10).default(''),
  end_time: z.string().max(10).default(''),
  venue: z.string().max(300).default(''),
  guest_count: z.string().max(20).default(''),

  age_ranges: z.array(z.string().max(20)).max(10).default([]),
  audience_description: z.string().max(1000).default(''),

  energy_reception: z.number().int().min(1).max(5).default(3),
  energy_dinner: z.number().int().min(1).max(5).default(3),
  energy_dancefloor: z.number().int().min(1).max(5).default(4),

  top_genres: z.array(z.string().max(40)).max(10).default([]),
  top_genre_other: z.string().max(120).default(''),
  vetoed_genres: z.array(z.string().max(40)).max(10).default([]),
  must_play: z.array(songRef).max(20).default([]),
  do_not_play: z.array(z.string().max(300)).max(30).default([]),
  reference_playlist: z.string().max(1000).default(''),
  signature_song: z.string().max(300).default(''),

  moments: z.record(z.string(), momentValue).default({}),
  other_moments: z.string().max(1500).default(''),
  has_mc: z.boolean().default(false),
  mc_name: z.string().max(200).default(''),
  mc_contact: z.string().max(200).default(''),

  sound_structure: z.string().max(40).default(''),
  guest_requests_policy: z.string().max(40).default(''),
  notes: z.string().max(2000).default(''),
})

export type BriefingData = z.infer<typeof briefingDataSchema>

const uuid = z.string().uuid()

// /save — parcial e tolerante
export const saveSchema = z.object({
  id: uuid,
  currentStep: z.number().int().min(0).max(100).optional(),
  data: briefingDataSchema.partial(),
})

// /submit — exige os campos essenciais
export const submitSchema = z.object({
  id: uuid,
  data: briefingDataSchema.superRefine((d, ctx) => {
    if (!d.respondent_name.trim()) ctx.addIssue({ code: 'custom', path: ['respondent_name'], message: 'Nome é obrigatório' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) ctx.addIssue({ code: 'custom', path: ['email'], message: 'E-mail inválido' })
    const phone = d.whatsapp.replace(/\D/g, '')
    if (phone.length < 10) ctx.addIssue({ code: 'custom', path: ['whatsapp'], message: 'WhatsApp inválido' })
    if (!d.event_type) ctx.addIssue({ code: 'custom', path: ['event_type'], message: 'Tipo de evento é obrigatório' })
  }),
})
