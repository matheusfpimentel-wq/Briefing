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
  'Pop-rock',
  'Anos 2000 (Pop e R&B)',
  'Flashback disco / dance',
  'Funk atual (sem palavrão)',
  'Funk proibidão',
  'Funk antigo',
  'Sertanejo universitário',
  'Sertanejo raiz',
  'Pisadinha / piseiro',
  'Forró',
  'Axé / Pop Bahia',
  'Samba e Pagode',
  'EDM',
  'House / Tech House',
  'Afro House',
  'Reggaeton',
  'Reggae',
  'Rock clássico',
  'Indie / Alternativo',
  'Rap / Hip-Hop',
  'Trap',
  'MPB',
  'Soul / R&B',
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
  { value: 'performance', label: 'Performance ao vivo (sax, percussão, vocal)' },
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

// Curva de inovação (0 a 10): o quanto pode fugir do repertório óbvio.
export function innovationLabel(value: number): string {
  if (value <= 1) return 'Clichê total'
  if (value <= 3) return 'Só o que todo mundo conhece'
  if (value <= 5) return 'Equilíbrio entre conhecido e novo'
  if (value <= 7) return 'Aberto a novidades'
  if (value <= 9) return 'Bem aberto a apostas'
  return 'Pode inventar moda'
}

// Helpers de label
export function labelOf(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value
}

// ─── Momentos especiais por tipo de evento ───
export interface MomentDef {
  id: string
  label: string
  /** O que é / a tradição por trás do momento. */
  desc?: string
  /** Música popular como exemplo (vira o placeholder do campo). */
  example?: string
  /** Permite mais de uma música (ex.: valsas). */
  multi?: boolean
}

export const MOMENTS_BY_EVENT: Record<string, MomentDef[]> = {
  casamento: [
    {
      id: 'entrada_noivos',
      label: 'Entrada dos noivos na festa',
      desc: 'A grande entrada do casal na recepção, recebidos com aplausos. Marca o início da festa.',
      example: 'Ex.: Marry You, Bruno Mars',
    },
    {
      id: 'primeira_danca',
      label: 'Primeira dança',
      desc: 'A primeira dança do casal já casados, geralmente um momento mais intimista.',
      example: 'Ex.: Thinking Out Loud, Ed Sheeran',
    },
    {
      id: 'brinde',
      label: 'Brinde',
      desc: 'O erguer das taças, normalmente após os discursos dos padrinhos ou familiares.',
      example: 'Ex.: Celebration, Kool & The Gang',
    },
    {
      id: 'bolo',
      label: 'Hora do bolo',
      desc: 'O corte do bolo pelo casal, um clássico para as fotos.',
      example: 'Ex.: Sugar, Maroon 5',
    },
    {
      id: 'buque',
      label: 'Buquê',
      desc: 'O arremesso do buquê para as convidadas solteiras. Costuma ser descontraído.',
      example: 'Ex.: Single Ladies, Beyoncé',
    },
    {
      id: 'primeira_pista',
      label: 'Primeira música da pista',
      desc: 'A faixa que abre oficialmente a pista de dança e puxa todo mundo.',
      example: 'Ex.: I Wanna Dance with Somebody, Whitney Houston',
    },
    {
      id: 'encerramento',
      label: 'Música de encerramento da festa',
      desc: 'A última música, para fechar a noite com chave de ouro.',
      example: 'Ex.: Time of My Life, Bill Medley e Jennifer Warnes',
    },
  ],
  '15anos': [
    {
      id: 'entrada_debutante',
      label: 'Entrada da debutante',
      desc: 'A grande entrada da aniversariante, momento de abertura e emoção.',
      example: 'Ex.: A Thousand Years, Christina Perri',
    },
    {
      id: 'valsa',
      label: 'Valsa(s)',
      desc: 'A valsa tradicional, dançada com o pai, familiares e o par. Pode ter mais de uma.',
      example: 'Ex.: Valsa das Flores, Tchaikovsky',
      multi: true,
    },
    {
      id: 'cerimonia_vela',
      label: 'Cerimônia das velas',
      desc: 'A tradição das 15 velas, cada uma dedicada a alguém especial na vida da debutante.',
      example: 'Ex.: Photograph, Ed Sheeran',
    },
    {
      id: 'parabens',
      label: 'Parabéns',
      desc: 'O parabéns e o bolo, com a galera reunida.',
      example: 'Ex.: Festa, Ivete Sangalo',
    },
  ],
  aniversario: [
    {
      id: 'entrada_homenageado',
      label: 'Entrada / recepção do(a) homenageado(a)',
      desc: 'A chegada do aniversariante, recebido pelos convidados.',
      example: 'Ex.: Celebration, Kool & The Gang',
    },
    {
      id: 'parabens',
      label: 'Parabéns',
      desc: 'O momento do parabéns e do bolo.',
      example: 'Ex.: Parabéns tradicional emendado em uma festa animada',
    },
    {
      id: 'brinde',
      label: 'Brinde',
      desc: 'O brinde de celebração entre os convidados.',
      example: 'Ex.: Good Life, OneRepublic',
    },
  ],
  formatura: [
    {
      id: 'entrada_homenageado',
      label: 'Entrada / recepção do(a) formando(a)',
      desc: 'A entrada do formando ou da turma, momento de orgulho.',
      example: 'Ex.: Time of Our Lives, Pitbull e Ne-Yo',
    },
    {
      id: 'parabens',
      label: 'Parabéns',
      desc: 'A celebração da conquista, com bolo ou brinde.',
      example: 'Ex.: We Are the Champions, Queen',
    },
    {
      id: 'brinde',
      label: 'Brinde',
      desc: 'O brinde à nova fase.',
      example: 'Ex.: Good Life, OneRepublic',
    },
  ],
  corporativo: [
    {
      id: 'fundo_falas',
      label: 'Música de fundo para falas',
      desc: 'Trilha suave e discreta durante discursos e falas de autoridades.',
      example: 'Ex.: algo instrumental e elegante, sem vocal',
    },
    {
      id: 'premiacoes',
      label: 'Premiações',
      desc: 'A entrada e entrega de prêmios, com clima de reconhecimento.',
      example: 'Ex.: Eye of the Tiger, Survivor',
    },
    {
      id: 'sorteios',
      label: 'Sorteios',
      desc: 'O momento de expectativa e diversão dos sorteios.',
      example: 'Ex.: The Final Countdown, Europe',
    },
    {
      id: 'brinde',
      label: 'Brinde',
      desc: 'O brinde de confraternização da equipe.',
      example: 'Ex.: Good Life, OneRepublic',
    },
  ],
  outro: [],
}

export function momentsFor(eventType: string): MomentDef[] {
  return MOMENTS_BY_EVENT[eventType] ?? []
}
