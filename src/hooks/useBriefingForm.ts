// Hook central: estado do formulário, persistência em localStorage,
// salvamento parcial no servidor e navegação entre etapas.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEmptyBriefing, STEPS, StepDef } from '@/config/formConfig'
import { loadBriefing, saveBriefing } from '@/lib/api'
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

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

/** Lê ?id=<uuid> da URL (modo edição de um briefing existente). */
function getUrlId(): string | null {
  try {
    const p = new URLSearchParams(window.location.search).get('id')
    return p && UUID_RE.test(p) ? p : null
  } catch {
    return null
  }
}

export function useBriefingForm() {
  const urlIdRef = useRef<string | null>(getUrlId())
  const editing = !!urlIdRef.current
  const initial = useRef<Persisted>(editing ? { id: urlIdRef.current as string, data: createEmptyBriefing(), currentStep: 0 } : loadPersisted())
  const [id] = useState(initial.current.id)
  const [data, setData] = useState<BriefingData>(initial.current.data)
  const [stepIndex, setStepIndex] = useState(initial.current.currentStep)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(editing)
  const [loadError, setLoadError] = useState<string | undefined>()

  // Modo edição: carrega o briefing existente do servidor e abre na revisão.
  useEffect(() => {
    if (!editing) return
    let cancelled = false
    loadBriefing(id).then((res) => {
      if (cancelled) return
      if (res.ok && res.data) {
        setData({ ...createEmptyBriefing(), ...res.data })
        setStepIndex(9999) // vai para a tela de resumo (última etapa)
      } else {
        setLoadError(res.error || 'Briefing não encontrado.')
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Etapas visíveis dado o estado atual (lógica condicional).
  const visibleSteps: StepDef[] = useMemo(() => STEPS.filter((s) => (s.when ? s.when(data) : true)), [data])

  const totalSteps = visibleSteps.length
  const safeIndex = Math.min(stepIndex, totalSteps - 1)
  const currentStep = visibleSteps[safeIndex]
  const progress = totalSteps > 1 ? safeIndex / (totalSteps - 1) : 0

  // Persistência local a cada mudança (desligada no modo edição, que é
  // ancorado no servidor pelo id da URL).
  useEffect(() => {
    if (editing || loading) return
    const persisted: Persisted = { id, data, currentStep: safeIndex }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    } catch {
      /* ignore */
    }
  }, [editing, loading, id, data, safeIndex])

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
    editing,
    loading,
    loadError,
    next,
    back,
    goToStepId,
    goToBlock,
    validateCurrent,
    reset,
  }
}

export type UseBriefingForm = ReturnType<typeof useBriefingForm>
