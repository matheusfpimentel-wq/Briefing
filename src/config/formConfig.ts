// ════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO CENTRAL DO FORMULÁRIO
// Adicione, remova ou reordene perguntas aqui. Cada "step" é uma tela.
// ════════════════════════════════════════════════════════════════

import type { BriefingData } from '@/lib/types'
import { isEmail, isPhoneBR, isUrl } from '@/lib/validation'
import {
  AGE_RANGE_OPTIONS,
  EVENT_TYPE_OPTIONS,
  GENRE_OPTIONS,
  GUEST_REQUESTS_OPTIONS,
  Option,
  ROLE_OPTIONS,
  SOUND_STRUCTURE_OPTIONS,
  momentsFor,
} from './options'

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'time'
  | 'number'
  | 'textarea'
  | 'select'
  | 'toggle'

export interface FieldDef {
  name: keyof BriefingData
  type: FieldType
  label: string
  placeholder?: string
  options?: Option[]
  required?: boolean
  help?: string
  /** Renderiza o campo apenas quando a condição for verdadeira. */
  showWhen?: (data: BriefingData) => boolean
}

/** Componentes de tela especiais (widgets customizados). */
export type CustomStep =
  | 'ageRanges'
  | 'energy'
  | 'topGenres'
  | 'vetoed'
  | 'mustPlay'
  | 'doNotPlay'
  | 'moments'
  | 'summary'

export interface StepDef {
  id: string
  block: number
  blockLabel: string
  title: string
  subtitle?: string
  /** Campos genéricos OU um componente customizado. */
  fields?: FieldDef[]
  custom?: CustomStep
  /** Mostra a etapa só quando aplicável (lógica condicional). */
  when?: (data: BriefingData) => boolean
  /** Retorna mapa campo -> mensagem de erro. Vazio = válido. */
  validate?: (data: BriefingData) => Record<string, string>
}

export const TOTAL_TOP_GENRES = 5
export const MAX_VETOED_GENRES = 3
export const MAX_MUST_PLAY = 10

export const STEPS: StepDef[] = [
  // ─────────────── BLOCO 1 — EVENTO E CONTATO ───────────────
  {
    id: 'name',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Pra começar, como é seu nome?',
    fields: [
      { name: 'respondent_name', type: 'text', label: 'Seu nome', required: true, placeholder: 'Ex.: Marina Costa' },
      { name: 'respondent_role', type: 'select', label: 'Você é...', options: ROLE_OPTIONS, required: true },
    ],
    validate: (d) => {
      const e: Record<string, string> = {}
      if (!d.respondent_name.trim()) e.respondent_name = 'Conta pra mim seu nome 🙂'
      if (!d.respondent_role) e.respondent_role = 'Selecione uma opção'
      return e
    },
  },
  {
    id: 'contact',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Como falo com você?',
    subtitle: 'Uso só para alinhar detalhes do seu evento.',
    fields: [
      { name: 'whatsapp', type: 'tel', label: 'WhatsApp', required: true, placeholder: '(11) 99999-9999' },
      { name: 'email', type: 'email', label: 'E-mail', required: true, placeholder: 'voce@email.com' },
    ],
    validate: (d) => {
      const e: Record<string, string> = {}
      if (!isPhoneBR(d.whatsapp)) e.whatsapp = 'Informe um WhatsApp com DDD'
      if (!isEmail(d.email)) e.email = 'Informe um e-mail válido'
      return e
    },
  },
  {
    id: 'event_type',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Que tipo de evento vamos embalar?',
    fields: [{ name: 'event_type', type: 'select', label: 'Tipo de evento', options: EVENT_TYPE_OPTIONS, required: true }],
    validate: (d): Record<string, string> => (d.event_type ? {} : { event_type: 'Selecione o tipo de evento' }),
  },
  {
    id: 'when',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Quando vai ser?',
    fields: [
      { name: 'event_date', type: 'date', label: 'Data do evento' },
      { name: 'start_time', type: 'time', label: 'Horário de início' },
      { name: 'end_time', type: 'time', label: 'Horário de término' },
    ],
  },
  {
    id: 'venue',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Onde e para quantas pessoas?',
    fields: [
      { name: 'venue', type: 'text', label: 'Local e cidade', placeholder: 'Ex.: Espaço Villa, São Paulo' },
      { name: 'guest_count', type: 'number', label: 'Nº estimado de convidados', placeholder: 'Ex.: 150' },
    ],
  },

  // ─────────────── BLOCO 2 — PÚBLICO ───────────────
  {
    id: 'age',
    block: 2,
    blockLabel: 'Público',
    title: 'Quais faixas etárias predominam entre os convidados?',
    subtitle: 'Pode marcar mais de uma.',
    custom: 'ageRanges',
    validate: (d): Record<string, string> => (d.age_ranges.length ? {} : { age_ranges: 'Selecione ao menos uma faixa' }),
  },
  {
    id: 'audience',
    block: 2,
    blockLabel: 'Público',
    title: 'Descreva seu público em uma frase',
    subtitle: 'Opcional, mas ajuda muito na leitura do clima.',
    fields: [
      {
        name: 'audience_description',
        type: 'textarea',
        label: 'Seu público',
        placeholder: 'Ex.: galera animada, família grande, mistura de jovens e tios que adoram dançar.',
      },
    ],
  },

  // ─────────────── BLOCO 3 — ATMOSFERA ───────────────
  {
    id: 'energy',
    block: 3,
    blockLabel: 'Atmosfera',
    title: 'Qual a energia de cada fase?',
    subtitle: '1 = ambiente/relaxado · 5 = festa total',
    custom: 'energy',
  },

  // ─────────────── BLOCO 4 — MÚSICA ───────────────
  {
    id: 'topGenres',
    block: 4,
    blockLabel: 'Música',
    title: 'Os 5 gêneros que não podem faltar',
    subtitle: 'Toque para adicionar na ordem de importância. Arraste para reordenar.',
    custom: 'topGenres',
    validate: (d): Record<string, string> =>
      d.top_genres.length === TOTAL_TOP_GENRES
        ? {}
        : { top_genres: `Escolha exatamente ${TOTAL_TOP_GENRES} gêneros` },
  },
  {
    id: 'vetoed',
    block: 4,
    blockLabel: 'Música',
    title: 'Tem algum gênero que NÃO deve tocar?',
    subtitle: `Até ${MAX_VETOED_GENRES}. Não pode estar entre os seus top 5.`,
    custom: 'vetoed',
  },
  {
    id: 'mustPlay',
    block: 4,
    blockLabel: 'Música',
    title: 'Músicas ou artistas que TÊM que tocar',
    subtitle: `Até ${MAX_MUST_PLAY} itens. O link é opcional (Spotify/YouTube).`,
    custom: 'mustPlay',
  },
  {
    id: 'doNotPlay',
    block: 4,
    blockLabel: 'Música',
    title: 'Tem alguma música ou artista PROIBIDO?',
    subtitle: 'Aquilo que não pode tocar de jeito nenhum.',
    custom: 'doNotPlay',
  },
  {
    id: 'refs',
    block: 4,
    blockLabel: 'Música',
    title: 'Referências do clima',
    fields: [
      {
        name: 'reference_playlist',
        type: 'text',
        label: 'Tem uma playlist que representa o clima da festa? Cole o link',
        placeholder: 'https://open.spotify.com/playlist/...',
      },
      {
        name: 'signature_song',
        type: 'text',
        label: 'Se uma música definisse você/vocês, qual seria?',
        placeholder: 'Ex.: Sweet Disposition — The Temper Trap',
      },
    ],
    validate: (d): Record<string, string> =>
      isUrl(d.reference_playlist) ? {} : { reference_playlist: 'Cole um link válido (ou deixe em branco)' },
  },

  // ─────────────── BLOCO 5 — MOMENTOS ESPECIAIS ───────────────
  {
    id: 'moments',
    block: 5,
    blockLabel: 'Momentos especiais',
    title: 'Momentos especiais',
    subtitle: 'Marque os que vão acontecer e diga a música de cada um.',
    custom: 'moments',
    when: (d) => momentsFor(d.event_type).length > 0,
  },
  {
    id: 'other_moments',
    block: 5,
    blockLabel: 'Momentos especiais',
    title: 'Algum outro momento especial?',
    subtitle: 'Opcional. Descreva e diga a música.',
    fields: [
      {
        name: 'other_moments',
        type: 'textarea',
        label: 'Outros momentos',
        placeholder: 'Ex.: surpresa para a mãe na hora do bolo — tocar “Trem-Bala”.',
      },
    ],
  },
  {
    id: 'mc',
    block: 5,
    blockLabel: 'Momentos especiais',
    title: 'Terá mestre de cerimônias ou cerimonialista?',
    fields: [
      { name: 'has_mc', type: 'toggle', label: 'Vai ter MC / cerimonialista' },
      { name: 'mc_name', type: 'text', label: 'Nome do MC / cerimonial', showWhen: (d) => d.has_mc, placeholder: 'Nome' },
      {
        name: 'mc_contact',
        type: 'text',
        label: 'Contato do MC / cerimonial',
        showWhen: (d) => d.has_mc,
        placeholder: 'WhatsApp ou e-mail',
      },
    ],
  },

  // ─────────────── BLOCO 6 — OPERAÇÃO ───────────────
  {
    id: 'operation',
    block: 6,
    blockLabel: 'Operação',
    title: 'Como fica a parte técnica?',
    fields: [
      { name: 'sound_structure', type: 'select', label: 'Estrutura de som e luz', options: SOUND_STRUCTURE_OPTIONS, required: true },
      { name: 'guest_requests_policy', type: 'select', label: 'Política de pedidos dos convidados', options: GUEST_REQUESTS_OPTIONS, required: true },
    ],
    validate: (d) => {
      const e: Record<string, string> = {}
      if (!d.sound_structure) e.sound_structure = 'Selecione uma opção'
      if (!d.guest_requests_policy) e.guest_requests_policy = 'Selecione uma opção'
      return e
    },
  },
  {
    id: 'notes',
    block: 6,
    blockLabel: 'Operação',
    title: 'Algo mais que eu deva saber?',
    subtitle: 'Opcional. Esse espaço é seu.',
    fields: [{ name: 'notes', type: 'textarea', label: 'Observações', placeholder: 'Conte aqui qualquer detalhe importante.' }],
  },

  // ─────────────── RESUMO ───────────────
  {
    id: 'summary',
    block: 7,
    blockLabel: 'Revisão',
    title: 'Confira tudo antes de enviar',
    subtitle: 'Pode editar qualquer bloco. Quando estiver certinho, é só enviar.',
    custom: 'summary',
  },
]

export function createEmptyBriefing(): BriefingData {
  return {
    respondent_name: '',
    respondent_role: '',
    whatsapp: '',
    email: '',
    event_type: '',
    event_date: '',
    start_time: '',
    end_time: '',
    venue: '',
    guest_count: '',
    age_ranges: [],
    audience_description: '',
    energy_reception: 3,
    energy_dinner: 3,
    energy_dancefloor: 4,
    top_genres: [],
    top_genre_other: '',
    vetoed_genres: [],
    must_play: [],
    do_not_play: [],
    reference_playlist: '',
    signature_song: '',
    moments: {},
    other_moments: '',
    has_mc: false,
    mc_name: '',
    mc_contact: '',
    sound_structure: '',
    guest_requests_policy: '',
    notes: '',
  }
}

/** Lista de blocos para o índice/resumo. */
export const BLOCKS: { block: number; label: string }[] = [
  { block: 1, label: 'Evento e contato' },
  { block: 2, label: 'Público' },
  { block: 3, label: 'Atmosfera' },
  { block: 4, label: 'Música' },
  { block: 5, label: 'Momentos especiais' },
  { block: 6, label: 'Operação' },
]

// Re-export para conveniência
export { AGE_RANGE_OPTIONS, GENRE_OPTIONS }
