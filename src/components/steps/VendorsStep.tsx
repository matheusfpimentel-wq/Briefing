import { VENDOR_TYPE_OPTIONS } from '@/config/options'
import type { Vendor } from '@/lib/types'
import { StepProps } from './stepProps'

export default function VendorsStep({ data, update }: StepProps) {
  const items = data.vendors

  const setItem = (index: number, patch: Partial<Vendor>) => {
    update({ vendors: items.map((it, i) => (i === index ? { ...it, ...patch } : it)) })
  }
  const add = () => update({ vendors: [...items, { type: 'cerimonial', name: '', contact: '' }] })
  const remove = (index: number) => update({ vendors: items.filter((_, i) => i !== index) })

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-accent-600">Fornecedor {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-sm text-red-600 hover:underline">
              Remover
            </button>
          </div>

          <label className="field-label" htmlFor={`vd-type-${i}`}>
            Tipo
          </label>
          <select id={`vd-type-${i}`} className="field-input" value={item.type} onChange={(e) => setItem(i, { type: e.target.value })}>
            {VENDOR_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor={`vd-name-${i}`}>
                Nome (opcional)
              </label>
              <input
                id={`vd-name-${i}`}
                className="field-input"
                placeholder="Nome do fornecedor"
                value={item.name}
                onChange={(e) => setItem(i, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor={`vd-contact-${i}`}>
                Contato (opcional)
              </label>
              <input
                id={`vd-contact-${i}`}
                className="field-input"
                placeholder="WhatsApp ou e-mail"
                value={item.contact}
                onChange={(e) => setItem(i, { contact: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="btn-ghost w-full border border-dashed border-slate-300">
        + Adicionar fornecedor
      </button>

      {items.length === 0 && <p className="text-sm text-slate-500">Ainda não contratou ninguém? Sem problema, dá pra preencher depois.</p>}
    </div>
  )
}
