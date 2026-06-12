import { GENRE_SUGGESTIONS } from '@/config/options'
import { MAX_VETOED_GENRES } from '@/config/formConfig'
import { StepProps } from './stepProps'

export default function VetoedGenresStep({ data, update }: StepProps) {
  const vetoed = data.vetoed_genres
  const full = vetoed.length >= MAX_VETOED_GENRES

  const toggle = (value: string) => {
    if (vetoed.includes(value)) {
      update({ vetoed_genres: vetoed.filter((v) => v !== value) })
    } else if (!full) {
      update({ vetoed_genres: [...vetoed, value] })
    }
  }

  // Não pode vetar uma vibe que está nos escolhidos.
  const available = GENRE_SUGGESTIONS.filter((g) => !data.top_genres.some((s) => s.toLowerCase() === g.toLowerCase()))

  return (
    <div>
      <p className="mb-3 text-sm text-slate-400">{full ? `Máximo de ${MAX_VETOED_GENRES} atingido.` : `Pode marcar até ${MAX_VETOED_GENRES}.`}</p>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Vibes vetadas">
        {available.map((g) => {
          const on = vetoed.includes(g)
          const disabled = !on && full
          return (
            <button
              key={g}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              onClick={() => toggle(g)}
              className={`${on ? 'chip border-red-500 bg-red-600/20 text-red-200' : 'chip-off'} disabled:opacity-40`}
            >
              {g}
            </button>
          )
        })}
      </div>
      {data.top_genres.length > 0 && <p className="mt-4 text-xs text-slate-500">As vibes que você escolheu não aparecem aqui, então nunca serão vetadas.</p>}
    </div>
  )
}
