import {
  AGE_RANGE_OPTIONS,
  ENERGY_SCALE_LABELS,
  EVENT_TYPE_OPTIONS,
  GENRE_OPTIONS,
  GUEST_REQUESTS_OPTIONS,
  ROLE_OPTIONS,
  SOUND_STRUCTURE_OPTIONS,
  energyPhases,
  labelOf,
  momentsFor,
} from '@/config/options'
import type { BriefingData } from '@/lib/types'

interface Props {
  data: BriefingData
  onEditBlock: (block: number) => void
  onSubmit: () => void
  submitting: boolean
  error?: string
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex flex-col gap-0.5 py-1.5">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-slate-200">{value}</dd>
    </div>
  )
}

function Section({ title, block, onEdit, children }: { title: string; block: number; onEdit: (b: number) => void; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-accent-200">{title}</h2>
        <button type="button" onClick={() => onEdit(block)} className="text-sm font-medium text-accent-300 hover:underline">
          Editar
        </button>
      </div>
      <dl className="divide-y divide-ink-600">{children}</dl>
    </div>
  )
}

export default function SummaryStep({ data, onEditBlock, onSubmit, submitting, error }: Props) {
  const phases = energyPhases(data.event_type)
  const momentDefs = momentsFor(data.event_type)

  return (
    <div className="space-y-5">
      <Section title="Evento e contato" block={1} onEdit={onEditBlock}>
        <Row label="Nome" value={data.respondent_name} />
        <Row label="Papel" value={labelOf(ROLE_OPTIONS, data.respondent_role)} />
        <Row label="WhatsApp" value={data.whatsapp} />
        <Row label="E-mail" value={data.email} />
        <Row label="Tipo de evento" value={labelOf(EVENT_TYPE_OPTIONS, data.event_type)} />
        <Row label="Data" value={data.event_date} />
        <Row label="Horário" value={[data.start_time, data.end_time].filter(Boolean).join(' às ')} />
        <Row label="Local" value={data.venue} />
        <Row label="Convidados" value={data.guest_count} />
      </Section>

      <Section title="Público" block={2} onEdit={onEditBlock}>
        <Row label="Faixas etárias" value={data.age_ranges.map((v) => labelOf(AGE_RANGE_OPTIONS, v)).join(', ')} />
        <Row label="Descrição" value={data.audience_description} />
      </Section>

      <Section title="Atmosfera" block={3} onEdit={onEditBlock}>
        {phases.map((p) => (
          <Row key={p.key} label={p.label} value={`${data[p.key]}/5 — ${ENERGY_SCALE_LABELS[data[p.key] as number]}`} />
        ))}
      </Section>

      <Section title="Música" block={4} onEdit={onEditBlock}>
        <Row
          label="Top 5 gêneros"
          value={
            <ol className="list-decimal list-inside">
              {data.top_genres.map((v) => (
                <li key={v}>{v === 'outro' && data.top_genre_other ? data.top_genre_other : labelOf(GENRE_OPTIONS, v)}</li>
              ))}
            </ol>
          }
        />
        <Row
          label="Vetados"
          value={data.vetoed_genres.length ? <span className="text-red-300">{data.vetoed_genres.map((v) => labelOf(GENRE_OPTIONS, v)).join(', ')}</span> : ''}
        />
        <Row
          label="Têm que tocar"
          value={
            data.must_play.filter((m) => m.title_artist.trim()).length ? (
              <ul className="list-disc list-inside">
                {data.must_play.filter((m) => m.title_artist.trim()).map((m, i) => (
                  <li key={i}>
                    {m.title_artist}
                    {m.link ? ' 🔗' : ''}
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )
          }
        />
        <Row label="Não tocar" value={data.do_not_play.filter((d) => d.trim()).join(', ')} />
        <Row label="Playlist de referência" value={data.reference_playlist} />
        <Row label="Música-assinatura" value={data.signature_song} />
      </Section>

      <Section title="Momentos especiais" block={5} onEdit={onEditBlock}>
        {momentDefs
          .filter((def) => data.moments[def.id]?.enabled)
          .map((def) => {
            const songs = data.moments[def.id].songs.filter((s) => s.title_artist.trim())
            return <Row key={def.id} label={def.label} value={songs.map((s) => s.title_artist).join(' · ') || 'Sim'} />
          })}
        <Row label="Outros momentos" value={data.other_moments} />
        <Row label="MC / cerimonial" value={data.has_mc ? [data.mc_name, data.mc_contact].filter(Boolean).join(' — ') || 'Sim' : 'Não'} />
      </Section>

      <Section title="Operação" block={6} onEdit={onEditBlock}>
        <Row label="Estrutura de som" value={labelOf(SOUND_STRUCTURE_OPTIONS, data.sound_structure)} />
        <Row label="Política de pedidos" value={labelOf(GUEST_REQUESTS_OPTIONS, data.guest_requests_policy)} />
        <Row label="Observações" value={data.notes} />
      </Section>

      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-600/10 p-4 text-red-200" role="alert">
          {error}
        </div>
      )}

      <button type="button" onClick={onSubmit} disabled={submitting} className="btn-primary w-full text-lg py-4">
        {submitting ? 'Enviando…' : 'Enviar briefing 🎧'}
      </button>
    </div>
  )
}
