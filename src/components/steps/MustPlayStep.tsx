import { MAX_MUST_PLAY } from '@/config/formConfig'
import type { SongRef } from '@/lib/types'
import { StepProps } from './stepProps'

export default function MustPlayStep({ data, update }: StepProps) {
  const items = data.must_play
  const full = items.length >= MAX_MUST_PLAY

  const setItem = (index: number, patch: Partial<SongRef>) => {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it))
    update({ must_play: next })
  }
  const add = () => {
    if (!full) update({ must_play: [...items, { title_artist: '', link: '' }] })
  }
  const remove = (index: number) => {
    update({ must_play: items.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-accent-300">#{i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-sm text-red-400 hover:underline" aria-label={`Remover item ${i + 1}`}>
              Remover
            </button>
          </div>
          <label className="field-label" htmlFor={`mp-title-${i}`}>
            Música ou artista
          </label>
          <input
            id={`mp-title-${i}`}
            className="field-input"
            placeholder="Ex.: Evidências, Chitãozinho e Xororó"
            value={item.title_artist}
            onChange={(e) => setItem(i, { title_artist: e.target.value })}
          />
          <label className="field-label mt-3" htmlFor={`mp-link-${i}`}>
            Link (opcional)
          </label>
          <input
            id={`mp-link-${i}`}
            className="field-input"
            inputMode="url"
            placeholder="https://open.spotify.com/..."
            value={item.link ?? ''}
            onChange={(e) => setItem(i, { link: e.target.value })}
          />
        </div>
      ))}

      <button type="button" onClick={add} disabled={full} className="btn-ghost w-full border border-dashed border-ink-500">
        + Adicionar música {full && `(máx. ${MAX_MUST_PLAY})`}
      </button>
    </div>
  )
}
