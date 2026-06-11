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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="w-full"
    >
      <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-slate-50">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
      <div className="mt-7">{children}</div>
    </motion.section>
  )
}
