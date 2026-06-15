import { OPTIONAL_SERVICES } from '@/config/options'
import { StepProps } from './stepProps'

export default function ServicesStep({ data, update }: StepProps) {
  const toggleService = (value: string) => {
    const set = new Set(data.optional_services)
    set.has(value) ? set.delete(value) : set.add(value)
    update({ optional_services: OPTIONAL_SERVICES.filter((o) => set.has(o.value)).map((o) => o.value) })
  }

  return (
    <div>
      <div className="space-y-2">
        {OPTIONAL_SERVICES.map((o) => {
          const on = data.optional_services.includes(o.value)
          return (
            <button
              key={o.value}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => toggleService(o.value)}
              className={`flex w-full items-center gap-3 border px-4 py-3 text-left transition-colors ${
                on ? 'border-accent-500 bg-accent-600/15' : 'border-slate-300 bg-white/60 hover:border-accent-500/50'
              }`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 ${on ? 'border-accent-400 bg-accent-500 text-white' : 'border-slate-400'}`}>
                {on && '✓'}
              </span>
              <span className="text-slate-900">{o.label}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Serviços ainda não contratados poderão ser cobrados à parte, mediante novo orçamento, que poderá ser aceito ou recusado posteriormente.
      </p>
    </div>
  )
}
