import { GENRE_OPTIONS, labelOf } from '@/config/options'
import { TOTAL_TOP_GENRES } from '@/config/formConfig'
import { StepProps } from './stepProps'

export default function TopGenresStep({ data, update, errors }: StepProps) {
  const selected = data.top_genres
  const full = selected.length >= TOTAL_TOP_GENRES

  const add = (value: string) => {
    if (selected.includes(value) || full) return
    update({ top_genres: [...selected, value] })
  }
  const remove = (value: string) => {
    update({ top_genres: selected.filter((v) => v !== value) })
  }
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= selected.length) return
    const next = [...selected]
    ;[next[index], next[target]] = [next[target], next[index]]
    update({ top_genres: next })
  }

  return (
    <div>
      {/* Selecionados em ordem */}
      {selected.length > 0 && (
        <ol className="mb-6 space-y-2" aria-label="Gêneros escolhidos em ordem">
          {selected.map((value, i) => (
            <li key={value} className="flex items-center gap-3 rounded-xl bg-accent-600/15 border border-accent-500/50 px-3 py-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="flex-1 text-slate-100">{labelOf(GENRE_OPTIONS, value)}</span>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Subir" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-lg px-2 py-1 text-slate-300 hover:bg-ink-600 disabled:opacity-30">
                  ↑
                </button>
                <button type="button" aria-label="Descer" disabled={i === selected.length - 1} onClick={() => move(i, 1)} className="rounded-lg px-2 py-1 text-slate-300 hover:bg-ink-600 disabled:opacity-30">
                  ↓
                </button>
                <button type="button" aria-label="Remover" onClick={() => remove(value)} className="rounded-lg px-2 py-1 text-red-400 hover:bg-ink-600">
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Campo livre para "Outro" */}
      {selected.includes('outro') && (
        <div className="mb-6">
          <label htmlFor="top_genre_other" className="field-label">
            Qual é o "Outro" gênero?
          </label>
          <input
            id="top_genre_other"
            className="field-input"
            placeholder="Ex.: K-pop"
            value={data.top_genre_other}
            onChange={(e) => update({ top_genre_other: e.target.value })}
          />
        </div>
      )}

      {/* Disponíveis */}
      <p className="mb-3 text-sm text-slate-400">
        {full ? 'Você já escolheu 5 — remova um para trocar.' : `Faltam ${TOTAL_TOP_GENRES - selected.length}.`}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {GENRE_OPTIONS.filter((o) => !selected.includes(o.value)).map((o) => (
          <button key={o.value} type="button" disabled={full} onClick={() => add(o.value)} className="chip-off disabled:opacity-40">
            {o.label}
          </button>
        ))}
      </div>

      {errors.top_genres && (
        <p className="field-error" role="alert">
          {errors.top_genres}
        </p>
      )}
    </div>
  )
}
