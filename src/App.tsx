import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from './components/ProgressBar'
import StepRenderer from './components/StepRenderer'
import StepShell from './components/StepShell'
import { useBriefingForm } from './hooks/useBriefingForm'
import { submitBriefing } from './lib/api'

export default function App() {
  const form = useBriefingForm()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | undefined>()

  const handleSubmit = async () => {
    setSubmitError(undefined)
    setSubmitting(true)
    // PDF gerado no navegador: vai anexado no e-mail e fica disponível para download.
    let pdf: string | undefined
    try {
      const { briefingPdfBase64 } = await import('./lib/pdf')
      pdf = briefingPdfBase64(form.data)
    } catch {
      pdf = undefined // se o PDF falhar, o envio continua normalmente
    }
    const result = await submitBriefing(form.id, form.data, pdf)
    setSubmitting(false)
    if (result.ok) {
      const data = form.data
      form.reset()
      navigate('/obrigado', { state: { name: data.respondent_name, data } })
    } else {
      setSubmitError(result.error || 'Não consegui enviar agora. Tente novamente em instantes.')
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Enter avança (exceto em textarea e na tela de resumo)
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement) && !form.isLast) {
      e.preventDefault()
      void form.next()
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Cabeçalho fixo com progresso */}
      <header className="sticky top-0 z-10 bg-ink-900/80 backdrop-blur border-b border-ink-700">
        <div className="mx-auto max-w-2xl px-5 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <span aria-hidden className="text-accent-400 text-xl">🎧</span>
            <span className="font-extrabold tracking-tight">Briefing Mazik</span>
          </div>
          <ProgressBar
            progress={form.progress}
            blockLabel={form.currentStep?.blockLabel ?? ''}
            saving={form.saving}
            stepIndex={form.stepIndex}
            totalSteps={form.totalSteps}
          />
        </div>
      </header>

      {/* Conteúdo da etapa */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8" onKeyDown={onKeyDown}>
        <AnimatePresence mode="wait">
          {form.currentStep && (
            <StepShell key={form.currentStep.id} title={form.currentStep.title} subtitle={form.currentStep.subtitle}>
              <StepRenderer
                step={form.currentStep}
                data={form.data}
                errors={form.errors}
                update={form.update}
                onEditBlock={form.goToBlock}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitError={submitError}
              />
            </StepShell>
          )}
        </AnimatePresence>
      </main>

      {/* Navegação (escondida na tela de resumo, que tem botão próprio) */}
      {!form.isLast && (
        <footer className="sticky bottom-0 bg-ink-900/80 backdrop-blur border-t border-ink-700">
          <div className="mx-auto max-w-2xl px-5 py-4 flex items-center justify-between gap-4">
            <button type="button" onClick={form.back} disabled={form.isFirst} className="btn-ghost">
              ← Voltar
            </button>
            <button type="button" onClick={() => void form.next()} className="btn-primary flex-1 sm:flex-none sm:min-w-[160px]">
              Avançar →
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
