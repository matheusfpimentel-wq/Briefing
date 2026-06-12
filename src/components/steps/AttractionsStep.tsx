import type { Attraction } from '@/lib/types'
import { StepProps } from './stepProps'

export default function AttractionsStep({ data, update }: StepProps) {
  const items = data.other_attractions

  const setItem = (index: number, patch: Partial<Attraction>) => {
    update({ other_attractions: items.map((it, i) => (i === index ? { ...it, ...patch } : it)) })
  }
  const add = () => update({ other_attractions: [...items, { description: '', time: '', duration: '' }] })
  const remove = (index: number) => update({ other_attractions: items.filter((_, i) => i !== index) })

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-accent-300">Atração {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-sm text-red-400 hover:underline">
              Remover
            </button>
          </div>

          <label className="field-label" htmlFor={`atr-desc-${i}`}>
            Qual atração?
          </label>
          <input
            id={`atr-desc-${i}`}
            className="field-input"
            placeholder="Ex.: banda de samba, cantor, sax ao vivo"
            value={item.description}
            onChange={(e) => setItem(i, { description: e.target.value })}
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="field-label" htmlFor={`atr-time-${i}`}>
                Horário (se já definido)
              </label>
              <input
                id={`atr-time-${i}`}
                type="time"
                className="field-input"
                value={item.time}
                onChange={(e) => setItem(i, { time: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor={`atr-dur-${i}`}>
                Tempo de apresentação
              </label>
              <input
                id={`atr-dur-${i}`}
                className="field-input"
                placeholder="Ex.: 45 min"
                value={item.duration}
                onChange={(e) => setItem(i, { duration: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="btn-ghost w-full border border-dashed border-ink-500">
        + Adicionar atração
      </button>

      {items.length === 0 && <p className="text-sm text-slate-500">Sem outras atrações? Pode seguir em frente, só eu no comando.</p>}
    </div>
  )
}
