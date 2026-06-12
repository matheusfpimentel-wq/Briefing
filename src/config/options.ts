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
  { value: '18a29', label: '18 a 29' },
  { value: '30a45', label: '30 a 45' },
  { value: '46a60', label: '46 a 60' },
  { value: '60mais', label: '60+' },
]

// Adjetivos para capturar a "vibe" do público.
export const AUDIENCE_VIBE_OPTIONS: Option[] = [
  { value: 'clubber', label: 'Clubber' },
  { value: 'alternativo', label: 'Alternativo' },
  { value: 'elegante', label: 'Elegante / sofisticado' },
  { value: 'festeiro', label: 'Festeiro / animado' },
  { value: 'descolado', label: 'Descolado / antenado' },
  { value: 'tradicional', label: 'Tradicional / família' },
  { value: 'jovem', label: 'Jovem' },
  { value: 'maduro', label: 'Público mais maduro' },
  { value: 'ecletico', label: 'Eclético / misturado' },
  { value: 'romantico', label: 'Romântico' },
  { value: 'descontraido', label: 'Descontraído / praiano' },
  { value: 'exigente', label: 'Exigente com música' },
]

// Gêneros pensados como VIBES, não rótulos rígidos. A pessoa pode
// escolher quantos quiser e adicionar os próprios.
export const GENRE_SUGGESTIONS: string[] = [
  'Divas do Pop',
  'Pop atual',
  'Funk Brasileiro',
  'Funk consciente / 150bpm',
  'Sertanejo universitário',
  'Sertanejo raiz',
  'Pisadinha / piseiro',
  'House / Tech House',
  'Afro House',
  'Eletrônica mainstage',
  'Reggaeton / Latin',
  'Anos 2000 (Pop e R&B)',
  'Flashback disco / dance',
  'Rock clássico',
  'Indie / Alternativo',
  'Rap / Hip-Hop',
  'Trap',
  'Samba e Pagode',
  'Forró pé de serra',
  'Axé / Pop Bahia',
  'MPB',
  'Soul / R&B',
  'Reggae',
  'Brega / Brega-funk',
]

export const SOUND_STRUCTURE_OPTIONS: Option[] = [
  { value: 'dj_leva', label: 'O DJ leva som e luz' },
  { value: 'local_fornece', label: 'O local fornece' },
  { value: 'fornecedor', label: 'Já contratamos um fornecedor' },
  { value: 'nao_sei', label: 'Ainda não sei' },
]

// Serviços opcionais que o cliente pode querer (checkbox).
export const OPTIONAL_SERVICES: Option[] = [
  { value: 'toca_discos', label: 'Mixagem em toca-discos (vinil)' },
  { value: 'cerimonia', label: 'Ambientação e acompanhamento durante a cerimônia' },
  { value: 'recepcao', label: 'Ambientação durante a recepção dos convidados' },
  { value: 'mestre_cerimonias', label: 'Mestre de cerimônias' },
  { value: 'iluminacao', label: 'Iluminação cênica' },
  { value: 'efeitos', label: 'Efeitos (máquina de fumaça, laser, gelo seco)' },
  { value: 'performance', label: 'Performance ao vivo (sax, percussão, vocal)' },
  { value: 'som_extra', label: 'Estrutura de som extra para público grande' },
  { value: 'telao', label: 'Telão / painel de LED' },
]

// Quadro de ciências (declarações que o cliente confirma).
export interface Acknowledgement {
  id: string
  text: string
}

export const ACKNOWLEDGEMENTS: Acknowledgement[] = [
  {
    id: 'pedidos',
    text: 'Estou ciente de que o contrato não vincula o pedido de músicas por parte dos convidados durante a festa. Caso haja músicas indispensáveis, deve ser encaminhada playlist com 48 horas de antecedência.',
  },
  {
    id: 'horario',
    text: 'Estou ciente de que a execução musical se dará até o limite de horário já estipulado. Em caso de contratação de horas extras, haverá valor adicional, que deve ser pago antes da continuação da festa.',
  },
  {
    id: 'acesso',
    text: 'Estou ciente de que sou responsável pela liberdade de acesso do DJ e de todo o staff mencionado no contrato, caso haja, bem como por outros impedimentos legais que possam impossibilitar a execução (alvarás, ECAD, etc.).',
  },
  {
    id: 'energia',
    text: 'Estou ciente de que devo providenciar ponto de energia estável e adequado, além de área coberta e protegida para os equipamentos.',
  },
  {
    id: 'atrasos',
    text: 'Estou ciente de que atrasos no cronograma por parte do contratante ou de outros fornecedores não estendem o horário de término contratado.',
  },
  {
    id: 'curadoria',
    text: 'Estou ciente de que o repertório é uma curadoria do DJ baseada neste briefing, podendo haver adaptações conforme a leitura da pista no momento da festa.',
  },
]

// Tipos de referência que o cliente pode anexar.
export const REFERENCE_TYPE_OPTIONS: Option[] = [
  { value: 'playlist', label: 'Playlist (Spotify, YouTube, Apple Music)' },
  { value: 'visual', label: 'Referência visual (Pinterest, Instagram, fotos)' },
  { value: 'video', label: 'Vídeo de referência' },
  { value: 'outro', label: 'Outro link' },
]

// ─── Fases de energia (Bloco 3) ───
export interface EnergyPhase {
  key: 'energy_reception' | 'energy_dinner' | 'energy_dancefloor'
  label: string
  hint: string
}

const ENERGY_DEFAULT: EnergyPhase[] = [
  { key: 'energy_reception', label: 'Recepção / chegada', hint: 'Quando os convidados estão chegando.' },
  { key: 'energy_dinner', label: 'Jantar / coquetel', hint: 'Durante a comida e as conversas.' },
  { key: 'energy_dancefloor', label: 'Pista', hint: 'O auge da festa.' },
]

const ENERGY_CORPORATE: EnergyPhase[] = [
  { key: 'energy_reception', label: 'Credenciamento / chegada', hint: 'Recepção dos participantes.' },
  { key: 'energy_dinner', label: 'Programa / falas', hint: 'Durante apresentações e discursos.' },
  { key: 'energy_dancefloor', label: 'Confraternização', hint: 'A hora de relaxar e celebrar.' },
]

export function energyPhases(eventType: string): EnergyPhase[] {
  return eventType === 'corporativo' ? ENERGY_CORPORATE : ENERGY_DEFAULT
}

// Adjetivos para cada nível de energia (ajuda a sacar a vibe).
export const ENERGY_SCALE_LABELS: Record<number, string> = {
  1: 'Climão lounge',
  2: 'Tranquilo e elegante',
  3: 'Animado, todo mundo conversando',
  4: 'Empolgado, pé na pista',
  5: 'Club total, mão pra cima',
}

// Helpers de label
export function labelOf(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value
}

// ─── Momentos especiais por tipo de evento ───
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
