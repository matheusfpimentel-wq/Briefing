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
      navigate('/obrigado', { state: { name: data.respondent_name, data, id: form.id, editing: form.editing } })
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

  const nextLabel = form.currentStep?.nextLabel ?? 'Avançar'

  if (form.loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6">
        <div className="glass-panel p-8 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
          <p className="text-slate-600">Carregando o briefing…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Cabeçalho com progresso */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200/60">
        <div className="mx-auto max-w-4xl px-6 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden className="h-7 w-7 shrink-0 rotate-12 rounded-lg bg-gradient-to-br from-accent-500 to-accent2-500 shadow-lg shadow-accent-900/40" />
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight text-slate-900">
                Briefing <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent2-600">Mazik</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Curadoria musical</div>
            </div>
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

      {/* Conteúdo da etapa (centralizado verticalmente, estilo Typeform) */}
      <main className="flex flex-1" onKeyDown={onKeyDown}>
        <div className="m-auto w-full max-w-3xl px-6 py-10 sm:py-16">
          {form.loadError && (
            <div className="mb-4 border border-amber-500/50 bg-amber-400/20 p-4 text-sm text-amber-800" role="alert">
              Não consegui abrir esse briefing ({form.loadError}). Começando um novo no lugar.
            </div>
          )}
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
                  editing={form.editing}
                />
              </StepShell>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Navegação (escondida na tela de resumo, que tem botão próprio) */}
      {!form.isLast && (
        <footer className="sticky bottom-0 bg-white/70 backdrop-blur border-t border-slate-200/60">
          <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between gap-4">
            <button type="button" onClick={form.back} disabled={form.isFirst} className="btn-ghost disabled:opacity-0">
              Voltar
            </button>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-slate-500 sm:inline">pressione Enter ↵</span>
              <button type="button" onClick={() => void form.next()} className="btn-primary min-w-[150px]">
                {nextLabel}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
