import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function StepShell({ title, subtitle, children }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel w-full p-6 sm:p-9"
    >
      <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.15] text-slate-50">{title}</h1>
      {subtitle && <p className="mt-3 text-base text-slate-400">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </motion.section>
  )
}
