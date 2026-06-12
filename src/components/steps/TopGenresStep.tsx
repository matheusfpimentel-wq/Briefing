import { useState } from 'react'
import { GENRE_SUGGESTIONS } from '@/config/options'
import { StepProps } from './stepProps'

export default function TopGenresStep({ data, update }: StepProps) {
  const selected = data.top_genres
  const [custom, setCustom] = useState('')

  const add = (value: string) => {
    const v = value.trim()
    if (!v || selected.some((s) => s.toLowerCase() === v.toLowerCase())) return
    update({ top_genres: [...selected, v] })
  }
  const remove = (value: string) => update({ top_genres: selected.filter((v) => v !== value) })
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= selected.length) return
    const next = [...selected]
    ;[next[index], next[target]] = [next[target], next[index]]
    update({ top_genres: next })
  }

  const addCustom = () => {
    add(custom)
    setCustom('')
  }

  return (
    <div>
      {/* Selecionados em ordem */}
      {selected.length > 0 && (
        <ol className="mb-6 space-y-2" aria-label="Vibes escolhidas em ordem">
          {selected.map((value, i) => (
            <li key={value} className="flex items-center gap-3 rounded-xl bg-accent-600/15 border border-accent-500/50 px-3 py-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">{i + 1}</span>
              <span className="flex-1 text-slate-100">{value}</span>
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

      {/* Sugestões */}
      <div className="flex flex-wrap gap-2.5">
        {GENRE_SUGGESTIONS.filter((g) => !selected.some((s) => s.toLowerCase() === g.toLowerCase())).map((g) => (
          <button key={g} type="button" onClick={() => add(g)} className="chip-off">
            + {g}
          </button>
        ))}
      </div>

      {/* Adicionar a própria vibe */}
      <div className="mt-6">
        <label htmlFor="custom_genre" className="field-label">
          Não achou? Adicione a sua
        </label>
        <div className="flex gap-2">
          <input
            id="custom_genre"
            className="field-input"
            placeholder="Ex.: K-pop, Tecnobrega, Lo-fi"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                addCustom()
              }
            }}
          />
          <button type="button" onClick={addCustom} className="btn-primary shrink-0">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
