import { useState } from 'react'
import { C } from './theme'
import { Card, SectionLabel, GhostBtn, Input } from './components'
import { loadReels, saveReels, pickRandom } from './data'

export default function ReelsTab() {
  const [reels, setReels]   = useState(loadReels)
  const [name, setName]     = useState('')
  const [url, setUrl]       = useState('')
  const [note, setNote]     = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const save = () => {
    if (!name.trim()) return
    const updated = [...reels, {
      id:    Date.now(),
      name:  name.trim(),
      url:   url.trim(),
      note:  note.trim(),
      added: new Date().toLocaleDateString('en-IN'),
    }]
    setReels(updated); saveReels(updated)
    setName(''); setUrl(''); setNote(''); setShowAdd(false)
  }

  const remove = id => {
    const updated = reels.filter(r => r.id !== id)
    setReels(updated); saveReels(updated)
  }

  const reminders = reels.length ? pickRandom(reels, Math.min(2, reels.length)) : []

  return (
    <div style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>My Saved Reels</p>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Dishes from Instagram you want to try</p>
        </div>
        <button onClick={() => setShowAdd(p => !p)} style={{
          padding: '0.5rem 1rem',
          background: showAdd ? C.redBg : C.greenLight,
          border: `1px solid ${showAdd ? C.red : C.greenBorder}`,
          borderRadius: 10, fontSize: 13, fontWeight: 600,
          color: showAdd ? C.red : C.green,
        }}>
          {showAdd ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {reels.length > 0 && (
        <Card style={{ background: C.purpleBg, border: `1px solid ${C.purpleBorder}`, marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 8 }}>✨ Try making one of these soon</p>
          {reminders.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.name}</span>
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.blue, fontWeight: 500 }}>Watch ↗</a>
              )}
            </div>
          ))}
        </Card>
      )}

      {showAdd && (
        <Card style={{ marginBottom: 14 }}>
          <SectionLabel>Add new dish</SectionLabel>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Dish name (required)" style={{ marginBottom: 8 }} />
          <Input value={url}  onChange={e => setUrl(e.target.value)}  placeholder="Instagram reel URL (optional)" style={{ marginBottom: 8 }} />
          <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Notes (e.g. looks easy, high protein)" style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} style={{ flex: 1, padding: '0.7rem', background: C.green, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>Save</button>
            <GhostBtn onClick={() => setShowAdd(false)}>Cancel</GhostBtn>
          </div>
        </Card>
      )}

      {reels.length === 0 && !showAdd ? (
        <Card style={{ textAlign: 'center', padding: '2.5rem 1rem', border: `1px dashed ${C.border}`, background: 'transparent' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📱</div>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>No reels saved yet</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Save dishes you spot on Instagram. The app will remind you to make them!</p>
        </Card>
      ) : (
        reels.map(r => (
          <Card key={r.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{r.name}</p>
                {r.note && <p style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>📝 {r.note}</p>}
                {r.url  && <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.blue, fontWeight: 500 }}>🎥 Open reel</a>}
                <p style={{ fontSize: 11, color: C.label, marginTop: 5 }}>Added {r.added}</p>
              </div>
              <button onClick={() => remove(r.id)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#ccc', padding: '0 0 0 8px' }}>×</button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
