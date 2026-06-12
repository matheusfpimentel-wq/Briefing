import { ACKNOWLEDGEMENTS } from '@/config/options'
import { StepProps } from './stepProps'

export default function AcknowledgementsStep({ data, update, errors }: StepProps) {
  const toggle = (id: string) => {
    const set = new Set(data.acknowledgements)
    set.has(id) ? set.delete(id) : set.add(id)
    update({ acknowledgements: ACKNOWLEDGEMENTS.filter((a) => set.has(a.id)).map((a) => a.id) })
  }

  return (
    <div className="space-y-3">
      {ACKNOWLEDGEMENTS.map((a) => {
        const on = data.acknowledgements.includes(a.id)
        return (
          <button
            key={a.id}
            type="button"
            role="checkbox"
            aria-checked={on}
            onClick={() => toggle(a.id)}
            className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              on ? 'border-accent-500 bg-accent-600/15' : 'border-ink-500 bg-ink-700 hover:border-accent-500/50'
            }`}
          >
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-accent-400 bg-accent-500 text-white' : 'border-ink-400'}`}>
              {on && '✓'}
            </span>
            <span className="text-sm leading-relaxed text-slate-200">{a.text}</span>
          </button>
        )
      })}
      {errors.acknowledgements && (
        <p className="field-error" role="alert">
          {errors.acknowledgements}
        </p>
      )}
    </div>
  )
}
