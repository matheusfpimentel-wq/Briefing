import { momentsFor } from '@/config/options'
import type { MomentValue, SongRef } from '@/lib/types'
import { StepProps } from './stepProps'

const EMPTY_SONG: SongRef = { title_artist: '', link: '' }

export default function MomentsStep({ data, update }: StepProps) {
  const defs = momentsFor(data.event_type)

  const getMoment = (id: string): MomentValue => data.moments[id] ?? { enabled: false, songs: [{ ...EMPTY_SONG }] }

  const setMoment = (id: string, value: MomentValue) => {
    update({ moments: { ...data.moments, [id]: value } })
  }

  const toggle = (id: string) => {
    const m = getMoment(id)
    setMoment(id, { enabled: !m.enabled, songs: m.songs.length ? m.songs : [{ ...EMPTY_SONG }] })
  }

  const setSong = (id: string, index: number, patch: Partial<SongRef>) => {
    const m = getMoment(id)
    const songs = m.songs.map((s, i) => (i === index ? { ...s, ...patch } : s))
    setMoment(id, { ...m, songs })
  }

  const addSong = (id: string) => {
    const m = getMoment(id)
    setMoment(id, { ...m, songs: [...m.songs, { ...EMPTY_SONG }] })
  }

  const removeSong = (id: string, index: number) => {
    const m = getMoment(id)
    setMoment(id, { ...m, songs: m.songs.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-4">
      {defs.map((def) => {
        const m = getMoment(def.id)
        return (
          <div key={def.id} className="card p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-slate-100">{def.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={m.enabled}
                aria-label={`${def.label}: vai acontecer?`}
                onClick={() => toggle(def.id)}
                className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                  m.enabled ? 'bg-accent-600' : 'bg-ink-600'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${m.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {m.enabled && (
              <div className="mt-4 space-y-3">
                {m.songs.map((song, i) => (
                  <div key={i} className="space-y-2 rounded-lg bg-ink-700/60 p-3">
                    {def.multi && m.songs.length > 1 && (
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Música {i + 1}</span>
                        <button type="button" onClick={() => removeSong(def.id, i)} className="text-red-400 hover:underline">
                          Remover
                        </button>
                      </div>
                    )}
                    <input
                      className="field-input"
                      placeholder="Qual música? (ex.: Canon in D)"
                      aria-label={`Música de ${def.label}`}
                      value={song.title_artist}
                      onChange={(e) => setSong(def.id, i, { title_artist: e.target.value })}
                    />
                    <input
                      className="field-input"
                      inputMode="url"
                      placeholder="Link (opcional)"
                      aria-label={`Link da música de ${def.label}`}
                      value={song.link ?? ''}
                      onChange={(e) => setSong(def.id, i, { link: e.target.value })}
                    />
                  </div>
                ))}
                {def.multi && (
                  <button type="button" onClick={() => addSong(def.id)} className="text-sm font-medium text-accent-300 hover:underline">
                    + Adicionar outra música
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
