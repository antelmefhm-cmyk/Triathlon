# Half Distance — Tri Training Tracker

A scaffold for a half-Ironman training tracker: manual session logging (swim/bike/run/brick), a race countdown, personal bests, and a goal-time split calculator.

## Run it locally

```bash
npm install
npm run dev
```

## Deploy (same flow as Tennis Career)

1. Push this folder to a new GitHub repo.
2. Import the repo in Vercel — it auto-detects Vite, no config needed.
3. Once deployed, open the URL on her phone and use "Add to Home Screen" — it'll behave like a standalone app.

## What's built

- **Dashboard** — race countdown, this week's training volume by discipline, personal bests
- **Log** — quick entry per discipline with auto-calculated pace, optional HR/notes
- **History** — full activity list, deletable
- **Plan** — goal finish-time split calculator, current training phase (Base/Build/Peak/Taper)

## Data

Everything is stored in `localStorage` on the device — no backend, no account. Data is per-browser, so it won't sync across devices unless you add a backend later.

## Race date

Currently hardcoded to **13 September 2026** in `src/lib/raceplan.js` (`RACE_DATE`). Change that constant if the date shifts.

## Next steps to consider

- Weekly plan generator that turns the goal-time splits into suggested weekly sessions
- Segment/route tracking for repeated loops
- Gear tracking (shoe mileage, bike component wear)
- Export/backup of localStorage data (currently no way to move data off-device)
