import { useState } from 'react'
import { C } from './theme'
import TodayTab  from './TodayTab'
import FridgeTab from './FridgeTab'
import ReelsTab  from './ReelsTab'
import MasterTab from './MasterTab'

const NAV = [
  { id: 'today',  label: 'Today',     icon: '🍽️' },
  { id: 'fridge', label: 'Fridge',    icon: '🥦' },
  { id: 'reels',  label: 'Reels',     icon: '📱' },
  { id: 'master', label: 'My Dishes', icon: '📖' },
]

export default function App() {
  const [tab, setTab] = useState('today')

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${C.border}`,
        padding: '0.9rem 1.25rem 0.7rem',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.text }}>🥗 Sakshi's Meal Planner</p>
        <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Postpartum · Pure Veg · Protein-focused · Free forever</p>
      </div>

      {/* Page content */}
      {tab === 'today'  && <TodayTab />}
      {tab === 'fridge' && <FridgeTab />}
      {tab === 'reels'  && <ReelsTab />}
      {tab === 'master' && <MasterTab />}

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 520,
        background: '#fff', borderTop: `1px solid ${C.border}`,
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 100,
      }}>
        {NAV.map(it => (
          <button key={it.id} onClick={() => setTab(it.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '0.55rem 0.25rem', background: 'none', border: 'none',
            color: tab === it.id ? C.green : C.label,
            borderTop: tab === it.id ? `2px solid ${C.green}` : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 20 }}>{it.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === it.id ? 600 : 400, marginTop: 2 }}>{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
