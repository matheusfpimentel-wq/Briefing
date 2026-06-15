import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { buildRoteiro, findOverlaps, sortKeysByTime } from '@/lib/roteiro'
import { StepProps } from './stepProps'

interface RowProps {
  itemKey: string
  label: string
  time: string
  detail: string
  onTime: (time: string) => void
}

function SortableRow({ itemKey, label, time, detail, onTime }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemKey })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className={`card flex items-center gap-3 p-3 ${isDragging ? 'ring-2 ring-accent-400' : ''}`}>
      <button
        type="button"
        aria-label={`Arrastar ${label}`}
        className="shrink-0 cursor-grab touch-none rounded-lg px-2 py-3 text-slate-500 hover:text-accent-300 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <circle cx="5" cy="3" r="1.4" /><circle cx="11" cy="3" r="1.4" />
          <circle cx="5" cy="8" r="1.4" /><circle cx="11" cy="8" r="1.4" />
          <circle cx="5" cy="13" r="1.4" /><circle cx="11" cy="13" r="1.4" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-100">{label}</p>
        {detail && <p className="truncate text-xs text-slate-400">{detail}</p>}
      </div>

      <input
        type="time"
        aria-label={`Horário de ${label}`}
        className="w-28 shrink-0 rounded-lg border border-ink-500 bg-ink-700/70 px-2 py-2 text-sm text-slate-100 focus:border-accent-400 focus:ring-2 focus:ring-accent-500/40"
        value={time}
        onChange={(e) => onTime(e.target.value)}
      />
    </div>
  )
}

export default function RoteiroStep({ data, update }: StepProps) {
  const items = buildRoteiro(data)
  const keys = items.map((i) => i.key)
  const overlaps = findOverlaps(data)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = keys.indexOf(String(active.id))
    const newIndex = keys.indexOf(String(over.id))
    update({ roteiro_order: arrayMove(keys, oldIndex, newIndex) })
  }

  const setItemTime = (key: string, time: string) => {
    if (key.startsWith('moment:')) {
      const id = key.slice('moment:'.length)
      const m = data.moments[id]
      if (m) update({ moments: { ...data.moments, [id]: { ...m, time } } })
    } else if (key.startsWith('attr:')) {
      const i = Number(key.slice('attr:'.length))
      update({ other_attractions: data.other_attractions.map((a, idx) => (idx === i ? { ...a, time } : a)) })
    }
  }

  if (!items.length) {
    return <p className="text-slate-400">Marque momentos especiais ou adicione atrações para montar o roteiro.</p>
  }

  return (
    <div>
      {overlaps.length > 0 && (
        <div className="mb-4 border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-200" role="alert">
          <p className="font-semibold">Atenção: sobreposição de horários</p>
          <ul className="mt-1 list-disc list-inside">
            {overlaps.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => update({ roteiro_order: sortKeysByTime(data) })} className="text-sm font-medium text-accent-300 hover:underline">
          Ordenar por horário
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={keys} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {items.map((item) => (
              <SortableRow key={item.key} itemKey={item.key} label={item.label} time={item.time} detail={item.detail} onTime={(t) => setItemTime(item.key, t)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className="mt-4 text-xs text-slate-500">Arraste pela alça à esquerda para reordenar. Quem tem horário pode ser ordenado automaticamente no botão acima.</p>
    </div>
  )
}
