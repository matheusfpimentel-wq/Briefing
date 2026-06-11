// Listas de opções e definições de dados. Edite aqui para alterar as
// escolhas oferecidas no formulário sem mexer nos componentes.

export interface Option {
  value: string
  label: string
}

export const ROLE_OPTIONS: Option[] = [
  { value: 'noiva_noivo', label: 'Noiva / Noivo' },
  { value: 'aniversariante', label: 'Aniversariante' },
  { value: 'mae_pai', label: 'Mãe / Pai do(a) homenageado(a)' },
  { value: 'organizador', label: 'Organizador(a)' },
  { value: 'outro', label: 'Outro' },
]

export const EVENT_TYPE_OPTIONS: Option[] = [
  { value: 'casamento', label: 'Casamento' },
  { value: '15anos', label: '15 anos' },
  { value: 'aniversario', label: 'Aniversário' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'formatura', label: 'Formatura' },
  { value: 'outro', label: 'Outro' },
]

export const AGE_RANGE_OPTIONS: Option[] = [
  { value: 'ate17', label: 'Até 17' },
  { value: '18a29', label: '18–29' },
  { value: '30a45', label: '30–45' },
  { value: '46a60', label: '46–60' },
  { value: '60mais', label: '60+' },
]

// Lista mestra de gêneros — usada nos top 5 e nos vetos.
export const GENRE_OPTIONS: Option[] = [
  { value: 'funk', label: 'Funk Brasileiro' },
  { value: 'pop', label: 'Pop' },
  { value: 'anos2000', label: 'Anos 2000 (Pop, R&B)' },
  { value: 'reggaeton', label: 'Reggaeton' },
  { value: 'eletronica', label: 'Música Eletrônica (EDM, House)' },
  { value: 'sertanejo', label: 'Sertanejo' },
  { value: 'forro', label: 'Forró' },
  { value: 'axe', label: 'Axé' },
  { value: 'samba_pagode', label: 'Samba e Pagode' },
  { value: 'flashback', label: 'Flashback (Disco, Dance, New Wave)' },
  { value: 'rock', label: 'Rock' },
  { value: 'rap', label: 'Rap / Hip-Hop' },
  { value: 'mpb', label: 'MPB' },
  { value: 'soul_funk', label: 'Soul / Funk' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'outro', label: 'Outro' },
]

export const SOUND_STRUCTURE_OPTIONS: Option[] = [
  { value: 'dj_leva', label: 'O DJ leva som e luz' },
  { value: 'local_fornece', label: 'O local fornece' },
  { value: 'fornecedor', label: 'Já contratamos um fornecedor' },
  { value: 'nao_sei', label: 'Ainda não sei' },
]

export const GUEST_REQUESTS_OPTIONS: Option[] = [
  { value: 'livre', label: 'Aceitar pedidos livremente' },
  { value: 'combinar', label: 'Aceitar só o que combinar com o briefing' },
  { value: 'nao_aceitar', label: 'Não aceitar pedidos' },
]

// ─── Momentos especiais por tipo de evento ───
// A ordem reflete a ordem cronológica do evento (usada no e-mail).
export interface MomentDef {
  id: string
  label: string
  /** Permite mais de uma música (ex.: valsas). */
  multi?: boolean
}

export const MOMENTS_BY_EVENT: Record<string, MomentDef[]> = {
  casamento: [
    { id: 'entrada_noivos', label: 'Entrada dos noivos' },
    { id: 'primeira_danca', label: 'Primeira dança' },
    { id: 'brinde', label: 'Brinde' },
    { id: 'buque', label: 'Buquê' },
    { id: 'bolo', label: 'Hora do bolo' },
    { id: 'saida_noivos', label: 'Saída dos noivos' },
  ],
  '15anos': [
    { id: 'entrada_debutante', label: 'Entrada da debutante' },
    { id: 'valsa', label: 'Valsa(s)', multi: true },
    { id: 'cerimonia_vela', label: 'Cerimônia da vela' },
    { id: 'parabens', label: 'Parabéns' },
  ],
  aniversario: [
    { id: 'entrada_homenageado', label: 'Entrada / recepção do(a) homenageado(a)' },
    { id: 'parabens', label: 'Parabéns' },
    { id: 'brinde', label: 'Brinde' },
  ],
  formatura: [
    { id: 'entrada_homenageado', label: 'Entrada / recepção do(a) homenageado(a)' },
    { id: 'parabens', label: 'Parabéns' },
    { id: 'brinde', label: 'Brinde' },
  ],
  corporativo: [
    { id: 'fundo_falas', label: 'Música de fundo para falas de autoridades' },
    { id: 'premiacoes', label: 'Premiações' },
    { id: 'sorteios', label: 'Sorteios' },
    { id: 'brinde', label: 'Brinde' },
  ],
  outro: [],
}

export function momentsFor(eventType: string): MomentDef[] {
  return MOMENTS_BY_EVENT[eventType] ?? []
}

// ─── Fases de energia (Bloco 3) ───
export interface EnergyPhase {
  key: 'energy_reception' | 'energy_dinner' | 'energy_dancefloor'
  label: string
}

const ENERGY_DEFAULT: EnergyPhase[] = [
  { key: 'energy_reception', label: 'Recepção / chegada' },
  { key: 'energy_dinner', label: 'Jantar / coquetel' },
  { key: 'energy_dancefloor', label: 'Pista' },
]

const ENERGY_CORPORATE: EnergyPhase[] = [
  { key: 'energy_reception', label: 'Credenciamento / chegada' },
  { key: 'energy_dinner', label: 'Programa / falas' },
  { key: 'energy_dancefloor', label: 'Confraternização' },
]

export function energyPhases(eventType: string): EnergyPhase[] {
  return eventType === 'corporativo' ? ENERGY_CORPORATE : ENERGY_DEFAULT
}

export const ENERGY_SCALE_LABELS: Record<number, string> = {
  1: 'Ambiente / relaxado',
  2: 'Tranquilo',
  3: 'Animado',
  4: 'Empolgado',
  5: 'Festa total',
}

// Helpers de label
export function labelOf(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value
}
