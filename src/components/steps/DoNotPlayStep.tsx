import { StepProps } from './stepProps'

export default function DoNotPlayStep({ data, update }: StepProps) {
  const items = data.do_not_play

  const setItem = (index: number, value: string) => {
    update({ do_not_play: items.map((it, i) => (i === index ? value : it)) })
  }
  const add = () => update({ do_not_play: [...items, ''] })
  const remove = (index: number) => update({ do_not_play: items.filter((_, i) => i !== index) })

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="field-input"
            placeholder="Ex.: nada de brega"
            aria-label={`Proibido ${i + 1}`}
            value={item}
            onChange={(e) => setItem(i, e.target.value)}
          />
          <button type="button" onClick={() => remove(i)} className="shrink-0 rounded-lg px-3 py-2 text-red-400 hover:bg-ink-700" aria-label={`Remover ${i + 1}`}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-ghost w-full border border-dashed border-ink-500">
        + Adicionar proibição
      </button>
      {items.length === 0 && <p className="text-sm text-slate-500">Sem proibições? Pode seguir em frente.</p>}
    </div>
  )
}
