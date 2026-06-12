import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import type { BriefingData } from '@/lib/types'

interface LocationState {
  name?: string
  data?: BriefingData
}

export default function ThankYou() {
  const location = useLocation()
  const state = location.state as LocationState | null
  const name = state?.name?.trim()
  const data = state?.data

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card max-w-lg w-full p-8 text-center"
      >
        <div className="text-5xl mb-4" aria-hidden>
          🎧
        </div>
        <h1 className="text-3xl font-extrabold text-slate-50">
          {name ? `Valeu, ${name}!` : 'Briefing recebido!'}
        </h1>
        <p className="mt-4 text-slate-300 leading-relaxed">
          Briefing recebido! Agora começa a curadoria do seu evento. Vou montar um set com a sua cara.
          Qualquer ajuste, me chama no WhatsApp. 💜
        </p>

        {data && (
          <button
            type="button"
            onClick={async () => (await import('@/lib/pdf')).downloadBriefingPdf(data)}
            className="btn-primary mt-8 w-full"
          >
            ⬇️ Baixar uma cópia em PDF
          </button>
        )}

        <Link to="/" className="btn-ghost mt-3 inline-flex">
          Voltar ao início
        </Link>
      </motion.div>
    </div>
  )
}
