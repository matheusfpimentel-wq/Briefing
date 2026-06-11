import { GENRE_OPTIONS } from '@/config/options'
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

  // Não pode vetar um gênero que está nos top 5
  const available = GENRE_OPTIONS.filter((o) => o.value !== 'outro' && !data.top_genres.includes(o.value))

  return (
    <div>
      <p className="mb-3 text-sm text-slate-400">
        {full ? `Máximo de ${MAX_VETOED_GENRES} atingido.` : `Pode marcar até ${MAX_VETOED_GENRES}.`}
      </p>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Gêneros vetados">
        {available.map((o) => {
          const on = vetoed.includes(o.value)
          const disabled = !on && full
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              onClick={() => toggle(o.value)}
              className={`${on ? 'chip-on border-red-500 bg-red-600/20 text-red-200' : 'chip-off'} disabled:opacity-40`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
      {data.top_genres.length > 0 && (
        <p className="mt-4 text-xs text-slate-500">
          Seus top 5 não aparecem aqui — eles nunca serão vetados.
        </p>
      )}
    </div>
  )
}
