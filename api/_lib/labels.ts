// Espelho das listas de src/config/options.ts para uso no e-mail
// (o servidor não importa do bundle do cliente).

export const ROLE: Record<string, string> = {
  noiva_noivo: 'Noiva / Noivo',
  aniversariante: 'Aniversariante',
  mae_pai: 'Mãe / Pai do(a) homenageado(a)',
  organizador: 'Organizador(a)',
  outro: 'Outro',
}

export const EVENT_TYPE: Record<string, string> = {
  casamento: 'Casamento',
  '15anos': '15 anos',
  aniversario: 'Aniversário',
  corporativo: 'Corporativo',
  formatura: 'Formatura',
  outro: 'Outro',
}

export const AGE_RANGE: Record<string, string> = {
  ate17: 'Até 17',
  '18a29': '18–29',
  '30a45': '30–45',
  '46a60': '46–60',
  '60mais': '60+',
}

export const GENRE: Record<string, string> = {
  funk: 'Funk Brasileiro',
  pop: 'Pop',
  anos2000: 'Anos 2000 (Pop, R&B)',
  reggaeton: 'Reggaeton',
  eletronica: 'Música Eletrônica (EDM, House)',
  sertanejo: 'Sertanejo',
  forro: 'Forró',
  axe: 'Axé',
  samba_pagode: 'Samba e Pagode',
  flashback: 'Flashback (Disco, Dance, New Wave)',
  rock: 'Rock',
  rap: 'Rap / Hip-Hop',
  mpb: 'MPB',
  soul_funk: 'Soul / Funk',
  reggae: 'Reggae',
  outro: 'Outro',
}

export const SOUND_STRUCTURE: Record<string, string> = {
  dj_leva: 'O DJ leva som e luz',
  local_fornece: 'O local fornece',
  fornecedor: 'Já contratamos um fornecedor',
  nao_sei: 'Ainda não sei',
}

export const GUEST_REQUESTS: Record<string, string> = {
  livre: 'Aceitar pedidos livremente',
  combinar: 'Aceitar só o que combinar com o briefing',
  nao_aceitar: 'Não aceitar pedidos',
}

export const MOMENTS: Record<string, { id: string; label: string }[]> = {
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
    { id: 'valsa', label: 'Valsa(s)' },
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

export const ENERGY_PHASES_DEFAULT = [
  { key: 'energy_reception', label: 'Recepção / chegada' },
  { key: 'energy_dinner', label: 'Jantar / coquetel' },
  { key: 'energy_dancefloor', label: 'Pista' },
]

export const ENERGY_PHASES_CORPORATE = [
  { key: 'energy_reception', label: 'Credenciamento / chegada' },
  { key: 'energy_dinner', label: 'Programa / falas' },
  { key: 'energy_dancefloor', label: 'Confraternização' },
]

export const ENERGY_SCALE: Record<number, string> = {
  1: 'Ambiente / relaxado',
  2: 'Tranquilo',
  3: 'Animado',
  4: 'Empolgado',
  5: 'Festa total',
}

export const lbl = (map: Record<string, string>, v: string): string => map[v] || v || '—'
