import {
  ACKNOWLEDGEMENTS,
  AGE_RANGE_OPTIONS,
  AUDIENCE_VIBE_OPTIONS,
  ENERGY_SCALE_LABELS,
  EVENT_TYPE_OPTIONS,
  innovationLabel,
  OPTIONAL_SERVICES,
  REFERENCE_TYPE_OPTIONS,
  ROLE_OPTIONS,
  VENDOR_TYPE_OPTIONS,
  energyPhases,
  labelOf,
  momentsFor,
} from '@/config/options'
import type { BriefingData } from '@/lib/types'
import { buildRoteiro } from '@/lib/roteiro'
import { formatDateBR } from '@/lib/format'

interface Props {
  data: BriefingData
  onEditBlock: (block: number) => void
  onSubmit: () => void
  submitting: boolean
  error?: string
  editing?: boolean
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex flex-col gap-0.5 py-1.5">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-slate-700">{value}</dd>
    </div>
  )
}

function Section({ title, block, onEdit, children }: { title: string; block: number; onEdit: (b: number) => void; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-accent-700">{title}</h2>
        <button type="button" onClick={() => onEdit(block)} className="text-sm font-medium text-accent-600 hover:underline">
          Editar
        </button>
      </div>
      <dl className="divide-y divide-slate-200">{children}</dl>
    </div>
  )
}

export default function SummaryStep({ data, onEditBlock, onSubmit, submitting, error, editing }: Props) {
  const phases = energyPhases(data.event_type)
  const momentDefs = momentsFor(data.event_type)
  const roteiro = buildRoteiro(data)

  return (
    <div className="space-y-5">
      <Section title="Evento e contato" block={1} onEdit={onEditBlock}>
        <Row label="Nome" value={data.respondent_name} />
        <Row label="Papel" value={labelOf(ROLE_OPTIONS, data.respondent_role)} />
        <Row label="WhatsApp" value={data.whatsapp} />
        <Row label="E-mail" value={data.email} />
        <Row label="Tipo de evento" value={labelOf(EVENT_TYPE_OPTIONS, data.event_type)} />
        <Row label="Local" value={data.venue} />
        <Row label="Data" value={formatDateBR(data.event_date)} />
        <Row label="Horário" value={[data.start_time, data.end_time].filter(Boolean).join(' às ')} />
      </Section>

      <Section title="Público" block={2} onEdit={onEditBlock}>
        <Row label="Convidados" value={data.guest_count} />
        <Row label="Faixas etárias" value={data.age_ranges.map((v) => labelOf(AGE_RANGE_OPTIONS, v)).join(', ')} />
        <Row label="Vibe" value={data.audience_vibe.map((v) => labelOf(AUDIENCE_VIBE_OPTIONS, v)).join(', ')} />
        <Row label="Descrição" value={data.audience_description} />
      </Section>

      <Section title="Atmosfera" block={3} onEdit={onEditBlock}>
        {phases.map((p) => (
          <Row key={p.key} label={p.label} value={`${data[p.key]}/5 (${ENERGY_SCALE_LABELS[data[p.key] as number]})`} />
        ))}
        <Row label="Curva de inovação" value={`${data.innovation}/10 (${innovationLabel(data.innovation)})`} />
      </Section>

      <Section title="Música" block={4} onEdit={onEditBlock}>
        <Row
          label="Vibes (em ordem)"
          value={
            data.top_genres.length ? (
              <ol className="list-decimal list-inside">
                {data.top_genres.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ol>
            ) : (
              ''
            )
          }
        />
        <Row label="Vetadas" value={data.vetoed_genres.length ? <span className="text-red-300">{data.vetoed_genres.join(', ')}</span> : ''} />
        <Row
          label="Têm que tocar"
          value={
            data.must_play.filter((m) => m.title_artist.trim()).length ? (
              <ul className="list-disc list-inside">
                {data.must_play
                  .filter((m) => m.title_artist.trim())
                  .map((m, i) => (
                    <li key={i}>
                      {m.title_artist}
                      {m.link ? <span className="text-slate-500"> (com link)</span> : ''}
                    </li>
                  ))}
              </ul>
            ) : (
              ''
            )
          }
        />
        <Row label="Não tocar" value={data.do_not_play.filter((d) => d.trim()).join(', ')} />
        <Row
          label="Referências"
          value={
            data.references.filter((r) => r.value.trim()).length ? (
              <ul className="list-disc list-inside">
                {data.references
                  .filter((r) => r.value.trim())
                  .map((r, i) => (
                    <li key={i}>
                      {labelOf(REFERENCE_TYPE_OPTIONS, r.type)}: {r.value}
                    </li>
                  ))}
              </ul>
            ) : (
              ''
            )
          }
        />
        <Row label="Música-assinatura" value={data.signature_song} />
        <Row
          label="Outras atrações"
          value={
            data.other_attractions.filter((a) => a.description.trim()).length ? (
              <ul className="list-disc list-inside">
                {data.other_attractions
                  .filter((a) => a.description.trim())
                  .map((a, i) => (
                    <li key={i}>
                      {a.description}
                      {[a.time, a.duration].filter(Boolean).length ? ` (${[a.time, a.duration].filter(Boolean).join(', ')})` : ''}
                    </li>
                  ))}
              </ul>
            ) : (
              ''
            )
          }
        />
      </Section>

      <Section title="Momentos e roteiro" block={5} onEdit={onEditBlock}>
        {momentDefs
          .filter((def) => data.moments[def.id]?.enabled)
          .map((def) => {
            const m = data.moments[def.id]
            const songs = m.songs.filter((s) => s.title_artist.trim())
            return <Row key={def.id} label={`${m.time ? `${m.time} · ` : ''}${def.label}`} value={songs.map((s) => s.title_artist).join(' · ') || 'Sim'} />
          })}
        <Row
          label="Outros momentos"
          value={data.custom_moments
            .filter((c) => c.description.trim())
            .map((c) => `${c.time ? `${c.time} · ` : ''}${c.description}${c.song ? ` (${c.song})` : ''}`)
            .join(' | ')}
        />
        <Row
          label="Roteiro (ordem)"
          value={
            roteiro.length ? (
              <ol className="list-decimal list-inside">
                {roteiro.map((it) => (
                  <li key={it.key}>
                    {it.time ? `${it.time} · ` : ''}
                    {it.label}
                  </li>
                ))}
              </ol>
            ) : (
              ''
            )
          }
        />
      </Section>

      <Section title="Operação" block={6} onEdit={onEditBlock}>
        <Row label="Serviços opcionais" value={data.optional_services.map((v) => labelOf(OPTIONAL_SERVICES, v)).join(', ')} />
        <Row
          label="Fornecedores"
          value={data.vendors
            .filter((v) => v.name.trim() || v.contact.trim())
            .map((v) => `${labelOf(VENDOR_TYPE_OPTIONS, v.type)}: ${[v.name, v.contact].filter(Boolean).join(', ')}`)
            .join(' | ')}
        />
        <Row label="Quadro de ciências" value={data.acknowledgements.length === ACKNOWLEDGEMENTS.length ? 'Todos os pontos confirmados ✓' : `${data.acknowledgements.length} de ${ACKNOWLEDGEMENTS.length} confirmados`} />
        <Row label="Observações" value={data.notes} />
      </Section>

      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-600/10 p-4 text-red-700" role="alert">
          {error}
        </div>
      )}

      <button type="button" onClick={onSubmit} disabled={submitting} className="btn-primary w-full text-lg py-4">
        {submitting ? 'Salvando...' : editing ? 'Salvar alterações' : 'Enviar briefing'}
      </button>

      <button type="button" onClick={async () => (await import('@/lib/pdf')).downloadBriefingPdf(data)} className="btn-ghost w-full">
        Baixar PDF (prévia)
      </button>
    </div>
  )
}
