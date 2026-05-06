import { useState } from 'react'
import { C } from './theme'
import { Card, SectionLabel, PrimaryBtn, ProteinBadge, Input } from './components'
import { loadMaster, PANTRY, QUICK_VEGGIES, getFridgeSuggestions } from './data'

export default function FridgeTab() {
  const [master]      = useState(loadMaster)
  const [veggies, setVeggies]       = useState([])
  const [custom, setCustom]         = useState('')
  const [suggestions, setSuggestions] = useState(null)

  const toggle = v => {
    setVeggies(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
    setSuggestions(null)
  }

  const addCustom = () => {
    if (!custom.trim()) return
    custom.split(',').map(v => v.trim()).filter(Boolean).forEach(v => {
      if (!veggies.includes(v)) setVeggies(p => [...p, v])
    })
    setCustom('')
    setSuggestions(null)
  }

  const suggest = () => setSuggestions(getFridgeSuggestions(veggies, master))

  return (
    <div style={{ padding: '1.25rem' }}>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Always in your kitchen</span>
          <span style={{ fontSize: 10, padding: '2px 8px', background: C.greenLight, color: C.green, borderRadius: 10, fontWeight: 600 }}>Always available</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {PANTRY.map(p => (
            <span key={p} style={{ fontSize: 11, padding: '3px 8px', background: '#f9fbf8', border: `1px solid ${C.border}`, borderRadius: 12, color: C.muted }}>{p}</span>
          ))}
        </div>
      </Card>

      <SectionLabel>What vegetables do you have today?</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
        {QUICK_VEGGIES.map(v => (
          <button key={v} onClick={() => toggle(v)} style={{
            fontSize: 12, padding: '5px 12px', borderRadius: 14,
            border: `1px solid ${veggies.includes(v) ? C.greenBorder : C.border}`,
            background: veggies.includes(v) ? C.greenLight : C.card,
            color: veggies.includes(v) ? C.green : C.muted,
            fontWeight: veggies.includes(v) ? 600 : 400, transition: 'all 0.12s',
          }}>{v}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Input
          value={custom} onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustom()}
          placeholder="Other veggie..." style={{ flex: 1 }}
        />
        <button onClick={addCustom} style={{ padding: '0 1rem', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500, color: C.text }}>
          Add
        </button>
      </div>

      {veggies.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {veggies.map(v => (
            <span key={v} style={{ fontSize: 12, padding: '4px 10px', background: C.blueBg, color: C.blue, borderRadius: 14, border: `1px solid ${C.blueBorder}`, display: 'flex', alignItems: 'center', gap: 4 }}>
              {v}
              <span onClick={() => toggle(v)} style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1, opacity: 0.6 }}>×</span>
            </span>
          ))}
        </div>
      )}
      {!veggies.length && (
        <p style={{ fontSize: 12, color: C.label, fontStyle: 'italic', marginBottom: 10 }}>No veggies selected — will suggest pantry-only meals.</p>
      )}

      <PrimaryBtn onClick={suggest}>🥦 What can I make today?</PrimaryBtn>

      {suggestions && (
        <div className="fade-up">
          <SectionLabel>Meals using your ingredients</SectionLabel>
          {['breakfast','lunch','dinner'].map(cat => (
            <Card key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: C.label, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat}</span>
                <ProteinBadge protein={suggestions[cat]?.protein || 0} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: suggestions[cat]?.tip ? 5 : 0 }}>{suggestions[cat]?.name}</p>
              {suggestions[cat]?.tip && <p style={{ fontSize: 12, color: C.amber }}>💡 {suggestions[cat].tip}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
