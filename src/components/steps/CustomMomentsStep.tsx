import type { CustomMoment } from '@/lib/types'
import { StepProps } from './stepProps'

export default function CustomMomentsStep({ data, update }: StepProps) {
  const items = data.custom_moments

  const setItem = (index: number, patch: Partial<CustomMoment>) => {
    update({ custom_moments: items.map((it, i) => (i === index ? { ...it, ...patch } : it)) })
  }
  const add = () => update({ custom_moments: [...items, { description: '', time: '', song: '' }] })
  const remove = (index: number) => update({ custom_moments: items.filter((_, i) => i !== index) })

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-accent-600">Momento {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-sm text-red-600 hover:underline">
              Remover
            </button>
          </div>

          <label className="field-label" htmlFor={`cm-desc-${i}`}>
            O que vai acontecer?
          </label>
          <input
            id={`cm-desc-${i}`}
            className="field-input"
            placeholder='Ex.: surpresa para a mãe'
            value={item.description}
            onChange={(e) => setItem(i, { description: e.target.value })}
          />

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="field-label" htmlFor={`cm-song-${i}`}>
                Música (opcional)
              </label>
              <input
                id={`cm-song-${i}`}
                className="field-input"
                placeholder='Ex.: Trem-Bala, Ana Vilela'
                value={item.song}
                onChange={(e) => setItem(i, { song: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor={`cm-time-${i}`}>
                Horário (opcional)
              </label>
              <input
                id={`cm-time-${i}`}
                type="time"
                className="field-input sm:w-32"
                value={item.time}
                onChange={(e) => setItem(i, { time: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="btn-ghost w-full border border-dashed border-slate-300">
        + Adicionar momento
      </button>

      {items.length === 0 && <p className="text-sm text-slate-500">Sem outros momentos? Pode seguir tranquilo.</p>}
    </div>
  )
}
