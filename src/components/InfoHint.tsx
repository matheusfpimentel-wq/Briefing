import { useState } from 'react'

interface Props {
  text: string
  label?: string
}

/** Ícone "i" que revela um texto de ajuda ao toque (bom para mobile). */
export default function InfoHint({ text, label }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label ? `Mais informações sobre ${label}` : 'Mais informações'}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        onBlur={() => setOpen(false)}
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold italic transition-colors ${
          open ? 'border-accent-400 bg-accent-500/20 text-accent-200' : 'border-ink-400 text-slate-400 hover:border-accent-400 hover:text-accent-300'
        }`}
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-7 z-30 w-60 max-w-[75vw] rounded-lg border border-ink-500 bg-ink-800 p-3 text-xs font-normal not-italic leading-relaxed text-slate-300 shadow-xl"
        >
          {text}
        </span>
      )}
    </span>
  )
}
