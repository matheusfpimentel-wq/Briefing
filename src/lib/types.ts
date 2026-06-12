// Tipos centrais do briefing. Mantidos em sincronia com a validação
// do servidor em api/_lib/schema.ts.

export type BriefingStatus = 'in_progress' | 'completed'

export interface SongRef {
  title_artist: string
  link?: string
}

/** Um momento especial: vai acontecer? e qual(is) música(s). */
export interface MomentValue {
  enabled: boolean
  songs: SongRef[]
}

/** Referência de clima: a pessoa escolhe o tipo e cola o link/descrição. */
export interface ReferenceItem {
  type: string
  value: string
}

export interface BriefingData {
  // ── Bloco 1 — Evento e contato ──
  respondent_name: string
  respondent_role: string
  whatsapp: string
  email: string
  event_type: string
  event_date: string
  start_time: string
  end_time: string
  venue: string

  // ── Bloco 2 — Público ──
  guest_count: string
  age_ranges: string[]
  audience_vibe: string[]
  audience_description: string

  // ── Bloco 3 — Atmosfera por fase (1 a 5) ──
  energy_reception: number
  energy_dinner: number
  energy_dancefloor: number
  // Curva de inovação (0 = clichê total, 10 = pode inventar moda)
  innovation: number

  // ── Bloco 4 — Música ──
  top_genres: string[]
  vetoed_genres: string[]
  must_play: SongRef[]
  do_not_play: string[]
  references: ReferenceItem[]
  signature_song: string

  // ── Bloco 5 — Momentos especiais ──
  moments: Record<string, MomentValue>
  other_moments: string

  // ── Bloco 6 — Operação ──
  sound_structure: string
  optional_services: string[]
  acknowledgements: string[]
  notes: string
}

export interface BriefingState {
  id: string
  status: BriefingStatus
  currentStep: number
  data: BriefingData
}
