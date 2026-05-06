# Sakshi's Meal Planner

Postpartum · Pure Veg · Protein-focused · Free forever  
No API key. No login. Works offline after first load.

## Deploy to Vercel (2 minutes)

### Option A — Vercel CLI (recommended)
```bash
npm install
npm run build
npx vercel --prod
```

### Option B — Vercel Dashboard (drag & drop)
1. Run `npm install && npm run build` locally
2. Go to vercel.com → New Project → drag the `dist/` folder
3. Done — get your live URL

### Option C — GitHub + Vercel (auto-deploy)
1. Push this folder to a GitHub repo
2. Go to vercel.com → Import Git Repository → select your repo
3. Framework: Vite → Deploy
4. Every push to main auto-deploys

---

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Features
- 🍽️ Today — Suggest full day meals from your library, swap any meal
- 🥦 Fridge — Tap today's veggies, get instant matched meal ideas  
- 📱 Reels — Save Instagram dish links, get reminded to make them
- 📖 My Dishes — Full editable library: 15 dishes per category pre-loaded

All data saved in browser localStorage — stays on your phone forever.
