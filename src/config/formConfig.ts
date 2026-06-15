// ════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO CENTRAL DO FORMULÁRIO
// Adicione, remova ou reordene perguntas aqui. Cada "step" é uma tela.
// ════════════════════════════════════════════════════════════════

import type { BriefingData } from '@/lib/types'
import { isEmail, isPhoneBR } from '@/lib/validation'
import { EVENT_TYPE_OPTIONS, Option, ROLE_OPTIONS, momentsFor } from './options'

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'time'
  | 'number'
  | 'textarea'
  | 'select'

export interface FieldDef {
  name: keyof BriefingData
  type: FieldType
  label: string
  placeholder?: string
  options?: Option[]
  required?: boolean
  help?: string
}

/** Componentes de tela especiais (widgets customizados). */
export type CustomStep =
  | 'welcome'
  | 'audience'
  | 'energy'
  | 'topGenres'
  | 'vetoed'
  | 'mustPlay'
  | 'doNotPlay'
  | 'references'
  | 'attractions'
  | 'moments'
  | 'customMoments'
  | 'roteiro'
  | 'services'
  | 'vendors'
  | 'acknowledgements'
  | 'summary'

export interface StepDef {
  id: string
  block: number
  blockLabel: string
  title: string
  subtitle?: string
  fields?: FieldDef[]
  custom?: CustomStep
  /** Texto do botão de avançar (default "Avançar"). */
  nextLabel?: string
  when?: (data: BriefingData) => boolean
  validate?: (data: BriefingData) => Record<string, string>
}

export const MAX_MUST_PLAY = 10

export const STEPS: StepDef[] = [
  // ─────────────── BOAS-VINDAS ───────────────
  {
    id: 'welcome',
    block: 0,
    blockLabel: 'Início',
    title: 'Vamos desenhar a trilha do seu evento',
    custom: 'welcome',
    nextLabel: 'Começar',
  },

  // ─────────────── BLOCO 1 — EVENTO E CONTATO ───────────────
  {
    id: 'contact',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Pra começar, seus dados de contato',
    subtitle: 'Só isto eu preciso pra falar com você. O resto é tranquilo.',
    fields: [
      { name: 'respondent_name', type: 'text', label: 'Seu nome', required: true, placeholder: 'Ex.: Marina Costa' },
      { name: 'respondent_role', type: 'select', label: 'Você é...', options: ROLE_OPTIONS },
      { name: 'whatsapp', type: 'tel', label: 'WhatsApp', required: true, placeholder: '(11) 99999-9999' },
      { name: 'email', type: 'email', label: 'E-mail', required: true, placeholder: 'voce@email.com' },
    ],
    validate: (d) => {
      const e: Record<string, string> = {}
      if (!d.respondent_name.trim()) e.respondent_name = 'Conta pra mim seu nome :)'
      if (!isPhoneBR(d.whatsapp)) e.whatsapp = 'Informe um WhatsApp com DDD'
      if (!isEmail(d.email)) e.email = 'Informe um e-mail válido'
      return e
    },
  },
  {
    id: 'event_type',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Qual é o tipo de evento?',
    fields: [{ name: 'event_type', type: 'select', label: 'Tipo de evento', options: EVENT_TYPE_OPTIONS }],
  },
  {
    id: 'where_when',
    block: 1,
    blockLabel: 'Evento e contato',
    title: 'Onde e quando vai rolar?',
    fields: [
      { name: 'venue', type: 'text', label: 'Local e cidade', placeholder: 'Ex.: Espaço Villa, São Paulo' },
      { name: 'event_date', type: 'date', label: 'Data do evento' },
      { name: 'start_time', type: 'time', label: 'Horário de início' },
      { name: 'end_time', type: 'time', label: 'Horário de término' },
    ],
  },

  // ─────────────── BLOCO 2 — PÚBLICO ───────────────
  {
    id: 'audience',
    block: 2,
    blockLabel: 'Público',
    title: 'Quem vai estar na festa?',
    subtitle: 'Isso me ajuda a sacar a cara da galera.',
    custom: 'audience',
  },

  // ─────────────── BLOCO 3 — ATMOSFERA ───────────────
  {
    id: 'energy',
    block: 3,
    blockLabel: 'Atmosfera',
    title: 'Qual a energia de cada fase?',
    subtitle: 'De climão lounge a club total: arraste cada fase.',
    custom: 'energy',
  },

  // ─────────────── BLOCO 4 — MÚSICA ───────────────
  {
    id: 'topGenres',
    block: 4,
    blockLabel: 'Música',
    title: 'Quais vibes não podem faltar?',
    subtitle: 'Escolha quantas quiser e adicione as suas. A ordem mostra a prioridade.',
    custom: 'topGenres',
  },
  {
    id: 'mustPlay',
    block: 4,
    blockLabel: 'Música',
    title: 'Músicas ou artistas que TÊM que tocar',
    subtitle: `Até ${MAX_MUST_PLAY} itens. O link é opcional (Spotify ou YouTube).`,
    custom: 'mustPlay',
  },
  {
    id: 'vetoed',
    block: 4,
    blockLabel: 'Música',
    title: 'Tem alguma vibe que NÃO combina?',
    subtitle: 'Quantas quiser. O que você escolheu antes não aparece aqui.',
    custom: 'vetoed',
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
    id: 'references',
    block: 4,
    blockLabel: 'Música',
    title: 'Referências do clima',
    subtitle: 'Playlists, fotos, Pinterest, vídeos. Cole o que representa a vibe.',
    custom: 'references',
  },
  {
    id: 'attractions',
    block: 4,
    blockLabel: 'Música',
    title: 'Vai ter outra atração musical?',
    subtitle: 'Banda, cantor, sax ao vivo, percussão. Me conte o horário e quanto tempo dura, pra eu planejar as transições.',
    custom: 'attractions',
  },

  // ─────────────── BLOCO 5 — MOMENTOS ESPECIAIS ───────────────
  {
    id: 'moments',
    block: 5,
    blockLabel: 'Momentos especiais',
    title: 'Momentos especiais',
    subtitle: 'Marque os que vão acontecer, a música e (se quiser) o horário.',
    custom: 'moments',
    when: (d) => momentsFor(d.event_type).length > 0,
  },
  {
    id: 'customMoments',
    block: 5,
    blockLabel: 'Momentos especiais',
    title: 'Algum outro momento especial?',
    subtitle: 'Opcional. Descreva, diga a música e o horário (se já souber). Entra no roteiro.',
    custom: 'customMoments',
  },
  {
    id: 'roteiro',
    block: 5,
    blockLabel: 'Momentos especiais',
    title: 'Roteiro do evento',
    subtitle: 'Organize a ordem dos momentos e atrações. Quem tem horário entra na hora certa; o resto você arrasta pra ordenar.',
    custom: 'roteiro',
    when: (d) =>
      momentsFor(d.event_type).some((m) => d.moments[m.id]?.enabled) ||
      d.other_attractions.some((a) => a.description.trim()) ||
      d.custom_moments.some((m) => m.description.trim()),
  },

  // ─────────────── BLOCO 6 — OPERAÇÃO ───────────────
  {
    id: 'services',
    block: 6,
    blockLabel: 'Operação',
    title: 'Serviços que você gostaria de ter',
    subtitle: 'Marque o que faz sentido pra sua festa.',
    custom: 'services',
  },
  {
    id: 'vendors',
    block: 6,
    blockLabel: 'Operação',
    title: 'Quais fornecedores já estão no time?',
    subtitle: 'Cerimonial, mestre de cerimônias, sonorização, iluminação. Ajuda a alinhar com todo mundo.',
    custom: 'vendors',
  },
  {
    id: 'acknowledgements',
    block: 6,
    blockLabel: 'Operação',
    title: 'Quadro de ciências',
    subtitle: 'Pra deixar tudo combinado, dê uma olhada e confirme o que fizer sentido.',
    custom: 'acknowledgements',
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
    audience_vibe: [],
    audience_description: '',
    energy_reception: 3,
    energy_dinner: 3,
    energy_dancefloor: 4,
    innovation: 5,
    top_genres: [],
    vetoed_genres: [],
    must_play: [],
    do_not_play: [],
    references: [],
    signature_song: '',
    other_attractions: [],
    moments: {},
    custom_moments: [],
    roteiro_order: [],
    optional_services: [],
    vendors: [],
    acknowledgements: [],
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
