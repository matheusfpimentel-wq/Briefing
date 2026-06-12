import { useState } from 'react'
import { GENRE_SUGGESTIONS } from '@/config/options'
import { StepProps } from './stepProps'

export default function VetoedGenresStep({ data, update }: StepProps) {
  const vetoed = data.vetoed_genres
  const [custom, setCustom] = useState('')

  const add = (value: string) => {
    const v = value.trim()
    if (!v || vetoed.some((s) => s.toLowerCase() === v.toLowerCase())) return
    update({ vetoed_genres: [...vetoed, v] })
  }
  const remove = (value: string) => update({ vetoed_genres: vetoed.filter((v) => v !== value) })
  const addCustom = () => {
    add(custom)
    setCustom('')
  }

  // Não pode vetar uma vibe que está nos escolhidos.
  const available = GENRE_SUGGESTIONS.filter(
    (g) => !data.top_genres.some((s) => s.toLowerCase() === g.toLowerCase()) && !vetoed.some((s) => s.toLowerCase() === g.toLowerCase()),
  )

  return (
    <div>
      {/* Selecionadas */}
      {vetoed.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2.5" aria-label="Vibes vetadas">
          {vetoed.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => remove(v)}
              className="chip border-red-500 bg-red-600/20 text-red-200"
              aria-label={`Remover veto ${v}`}
            >
              {v} <span aria-hidden>✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Sugestões */}
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Sugestões de vibes para vetar">
        {available.map((g) => (
          <button key={g} type="button" onClick={() => add(g)} className="chip-off">
            + {g}
          </button>
        ))}
      </div>

      {/* Adicionar livre */}
      <div className="mt-6">
        <label htmlFor="custom_veto" className="field-label">
          Quer vetar outra coisa? Adicione aqui
        </label>
        <div className="flex gap-2">
          <input
            id="custom_veto"
            className="field-input"
            placeholder="Ex.: nada de brega, sem músicas religiosas"
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

      {data.top_genres.length > 0 && <p className="mt-4 text-xs text-slate-500">As vibes que você escolheu não aparecem aqui, então nunca serão vetadas.</p>}
    </div>
  )
}
