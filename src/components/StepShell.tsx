import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  index: number
  children: ReactNode
}

export default function StepShell({ title, subtitle, index, children }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent-400">
        <span className="font-display">{String(index + 1).padStart(2, '0')}</span>
        <span className="h-px w-6 bg-accent-500/50" />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.15] text-slate-50">{title}</h1>
      {subtitle && <p className="mt-3 text-base text-slate-400">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </motion.section>
  )
}
