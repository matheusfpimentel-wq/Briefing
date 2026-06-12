import { AGE_RANGE_OPTIONS, AUDIENCE_VIBE_OPTIONS } from '@/config/options'
import { StepProps } from './stepProps'

export default function AudienceStep({ data, update, errors }: StepProps) {
  const toggleAge = (value: string) => {
    const set = new Set(data.age_ranges)
    set.has(value) ? set.delete(value) : set.add(value)
    update({ age_ranges: AGE_RANGE_OPTIONS.filter((o) => set.has(o.value)).map((o) => o.value) })
  }

  const toggleVibe = (value: string) => {
    const set = new Set(data.audience_vibe)
    set.has(value) ? set.delete(value) : set.add(value)
    update({ audience_vibe: AUDIENCE_VIBE_OPTIONS.filter((o) => set.has(o.value)).map((o) => o.value) })
  }

  return (
    <div className="space-y-7">
      {/* Convidados */}
      <div>
        <label htmlFor="guest_count" className="field-label">
          Número estimado de convidados
        </label>
        <input
          id="guest_count"
          type="number"
          inputMode="numeric"
          className="field-input"
          placeholder="Ex.: 150"
          value={data.guest_count}
          onChange={(e) => update({ guest_count: e.target.value })}
        />
      </div>

      {/* Faixas etárias */}
      <div>
        <p className="field-label">Faixas etárias que predominam</p>
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Faixas etárias">
          {AGE_RANGE_OPTIONS.map((o) => {
            const on = data.age_ranges.includes(o.value)
            return (
              <button key={o.value} type="button" aria-pressed={on} onClick={() => toggleAge(o.value)} className={on ? 'chip-on' : 'chip-off'}>
                {o.label}
              </button>
            )
          })}
        </div>
        {errors.age_ranges && (
          <p className="field-error" role="alert">
            {errors.age_ranges}
          </p>
        )}
      </div>

      {/* Vibe / adjetivos */}
      <div>
        <p className="field-label">Como você descreveria os convidados?</p>
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Vibe do público">
          {AUDIENCE_VIBE_OPTIONS.map((o) => {
            const on = data.audience_vibe.includes(o.value)
            return (
              <button key={o.value} type="button" aria-pressed={on} onClick={() => toggleVibe(o.value)} className={on ? 'chip-on' : 'chip-off'}>
                {o.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Texto livre */}
      <div>
        <label htmlFor="audience_description" className="field-label">
          Quer descrever com suas palavras? (opcional)
        </label>
        <textarea
          id="audience_description"
          rows={3}
          className="field-input"
          placeholder="Ex.: galera clubber, acostumada a balada, mistura com a família mais tranquila."
          value={data.audience_description}
          onChange={(e) => update({ audience_description: e.target.value })}
        />
      </div>
    </div>
  )
}
