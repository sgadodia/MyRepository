import { useState, useEffect } from 'react'
import { C } from './theme'
import { Card, SectionLabel, Input } from './components'
import { loadReels, saveReels, pickRandom } from './data'

export default function ReelsTab() {
  const [reels, setReels]     = useState(() => loadReels())
  const [name, setName]       = useState('')
  const [url, setUrl]         = useState('')
  const [note, setNote]       = useState('')
  const [meal, setMeal]       = useState('any')
  const [showAdd, setShowAdd] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Re-sync from localStorage whenever tab becomes visible
  useEffect(() => {
    const onFocus = () => setReels(loadReels())
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      alert('Please enter a dish name first.')
      return
    }
    const newReel = {
      id:    Date.now(),
      name:  trimmedName,
      url:   url.trim(),
      note:  note.trim(),
      meal:  meal,
      added: new Date().toLocaleDateString('en-IN'),
    }
    const updated = [...reels, newReel]
    setReels(updated)
    saveReels(updated)
    // Reset form
    setName('')
    setUrl('')
    setNote('')
    setMeal('any')
    setShowAdd(false)
    // Show confirmation
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDelete = (id) => {
    const updated = reels.filter(r => r.id !== id)
    setReels(updated)
    saveReels(updated)
    setDeleteId(null)
  }

  const reminders = reels.length >= 1 ? pickRandom(reels, Math.min(2, reels.length)) : []

  const mealLabels = { any: 'Any meal', breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner' }

  return (
    <div style={{ padding: '1.25rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>My Saved Reels</p>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {reels.length > 0 ? `${reels.length} dish${reels.length > 1 ? 'es' : ''} saved` : 'Dishes from Instagram you want to try'}
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(p => !p); setSaved(false) }}
          style={{
            padding: '0.55rem 1.1rem',
            background: showAdd ? C.redBg : C.green,
            border: `1px solid ${showAdd ? C.red : C.green}`,
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: showAdd ? C.red : '#fff',
          }}
        >
          {showAdd ? '✕ Cancel' : '+ Add dish'}
        </button>
      </div>

      {/* Save confirmation toast */}
      {saved && (
        <div style={{
          background: C.greenLight, border: `1px solid ${C.greenBorder}`,
          borderRadius: 10, padding: '0.65rem 1rem', marginBottom: 14,
          fontSize: 13, fontWeight: 500, color: C.green, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ✅ Dish saved! You will see it in your reminders.
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <Card style={{ marginBottom: 14, border: `1px solid ${C.greenBorder}` }}>
          <SectionLabel>Add a dish you want to try</SectionLabel>

          {/* Dish name */}
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>Dish name <span style={{ color: C.red }}>*</span></p>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Soya tikka, Ragi dosa, Oats uttapam"
            style={{ marginBottom: 12 }}
          />

          {/* Meal type */}
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>For which meal?</p>
          <div style={{ display: 'flex', gap: 7, marginBottom: 12, flexWrap: 'wrap' }}>
            {Object.entries(mealLabels).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setMeal(val)}
                style={{
                  fontSize: 12, padding: '5px 12px', borderRadius: 14, border: `1px solid ${meal === val ? C.greenBorder : C.border}`,
                  background: meal === val ? C.greenLight : C.card,
                  color: meal === val ? C.green : C.muted,
                  fontWeight: meal === val ? 600 : 400,
                }}
              >{label}</button>
            ))}
          </div>

          {/* Instagram URL */}
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>Instagram reel link <span style={{ color: C.label }}>(optional)</span></p>
          <p style={{ fontSize: 11, color: C.label, marginBottom: 6, lineHeight: 1.5 }}>
            In Instagram: open the reel → tap ··· → Copy link → paste below
          </p>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/reel/..."
            style={{ marginBottom: 12 }}
          />

          {/* Notes */}
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>Notes <span style={{ color: C.label }}>(optional)</span></p>
          <Input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Looks easy, kid friendly, high protein"
            style={{ marginBottom: 14 }}
          />

          <button
            onClick={handleSave}
            style={{
              width: '100%', padding: '0.85rem', background: C.green,
              color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
            }}
          >
            💾 Save dish
          </button>
        </Card>
      )}

      {/* Reminder card */}
      {reels.length > 0 && !showAdd && (
        <Card style={{ background: C.purpleBg, border: `1px solid ${C.purpleBorder}`, marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 8 }}>✨ Try making one of these soon!</p>
          {reminders.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.name}</span>
                {r.meal && r.meal !== 'any' && (
                  <span style={{ fontSize: 11, color: C.label, marginLeft: 8 }}>{mealLabels[r.meal]}</span>
                )}
              </div>
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ fontSize: 12, color: C.blue, fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 8 }}
                >
                  Watch ↗
                </a>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* Empty state */}
      {reels.length === 0 && !showAdd && (
        <Card style={{ textAlign: 'center', padding: '2.5rem 1rem', border: `1px dashed ${C.border}`, background: 'transparent' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📱</div>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No dishes saved yet</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            See a yummy dish on Instagram?<br/>
            Tap <strong>+ Add dish</strong> above to save it here.<br/>
            The app will remind you to make it!
          </p>
        </Card>
      )}

      {/* Saved reels list */}
      {reels.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: showAdd ? 0 : 4 }}>All saved dishes ({reels.length})</SectionLabel>
          {reels.map(r => (
            <Card key={r.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</p>
                    {r.meal && r.meal !== 'any' && (
                      <span style={{ fontSize: 11, padding: '2px 8px', background: C.greenLight, color: C.green, borderRadius: 10, border: `1px solid ${C.greenBorder}` }}>
                        {mealLabels[r.meal]}
                      </span>
                    )}
                  </div>
                  {r.note && (
                    <p style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>📝 {r.note}</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontSize: 11, color: C.label }}>Added {r.added}</p>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ fontSize: 12, color: C.blue, fontWeight: 600, textDecoration: 'none' }}
                      >
                        🎥 Open in Instagram
                      </a>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                  {deleteId === r.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{ fontSize: 11, padding: '4px 8px', background: C.redBg, color: C.red, border: `1px solid ${C.red}`, borderRadius: 7, fontWeight: 600 }}
                      >Delete</button>
                      <button
                        onClick={() => setDeleteId(null)}
                        style={{ fontSize: 11, padding: '4px 8px', background: C.card, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7 }}
                      >Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(r.id)}
                      style={{ background: 'none', border: 'none', fontSize: 18, color: '#d1d5db', padding: '2px 4px', lineHeight: 1 }}
                    >×</button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}
