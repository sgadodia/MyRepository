import { useState } from 'react'
import { C, CAT_META } from './theme'
import { Card, SectionLabel, GhostBtn, Input, ProteinBadge } from './components'
import { loadMaster, saveMaster, MEAL_DB } from './data'

export default function MasterTab() {
  const [master, setMaster]   = useState(loadMaster)
  const [activeCat, setActiveCat] = useState('breakfast')
  const [newName, setNewName] = useState('')
  const [newProtein, setNewProtein] = useState('')
  const [newTip, setNewTip]   = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editVal, setEditVal] = useState({})

  const update = m => { setMaster(m); saveMaster(m) }

  const add = () => {
    if (!newName.trim()) return
    const dish = { name: newName.trim(), protein: parseInt(newProtein) || 0, tip: newTip.trim(), bulk: '' }
    update({ ...master, [activeCat]: [...(master[activeCat] || []), dish] })
    setNewName(''); setNewProtein(''); setNewTip(''); setShowAdd(false)
  }

  const remove = (cat, idx) => {
    const list = [...master[cat]]; list.splice(idx, 1)
    update({ ...master, [cat]: list })
  }

  const startEdit = (cat, idx) => { setEditing({ cat, idx }); setEditVal({ ...master[cat][idx] }) }

  const saveEdit = () => {
    const list = [...master[editing.cat]]
    list[editing.idx] = { ...list[editing.idx], ...editVal }
    update({ ...master, [editing.cat]: list })
    setEditing(null)
  }

  const resetCategory = () => {
    if (!window.confirm(`Reset ${activeCat} to default dishes? Custom additions will be lost.`)) return
    const defaults = MEAL_DB[activeCat].map(d => ({ name: d.name, protein: d.protein, tip: d.tip || '', bulk: d.bulk || '' }))
    update({ ...master, [activeCat]: defaults })
  }

  const m = CAT_META[activeCat]

  return (
    <div style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>My Dish Library</p>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Add and manage your known dishes</p>
        </div>
        <GhostBtn onClick={resetCategory} style={{ fontSize: 11, padding: '0.3rem 0.7rem' }}>Reset</GhostBtn>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7, marginBottom: 16 }}>
        {Object.entries(CAT_META).map(([cat, meta]) => (
          <button key={cat} onClick={() => { setActiveCat(cat); setShowAdd(false); setEditing(null) }} style={{
            padding: '0.55rem 0.25rem',
            border: `1px solid ${activeCat === cat ? meta.border : C.border}`,
            borderRadius: 10,
            background: activeCat === cat ? meta.bg : C.card,
            fontSize: 11, fontWeight: activeCat === cat ? 600 : 400,
            color: activeCat === cat ? meta.color : C.muted,
            textAlign: 'center', transition: 'all 0.12s',
          }}>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{meta.emoji}</div>
            <div style={{ textTransform: 'capitalize' }}>{cat}</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>{(master[cat] || []).length}</div>
          </button>
        ))}
      </div>

      {/* Add toggle */}
      <button onClick={() => setShowAdd(p => !p)} style={{
        width: '100%', padding: '0.7rem', marginBottom: 14,
        background: showAdd ? C.redBg : C.greenLight,
        border: `1px solid ${showAdd ? C.red : C.greenBorder}`,
        borderRadius: 10, fontSize: 13, fontWeight: 600,
        color: showAdd ? C.red : C.green,
      }}>
        {showAdd ? '✕ Cancel' : `+ Add ${activeCat} dish`}
      </button>

      {showAdd && (
        <Card style={{ marginBottom: 14 }}>
          <SectionLabel>New {activeCat} dish</SectionLabel>
          <Input value={newName}    onChange={e => setNewName(e.target.value)}    placeholder="Dish name (required)"            style={{ marginBottom: 8 }} />
          <Input value={newProtein} onChange={e => setNewProtein(e.target.value)} placeholder="Approx protein in grams (e.g. 18)" type="number" style={{ marginBottom: 8 }} />
          <Input value={newTip}     onChange={e => setNewTip(e.target.value)}     placeholder="Quick tip (optional)"             style={{ marginBottom: 12 }} />
          <button onClick={add} style={{ width: '100%', padding: '0.75rem', background: C.green, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>
            Add to Library
          </button>
        </Card>
      )}

      <SectionLabel>{m.emoji} {activeCat} — {(master[activeCat] || []).length} dishes</SectionLabel>

      {!(master[activeCat] || []).length ? (
        <Card style={{ textAlign: 'center', padding: '2rem', color: C.muted, fontSize: 13 }}>
          No dishes yet. Add your first {activeCat} dish above!
        </Card>
      ) : (
        (master[activeCat] || []).map((dish, idx) => (
          <Card key={idx} style={{ marginBottom: 8 }}>
            {editing && editing.cat === activeCat && editing.idx === idx ? (
              <div>
                <Input value={editVal.name    || ''} onChange={e => setEditVal(v => ({ ...v, name:    e.target.value }))} placeholder="Dish name"    style={{ marginBottom: 8 }} />
                <Input value={editVal.protein || ''} onChange={e => setEditVal(v => ({ ...v, protein: e.target.value }))} placeholder="Protein (g)" type="number" style={{ marginBottom: 8 }} />
                <Input value={editVal.tip     || ''} onChange={e => setEditVal(v => ({ ...v, tip:     e.target.value }))} placeholder="Tip"          style={{ marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveEdit} style={{ flex: 1, padding: '0.6rem', background: C.green, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600 }}>Save</button>
                  <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: dish.tip ? 5 : 0 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.border, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{dish.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14, flexWrap: 'wrap' }}>
                    {dish.protein > 0 && <ProteinBadge protein={dish.protein} />}
                    {dish.tip && <span style={{ fontSize: 11, color: C.amber }}>💡 {dish.tip}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
                  <button onClick={() => startEdit(activeCat, idx)} style={{ background: 'none', border: 'none', fontSize: 15, color: C.label, padding: '2px 5px' }}>✏️</button>
                  <button onClick={() => remove(activeCat, idx)}    style={{ background: 'none', border: 'none', fontSize: 18, color: '#ccc',   padding: '2px 5px', lineHeight: 1 }}>×</button>
                </div>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  )
}
