// Hook central: estado do formulário, persistência em localStorage,
// salvamento parcial no servidor e navegação entre etapas.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEmptyBriefing, STEPS, StepDef } from '@/config/formConfig'
import { saveBriefing } from '@/lib/api'
import type { BriefingData } from '@/lib/types'

const STORAGE_KEY = 'briefing-mazik:v1'

interface Persisted {
  id: string
  data: BriefingData
  currentStep: number
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function loadPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted
      if (parsed.id && parsed.data) {
        return { id: parsed.id, data: { ...createEmptyBriefing(), ...parsed.data }, currentStep: parsed.currentStep ?? 0 }
      }
    }
  } catch {
    /* ignore */
  }
  return { id: uuid(), data: createEmptyBriefing(), currentStep: 0 }
}

export function useBriefingForm() {
  const initial = useRef<Persisted>(loadPersisted())
  const [id] = useState(initial.current.id)
  const [data, setData] = useState<BriefingData>(initial.current.data)
  const [stepIndex, setStepIndex] = useState(initial.current.currentStep)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Etapas visíveis dado o estado atual (lógica condicional).
  const visibleSteps: StepDef[] = useMemo(() => STEPS.filter((s) => (s.when ? s.when(data) : true)), [data])

  const totalSteps = visibleSteps.length
  const safeIndex = Math.min(stepIndex, totalSteps - 1)
  const currentStep = visibleSteps[safeIndex]
  const progress = totalSteps > 1 ? safeIndex / (totalSteps - 1) : 0

  // Persistência local a cada mudança.
  useEffect(() => {
    const persisted: Persisted = { id, data, currentStep: safeIndex }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    } catch {
      /* ignore */
    }
  }, [id, data, safeIndex])

  const update = useCallback((patch: Partial<BriefingData>) => {
    setData((prev) => ({ ...prev, ...patch }))
    setErrors((prev) => {
      // limpa erros dos campos que mudaram
      const next = { ...prev }
      Object.keys(patch).forEach((k) => delete next[k])
      return next
    })
  }, [])

  const validateCurrent = useCallback((): boolean => {
    if (!currentStep?.validate) {
      setErrors({})
      return true
    }
    const e = currentStep.validate(data)
    setErrors(e)
    return Object.keys(e).length === 0
  }, [currentStep, data])

  const persistPartial = useCallback(
    async (atIndex: number) => {
      setSaving(true)
      await saveBriefing(id, data, atIndex)
      setSaving(false)
    },
    [id, data],
  )

  const next = useCallback(async () => {
    if (!validateCurrent()) return false
    const target = Math.min(safeIndex + 1, totalSteps - 1)
    // salvamento parcial a cada etapa concluída
    void persistPartial(target)
    setStepIndex(target)
    return true
  }, [validateCurrent, safeIndex, totalSteps, persistPartial])

  const back = useCallback(() => {
    setErrors({})
    setStepIndex((i) => Math.max(0, i - 1))
  }, [])

  const goToStepId = useCallback(
    (id: string) => {
      const idx = visibleSteps.findIndex((s) => s.id === id)
      if (idx >= 0) {
        setErrors({})
        setStepIndex(idx)
      }
    },
    [visibleSteps],
  )

  const goToBlock = useCallback(
    (block: number) => {
      const idx = visibleSteps.findIndex((s) => s.block === block)
      if (idx >= 0) {
        setErrors({})
        setStepIndex(idx)
      }
    },
    [visibleSteps],
  )

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return {
    id,
    data,
    update,
    errors,
    setErrors,
    saving,
    stepIndex: safeIndex,
    totalSteps,
    currentStep,
    visibleSteps,
    progress,
    isFirst: safeIndex === 0,
    isLast: safeIndex === totalSteps - 1,
    next,
    back,
    goToStepId,
    goToBlock,
    validateCurrent,
    reset,
  }
}

export type UseBriefingForm = ReturnType<typeof useBriefingForm>
