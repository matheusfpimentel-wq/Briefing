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
  '18a29': '18 a 29',
  '30a45': '30 a 45',
  '46a60': '46 a 60',
  '60mais': '60+',
}

export const AUDIENCE_VIBE: Record<string, string> = {
  clubber: 'Clubber',
  alternativo: 'Alternativo',
  elegante: 'Elegante / sofisticado',
  festeiro: 'Festeiro / animado',
  descolado: 'Descolado / antenado',
  tradicional: 'Tradicional / família',
  jovem: 'Jovem',
  maduro: 'Público mais maduro',
  ecletico: 'Eclético / misturado',
  romantico: 'Romântico',
  descontraido: 'Descontraído / praiano',
  exigente: 'Exigente com música',
}

export const SOUND_STRUCTURE: Record<string, string> = {
  dj_leva: 'O DJ leva som e luz',
  local_fornece: 'O local fornece',
  fornecedor: 'Já contratamos um fornecedor',
  nao_sei: 'Ainda não sei',
}

export const OPTIONAL_SERVICES: Record<string, string> = {
  toca_discos: 'Mixagem em toca-discos (vinil)',
  cerimonia: 'Ambientação e acompanhamento durante a cerimônia',
  recepcao: 'Ambientação durante a recepção dos convidados',
  mestre_cerimonias: 'Mestre de cerimônias',
  performance: 'Performance ao vivo (sax, percussão, vocal)',
}

export const REFERENCE_TYPE: Record<string, string> = {
  playlist: 'Playlist',
  visual: 'Referência visual',
  video: 'Vídeo de referência',
  outro: 'Outro link',
}

export const ACKNOWLEDGEMENTS: Record<string, string> = {
  pedidos: 'O contrato não vincula o pedido de músicas dos convidados durante a festa. Músicas indispensáveis devem ser enviadas em playlist com 48h de antecedência.',
  horario: 'A execução musical vai até o limite de horário estipulado. Horas extras têm valor adicional, pago antes da continuação.',
  acesso: 'O contratante é responsável pela liberdade de acesso do DJ e do staff, e por impedimentos legais (alvarás, ECAD, etc.).',
  energia: 'O contratante providencia ponto de energia estável e área coberta para os equipamentos.',
  atrasos: 'Atrasos no cronograma do contratante ou de outros fornecedores não estendem o horário de término.',
  curadoria: 'O repertório é uma curadoria do DJ baseada no briefing, com adaptações conforme a leitura da pista.',
}

export const MOMENTS: Record<string, { id: string; label: string }[]> = {
  casamento: [
    { id: 'entrada_noivos', label: 'Entrada dos noivos na festa' },
    { id: 'primeira_danca', label: 'Primeira dança' },
    { id: 'brinde', label: 'Brinde' },
    { id: 'bolo', label: 'Hora do bolo' },
    { id: 'buque', label: 'Buquê' },
    { id: 'primeira_pista', label: 'Primeira música da pista' },
    { id: 'encerramento', label: 'Música de encerramento da festa' },
  ],
  '15anos': [
    { id: 'entrada_debutante', label: 'Entrada da debutante' },
    { id: 'valsa', label: 'Valsa(s)' },
    { id: 'cerimonia_vela', label: 'Cerimônia das velas' },
    { id: 'parabens', label: 'Parabéns' },
  ],
  aniversario: [
    { id: 'entrada_homenageado', label: 'Entrada / recepção do(a) homenageado(a)' },
    { id: 'parabens', label: 'Parabéns' },
    { id: 'brinde', label: 'Brinde' },
  ],
  formatura: [
    { id: 'entrada_homenageado', label: 'Entrada / recepção do(a) formando(a)' },
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
  1: 'Climão lounge',
  2: 'Tranquilo e elegante',
  3: 'Animado, todo mundo conversando',
  4: 'Empolgado, pé na pista',
  5: 'Club total, mão pra cima',
}

export const lbl = (map: Record<string, string>, v: string): string => map[v] || v || '—'
