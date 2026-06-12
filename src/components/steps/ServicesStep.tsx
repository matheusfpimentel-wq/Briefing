import { OPTIONAL_SERVICES, SOUND_STRUCTURE_OPTIONS } from '@/config/options'
import { StepProps } from './stepProps'

export default function ServicesStep({ data, update, errors }: StepProps) {
  const toggleService = (value: string) => {
    const set = new Set(data.optional_services)
    set.has(value) ? set.delete(value) : set.add(value)
    update({ optional_services: OPTIONAL_SERVICES.filter((o) => set.has(o.value)).map((o) => o.value) })
  }

  return (
    <div className="space-y-7">
      {/* Estrutura de som */}
      <div>
        <label htmlFor="sound_structure" className="field-label">
          Estrutura de som e luz <span className="text-accent-300">*</span>
        </label>
        <select
          id="sound_structure"
          className="field-input"
          value={data.sound_structure}
          aria-invalid={!!errors.sound_structure}
          onChange={(e) => update({ sound_structure: e.target.value })}
        >
          <option value="">Selecione...</option>
          {SOUND_STRUCTURE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.sound_structure && (
          <p className="field-error" role="alert">
            {errors.sound_structure}
          </p>
        )}
      </div>

      {/* Serviços opcionais */}
      <div>
        <p className="field-label">Serviços opcionais que você gostaria de ter</p>
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
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  on ? 'border-accent-500 bg-accent-600/15' : 'border-ink-500 bg-ink-700 hover:border-accent-500/50'
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-accent-400 bg-accent-500 text-white' : 'border-ink-400'}`}>
                  {on && '✓'}
                </span>
                <span className="text-slate-100">{o.label}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Serviços ainda não contratados poderão ser cobrados à parte, mediante novo orçamento, que poderá ser aceito ou recusado posteriormente.
        </p>
      </div>
    </div>
  )
}
