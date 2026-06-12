import { REFERENCE_TYPE_OPTIONS } from '@/config/options'
import type { ReferenceItem } from '@/lib/types'
import { StepProps } from './stepProps'

export default function ReferencesStep({ data, update }: StepProps) {
  const items = data.references

  const setItem = (index: number, patch: Partial<ReferenceItem>) => {
    update({ references: items.map((it, i) => (i === index ? { ...it, ...patch } : it)) })
  }
  const add = () => update({ references: [...items, { type: 'playlist', value: '' }] })
  const remove = (index: number) => update({ references: items.filter((_, i) => i !== index) })

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-accent-300">Referência {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-sm text-red-400 hover:underline">
              Remover
            </button>
          </div>
          <label className="field-label" htmlFor={`ref-type-${i}`}>
            Tipo de referência
          </label>
          <select id={`ref-type-${i}`} className="field-input" value={item.type} onChange={(e) => setItem(i, { type: e.target.value })}>
            {REFERENCE_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <label className="field-label mt-3" htmlFor={`ref-value-${i}`}>
            Link ou descrição
          </label>
          <input
            id={`ref-value-${i}`}
            className="field-input"
            placeholder={item.type === 'visual' ? 'Ex.: link do Pinterest ou do álbum de fotos' : 'Cole o link aqui'}
            value={item.value}
            onChange={(e) => setItem(i, { value: e.target.value })}
          />
        </div>
      ))}

      <button type="button" onClick={add} className="btn-ghost w-full border border-dashed border-ink-500">
        + Adicionar referência
      </button>

      <div className="pt-2">
        <label htmlFor="signature_song" className="field-label">
          Se uma música definisse você ou vocês, qual seria?
        </label>
        <input
          id="signature_song"
          className="field-input"
          placeholder="Ex.: Sweet Disposition, The Temper Trap"
          value={data.signature_song}
          onChange={(e) => update({ signature_song: e.target.value })}
        />
      </div>
    </div>
  )
}
