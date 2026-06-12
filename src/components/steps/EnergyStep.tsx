import { ENERGY_SCALE_LABELS, energyPhases } from '@/config/options'
import { StepProps } from './stepProps'

export default function EnergyStep({ data, update }: StepProps) {
  const phases = energyPhases(data.event_type)

  return (
    <div className="space-y-9">
      {phases.map((phase) => {
        const value = data[phase.key] as number
        return (
          <div key={phase.key}>
            <div className="flex items-baseline justify-between mb-1">
              <label htmlFor={phase.key} className="text-base font-semibold text-slate-100">
                {phase.label}
              </label>
              <span className="text-sm font-bold text-accent-300">{ENERGY_SCALE_LABELS[value]}</span>
            </div>
            <p className="mb-3 text-xs text-slate-500">{phase.hint}</p>
            <input
              id={phase.key}
              type="range"
              min={1}
              max={5}
              step={1}
              value={value}
              onChange={(e) => update({ [phase.key]: Number(e.target.value) })}
              className="w-full accent-accent-500 cursor-pointer"
              aria-valuetext={ENERGY_SCALE_LABELS[value]}
            />
            <div className="mt-1 flex justify-between text-xs text-slate-600">
              <span>lounge</span>
              <span>club</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
