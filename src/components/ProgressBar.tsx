import { motion } from 'framer-motion'

interface Props {
  progress: number // 0..1
  blockLabel: string
  saving: boolean
  stepIndex: number
  totalSteps: number
}

export default function ProgressBar({ progress, blockLabel, saving, stepIndex, totalSteps }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
        <span className="font-medium uppercase tracking-wide text-accent-300">{blockLabel}</span>
        <span aria-live="polite">
          {saving ? 'Salvando…' : `Etapa ${stepIndex + 1} de ${totalSteps}`}
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-ink-600"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-300"
          initial={false}
          animate={{ width: `${Math.max(progress * 100, 4)}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}
