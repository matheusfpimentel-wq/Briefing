import { FieldDef } from '@/config/formConfig'
import type { BriefingData } from '@/lib/types'
import { maskPhoneBR } from '@/lib/validation'

interface Props {
  field: FieldDef
  data: BriefingData
  error?: string
  onChange: (patch: Partial<BriefingData>) => void
  autoFocus?: boolean
}

export default function FieldRenderer({ field, data, error, onChange, autoFocus }: Props) {
  const value = data[field.name]
  const id = `field-${field.name}`
  const describedBy = error ? `${id}-error` : field.help ? `${id}-help` : undefined

  const common = {
    id,
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
    className: 'field-input',
  }

  function renderControl() {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...common}
            rows={4}
            autoFocus={autoFocus}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange({ [field.name]: e.target.value } as Partial<BriefingData>)}
          />
        )

      case 'select':
        return (
          <select
            {...common}
            autoFocus={autoFocus}
            value={value as string}
            onChange={(e) => onChange({ [field.name]: e.target.value } as Partial<BriefingData>)}
          >
            <option value="">Selecione...</option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )

      case 'tel':
        return (
          <input
            {...common}
            type="tel"
            inputMode="numeric"
            autoFocus={autoFocus}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange({ [field.name]: maskPhoneBR(e.target.value) } as Partial<BriefingData>)}
          />
        )

      default:
        return (
          <input
            {...common}
            type={field.type}
            autoFocus={autoFocus}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange({ [field.name]: e.target.value } as Partial<BriefingData>)}
          />
        )
    }
  }

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {field.label}
        {field.required && <span className="text-accent-300"> *</span>}
      </label>
      {renderControl()}
      {field.help && !error && (
        <p id={`${id}-help`} className="mt-2 text-sm text-slate-500">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
