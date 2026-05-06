import { useState } from 'react'
import { C } from './theme'
import { Card, SectionLabel, PrimaryBtn, MealCard } from './components'
import { loadMaster, loadReels, getTodayPlan, pickRandom } from './data'

const DAILY_TIPS = [
  "Drink at least 3 litres of water today. Hydration directly supports breast milk supply.",
  "Have a small handful of methi seeds soaked overnight in water — excellent for lactation.",
  "Add 1 tsp ghee to your dal or roti today. Good fats help hormone recovery.",
  "Include one serving of dahi today — probiotic support for your gut and baby's gut health.",
  "Til (sesame) laddoo or til chutney with meals — excellent calcium source for breastfeeding.",
  "Soak 5 almonds overnight, eat in the morning — helps with energy and brain recovery.",
  "Add ajwain (carom seeds) to your chapati dough — great for postpartum digestion.",
  "A small cup of warm haldi milk at night supports healing and immunity.",
]

export default function TodayTab() {
  const [master]        = useState(loadMaster)
  const [plan, setPlan] = useState(() => getTodayPlan(loadMaster()))
  const [generated, setGenerated] = useState(false)

  // Load reels fresh each render — no stale closure
  const reels = loadReels()

  const regenerate = () => {
    var newPlan = {}
    ;["breakfast","lunch","dinner"].forEach(function(cat) {
      var pool = master[cat] || []
      var picked = pickRandom(pool, 1)  // always returns array now
      newPlan[cat] = picked[0] || null
    })
    var snackPicked = pickRandom(master.snacks || [], 3)  // always returns array
    newPlan.snacks = snackPicked
    setPlan(newPlan)
    setGenerated(true)
  }

  const swapMeal = (cat, dishName) => {
    var found = (master[cat] || []).find(function(d) { return d.name === dishName })
    if (found) setPlan(function(p) { return Object.assign({}, p, { [cat]: found }) })
  }

  var totalProtein = (plan.breakfast ? plan.breakfast.protein : 0)
                   + (plan.lunch    ? plan.lunch.protein    : 0)
                   + (plan.dinner   ? plan.dinner.protein   : 0)

  var todayTip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length]

  // pickRandom always returns array — safe to slice
  var reelReminders = reels.length > 0 ? pickRandom(reels, 2) : []

  return (
    <div style={{ padding: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        {[['~' + totalProtein + 'g', 'Meals protein'], ['~1800', 'kcal target'], ['<20 min', 'All meals']].map(function(item) {
          return (
            <Card key={item[1]} style={{ textAlign: 'center', padding: '0.75rem' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.green }}>{item[0]}</div>
              <div style={{ fontSize: 11, color: C.label, marginTop: 2 }}>{item[1]}</div>
            </Card>
          )
        })}
      </div>

      <PrimaryBtn onClick={regenerate}>🎲 Suggest today's meals</PrimaryBtn>

      {generated && (
        <div className="fade-up">
          <SectionLabel>
            Today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </SectionLabel>

          {['breakfast','lunch','dinner'].map(function(cat) {
            return (
              <MealCard
                key={cat}
                meal={plan[cat]}
                category={cat.charAt(0).toUpperCase() + cat.slice(1)}
                onSwap={function(n) { swapMeal(cat, n) }}
                master={master}
              />
            )
          })}

          {plan.snacks && plan.snacks.length > 0 && (
            <>
              <SectionLabel style={{ marginTop: 6 }}>Snack ideas</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
                {plan.snacks.map(function(s) {
                  return (
                    <span key={s.name} style={{ fontSize: 12, padding: '5px 11px', background: C.amberBg, color: C.amber, borderRadius: 14, border: '1px solid ' + C.amberBorder }}>
                      {s.name}
                    </span>
                  )
                })}
              </div>
            </>
          )}

          {reelReminders.length > 0 && (
            <Card style={{ background: C.purpleBg, border: '1px solid ' + C.purpleBorder, marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 8 }}>📱 From your saved reels — try soon!</p>
              {reelReminders.map(function(r) {
                return (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.name}</span>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.blue, fontWeight: 500 }}>Watch</a>
                    ) : null}
                  </div>
                )
              })}
            </Card>
          )}

          <Card style={{ background: C.greenLight, border: '1px solid ' + C.greenBorder }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 4 }}>🌿 Postpartum tip for today</p>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{todayTip}</p>
          </Card>
        </div>
      )}

      {!generated && (
        <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem', border: '1px dashed ' + C.border, background: 'transparent' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🍽️</div>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>What should I eat today?</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Tap the button above to get meal suggestions from your dish library.</p>
        </Card>
      )}
    </div>
  )
}
