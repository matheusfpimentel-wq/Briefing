import { AGE_RANGE_OPTIONS } from '@/config/options'
import { StepProps } from './stepProps'

export default function AgeRangesStep({ data, update, errors }: StepProps) {
  const toggle = (value: string) => {
    const set = new Set(data.age_ranges)
    set.has(value) ? set.delete(value) : set.add(value)
    update({ age_ranges: AGE_RANGE_OPTIONS.filter((o) => set.has(o.value)).map((o) => o.value) })
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Faixas etárias">
        {AGE_RANGE_OPTIONS.map((o) => {
          const on = data.age_ranges.includes(o.value)
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o.value)}
              className={on ? 'chip-on' : 'chip-off'}
            >
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
  )
}
