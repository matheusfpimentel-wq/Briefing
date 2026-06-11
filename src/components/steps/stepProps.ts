import type { BriefingData } from '@/lib/types'

export interface StepProps {
  data: BriefingData
  update: (patch: Partial<BriefingData>) => void
  errors: Record<string, string>
}
