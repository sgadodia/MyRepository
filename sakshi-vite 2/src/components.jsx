import { useState } from 'react'
import { C } from './theme'

export function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1rem 1.1rem', ...style }}>
      {children}
    </div>
  )
}

export function SectionLabel({ children, style = {} }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: C.label, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, ...style }}>
      {children}
    </p>
  )
}

export function PrimaryBtn({ onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '0.85rem', background: C.green, color: '#fff',
      border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, marginBottom: 14,
      transition: 'opacity 0.15s', ...style,
    }}>
      {children}
    </button>
  )
}

export function GhostBtn({ onClick, children, style = {}, danger = false }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.45rem 0.85rem', background: 'transparent',
      border: `1px solid ${danger ? C.red : C.border}`,
      borderRadius: 9, fontSize: 13, fontWeight: 500,
      color: danger ? C.red : C.text, ...style,
    }}>
      {children}
    </button>
  )
}

export function Input({ value, onChange, placeholder, onKeyDown, type = 'text', style = {} }) {
  return (
    <input
      type={type} value={value} onChange={onChange}
      onKeyDown={onKeyDown} placeholder={placeholder}
      style={{
        width: '100%', padding: '0.7rem 0.9rem', fontSize: 14,
        border: `1px solid ${C.border}`, borderRadius: 10,
        background: '#f9fbf8', color: C.text, outline: 'none', ...style,
      }}
    />
  )
}

export function ProteinBadge({ protein }) {
  const col    = protein >= 20 ? C.green  : protein >= 12 ? C.amber  : C.muted
  const bg     = protein >= 20 ? C.greenLight : protein >= 12 ? C.amberBg : '#f8fafc'
  const border = protein >= 20 ? C.greenBorder : protein >= 12 ? C.amberBorder : C.border
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: col, background: bg, border: `1px solid ${border}`, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap' }}>
      ~{protein}g protein
    </span>
  )
}

export function MealCard({ meal, category, onSwap, master }) {
  const [swapping, setSwapping] = useState(false)
  if (!meal) return null
  const catKey = category.toLowerCase()
  return (
    <Card style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: C.label, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category}</span>
        <ProteinBadge protein={meal.protein || 0} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 500, marginBottom: meal.tip ? 5 : 0 }}>{meal.name}</p>
      {meal.tip  && <p style={{ fontSize: 12, color: C.amber, marginBottom: meal.bulk ? 4 : 0 }}>💡 {meal.tip}</p>}
      {meal.bulk && <p style={{ fontSize: 12, color: C.blue }}>🥘 {meal.bulk}</p>}
      <div style={{ marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
        {swapping ? (
          <div>
            <select
              defaultValue=""
              onChange={e => { if (e.target.value) { onSwap(e.target.value); setSwapping(false) } }}
              style={{ width: '100%', padding: '0.6rem 0.9rem', fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 9, background: '#f9fbf8', color: C.text, outline: 'none' }}
            >
              <option value="">— pick a different dish —</option>
              {(master[catKey] || []).map((d, i) => (
                <option key={i} value={d.name}>{d.name} (~{d.protein}g protein)</option>
              ))}
            </select>
            <GhostBtn onClick={() => setSwapping(false)} style={{ marginTop: 7, fontSize: 12 }}>Cancel</GhostBtn>
          </div>
        ) : (
          <button onClick={() => setSwapping(true)} style={{
            fontSize: 12, color: C.muted, background: 'none', border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '4px 10px', fontWeight: 500,
          }}>↕ Swap from my dishes</button>
        )}
      </div>
    </Card>
  )
}
