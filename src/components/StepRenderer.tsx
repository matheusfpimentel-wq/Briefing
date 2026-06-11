import { StepDef } from '@/config/formConfig'
import type { BriefingData } from '@/lib/types'
import FieldRenderer from './fields/FieldRenderer'
import AgeRangesStep from './steps/AgeRangesStep'
import DoNotPlayStep from './steps/DoNotPlayStep'
import EnergyStep from './steps/EnergyStep'
import MomentsStep from './steps/MomentsStep'
import MustPlayStep from './steps/MustPlayStep'
import SummaryStep from './steps/SummaryStep'
import TopGenresStep from './steps/TopGenresStep'
import VetoedGenresStep from './steps/VetoedGenresStep'

interface Props {
  step: StepDef
  data: BriefingData
  errors: Record<string, string>
  update: (patch: Partial<BriefingData>) => void
  onEditBlock: (block: number) => void
  onSubmit: () => void
  submitting: boolean
  submitError?: string
}

export default function StepRenderer({ step, data, errors, update, onEditBlock, onSubmit, submitting, submitError }: Props) {
  const stepProps = { data, update, errors }

  if (step.custom) {
    switch (step.custom) {
      case 'ageRanges':
        return <AgeRangesStep {...stepProps} />
      case 'energy':
        return <EnergyStep {...stepProps} />
      case 'topGenres':
        return <TopGenresStep {...stepProps} />
      case 'vetoed':
        return <VetoedGenresStep {...stepProps} />
      case 'mustPlay':
        return <MustPlayStep {...stepProps} />
      case 'doNotPlay':
        return <DoNotPlayStep {...stepProps} />
      case 'moments':
        return <MomentsStep {...stepProps} />
      case 'summary':
        return <SummaryStep data={data} onEditBlock={onEditBlock} onSubmit={onSubmit} submitting={submitting} error={submitError} />
    }
  }

  // Etapa baseada em campos genéricos
  const visibleFields = (step.fields ?? []).filter((f) => (f.showWhen ? f.showWhen(data) : true))
  return (
    <div className="space-y-5">
      {visibleFields.map((field, i) => (
        <FieldRenderer key={field.name} field={field} data={data} error={errors[field.name]} onChange={update} autoFocus={i === 0 && field.type !== 'toggle'} />
      ))}
    </div>
  )
}
