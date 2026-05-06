import { useState } from 'react'
import { C } from './theme'
import { Card, SectionLabel, Input } from './components'
import { loadReels, saveReels, pickRandom } from './data'

// Defined OUTSIDE component — not recreated on every render
var MEAL_LABELS = {
  any:       'Any meal',
  breakfast: '🌅 Breakfast',
  lunch:     '☀️ Lunch',
  dinner:    '🌙 Dinner',
}

export default function ReelsTab() {
  var [reels, setReels]       = useState(function() { return loadReels() })
  var [name, setName]         = useState('')
  var [url, setUrl]           = useState('')
  var [note, setNote]         = useState('')
  var [meal, setMeal]         = useState('any')
  var [showAdd, setShowAdd]   = useState(false)
  var [nameError, setNameError] = useState(false)
  var [savedMsg, setSavedMsg] = useState(false)
  var [confirmDeleteId, setConfirmDeleteId] = useState(null)

  function toggleAdd() {
    setShowAdd(function(prev) { return !prev })
    setNameError(false)
    setSavedMsg(false)
  }

  function handleSave() {
    var trimmed = name.trim()
    if (!trimmed) {
      setNameError(true)
      return
    }
    var newReel = {
      id:    Date.now(),
      name:  trimmed,
      url:   url.trim(),
      note:  note.trim(),
      meal:  meal,
      added: new Date().toLocaleDateString('en-IN'),
    }
    var updated = reels.concat([newReel])
    setReels(updated)
    saveReels(updated)
    setName('')
    setUrl('')
    setNote('')
    setMeal('any')
    setNameError(false)
    setShowAdd(false)
    setSavedMsg(true)
    setTimeout(function() { setSavedMsg(false) }, 3000)
  }

  function handleDelete(id) {
    var updated = reels.filter(function(r) { return r.id !== id })
    setReels(updated)
    saveReels(updated)
    setConfirmDeleteId(null)
  }

  // pickRandom always returns array — safe to .map()
  var reminders = reels.length > 0 ? pickRandom(reels, 2) : []

  return (
    <div style={{ padding: '1.25rem' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>My Saved Reels</p>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {reels.length > 0
              ? reels.length + ' dish' + (reels.length > 1 ? 'es' : '') + ' saved'
              : 'Dishes from Instagram you want to try'}
          </p>
        </div>
        <button
          onClick={toggleAdd}
          style={{
            padding: '0.55rem 1.1rem',
            background: showAdd ? C.redBg : C.green,
            border: '1px solid ' + (showAdd ? C.red : C.green),
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: showAdd ? C.red : '#fff',
          }}
        >
          {showAdd ? 'Cancel' : '+ Add dish'}
        </button>
      </div>

      {/* Saved confirmation */}
      {savedMsg && (
        <div style={{
          background: C.greenLight, border: '1px solid ' + C.greenBorder,
          borderRadius: 10, padding: '0.65rem 1rem', marginBottom: 14,
          fontSize: 13, fontWeight: 500, color: C.green,
        }}>
          Dish saved! You will see it in your reminders.
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <Card style={{ marginBottom: 14, border: '1px solid ' + C.greenBorder }}>
          <SectionLabel>Add a dish you want to try</SectionLabel>

          <p style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>
            Dish name <span style={{ color: C.red }}>*</span>
          </p>
          <Input
            value={name}
            onChange={function(e) { setName(e.target.value); setNameError(false) }}
            placeholder="e.g. Soya tikka, Ragi dosa, Oats uttapam"
            style={{ marginBottom: nameError ? 4 : 12, border: nameError ? '1px solid ' + C.red : undefined }}
          />
          {nameError && (
            <p style={{ fontSize: 12, color: C.red, marginBottom: 10 }}>Please enter a dish name.</p>
          )}

          <p style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>For which meal?</p>
          <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
            {Object.keys(MEAL_LABELS).map(function(val) {
              var selected = meal === val
              return (
                <button
                  key={val}
                  onClick={function() { setMeal(val) }}
                  style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 14,
                    border: '1px solid ' + (selected ? C.greenBorder : C.border),
                    background: selected ? C.greenLight : C.card,
                    color: selected ? C.green : C.muted,
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {MEAL_LABELS[val]}
                </button>
              )
            })}
          </div>

          <p style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>
            Instagram reel link <span style={{ color: C.label }}>(optional)</span>
          </p>
          <p style={{ fontSize: 11, color: C.label, marginBottom: 6, lineHeight: 1.5 }}>
            In Instagram → open reel → tap ... → Copy link → paste here
          </p>
          <Input
            value={url}
            onChange={function(e) { setUrl(e.target.value) }}
            placeholder="https://www.instagram.com/reel/..."
            style={{ marginBottom: 12 }}
          />

          <p style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>
            Notes <span style={{ color: C.label }}>(optional)</span>
          </p>
          <Input
            value={note}
            onChange={function(e) { setNote(e.target.value) }}
            placeholder="e.g. Looks easy, kid friendly, high protein"
            style={{ marginBottom: 14 }}
          />

          <button
            onClick={handleSave}
            style={{
              width: '100%', padding: '0.85rem',
              background: C.green, color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
            }}
          >
            Save dish
          </button>
        </Card>
      )}

      {/* Reminder card — only shown when not adding */}
      {reels.length > 0 && !showAdd && (
        <Card style={{ background: C.purpleBg, border: '1px solid ' + C.purpleBorder, marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 8 }}>Try making one of these soon!</p>
          {reminders.map(function(r) {
            return (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.name}</span>
                  {r.meal && r.meal !== 'any' && (
                    <span style={{ fontSize: 11, color: C.label, marginLeft: 8 }}>{MEAL_LABELS[r.meal]}</span>
                  )}
                </div>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer noopener"
                    style={{ fontSize: 12, color: C.blue, fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 8 }}>
                    Watch
                  </a>
                ) : null}
              </div>
            )
          })}
        </Card>
      )}

      {/* Empty state */}
      {reels.length === 0 && !showAdd && (
        <Card style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1px dashed ' + C.border, background: 'transparent' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📱</div>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No dishes saved yet</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            See a yummy dish on Instagram?
            <br />Tap + Add dish above to save it here.
            <br />The app will remind you to make it!
          </p>
        </Card>
      )}

      {/* Full list */}
      {reels.length > 0 && (
        <div>
          <SectionLabel>All saved dishes ({reels.length})</SectionLabel>
          {reels.map(function(r) {
            return (
              <Card key={r.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</p>
                      {r.meal && r.meal !== 'any' && (
                        <span style={{ fontSize: 11, padding: '2px 8px', background: C.greenLight, color: C.green, borderRadius: 10, border: '1px solid ' + C.greenBorder }}>
                          {MEAL_LABELS[r.meal]}
                        </span>
                      )}
                    </div>
                    {r.note ? (
                      <p style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{r.note}</p>
                    ) : null}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 11, color: C.label }}>Added {r.added}</p>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noreferrer noopener"
                          style={{ fontSize: 12, color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
                          Open in Instagram
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, marginLeft: 10 }}>
                    {confirmDeleteId === r.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <button
                          onClick={function() { handleDelete(r.id) }}
                          style={{ fontSize: 12, padding: '5px 10px', background: C.redBg, color: C.red, border: '1px solid ' + C.red, borderRadius: 7, fontWeight: 600 }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={function() { setConfirmDeleteId(null) }}
                          style={{ fontSize: 12, padding: '5px 10px', background: C.card, color: C.muted, border: '1px solid ' + C.border, borderRadius: 7 }}
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={function() { setConfirmDeleteId(r.id) }}
                        style={{ background: 'none', border: 'none', fontSize: 20, color: '#d1d5db', padding: '2px 4px', lineHeight: 1 }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

    </div>
  )
}
