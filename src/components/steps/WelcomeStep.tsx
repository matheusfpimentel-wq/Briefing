import { StepProps } from './stepProps'

// Tela inicial: acolhe e tira a pressão de ter tudo pronto.
export default function WelcomeStep(_: StepProps) {
  return (
    <div className="space-y-5 text-slate-600 leading-relaxed">
      <p>
        Este é o espaço pra você me contar como imagina a trilha sonora do seu evento. Quanto mais eu
        souber, mais a curadoria fica com a sua cara.
      </p>
      <div className="rounded-2xl border border-accent-500/30 bg-accent-600/10 p-5">
        <p className="font-semibold text-slate-900">Sem pressão: nada aqui é obrigatório.</p>
        <p className="mt-2 text-sm">
          O que você não souber agora, a gente desenvolve juntos na reunião de briefing. Só peço que
          siga até o final para que as respostas sejam salvas.
        </p>
      </div>
      <p className="text-sm text-slate-500">
        Assim que você concluir, eu me dedico totalmente ao seu evento.
      </p>
    </div>
  )
}
