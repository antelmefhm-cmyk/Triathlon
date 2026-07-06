// Standard half-distance triathlon splits, imperial units.
export const SWIM_YD = 2112; // 1.2 miles
export const BIKE_MI = 56;
export const RUN_MI = 13.1;

export const RACE_DATE = new Date('2026-09-13T07:00:00');

// Last half-Ironman result, used as the baseline for target-setting.
export const BASELINE = {
  swimSec: 33 * 60 + 31,
  t1Sec: 187,
  bikeSec: 3 * 3600,
  t2Sec: 188,
  runSec: 107 * 60 + 14,
};

// Recent standalone training/race paces, for reference alongside targets.
export const CURRENT_PACES = {
  swimPer100ydSec: 1 * 60 + 43, // 1:43/100yd
  bikeMph: 17,
  runEasyPerMileSec: 7 * 60 + 50, // 7:50/mile
  run5kPerMileSec: (21 * 60 + 30) / (5 / 1.60934), // 21:30 for 5km, converted to per-mile
};

export function baselineTotalSeconds() {
  return BASELINE.swimSec + BASELINE.t1Sec + BASELINE.bikeSec + BASELINE.t2Sec + BASELINE.runSec;
}

export function daysUntilRace(from = new Date()) {
  const ms = RACE_DATE.setHours(0, 0, 0, 0) - new Date(from).setHours(0, 0, 0, 0);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function trainingPhase(from = new Date()) {
  const days = daysUntilRace(from);
  if (days <= 0) return 'Race day';
  if (days <= 14) return 'Taper';
  if (days <= 42) return 'Peak';
  if (days <= 84) return 'Build';
  return 'Base';
}

export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function swimPacePer100ydFromSeconds(swimSec) {
  return swimSec / (SWIM_YD / 100);
}

export function bikeMphFromSeconds(bikeSec) {
  return BIKE_MI / (bikeSec / 3600);
}

export function runPacePerMileFromSeconds(runSec) {
  return runSec / RUN_MI;
}

export function bikeSecondsFromMph(mph) {
  return (BIKE_MI / mph) * 3600;
}

export function runSecondsFromPacePerMile(pacePerMileSec) {
  return pacePerMileSec * RUN_MI;
}

export function swimSecondsFromPacePer100yd(pacePer100ydSec) {
  return pacePer100ydSec * (SWIM_YD / 100);
}

export function formatSecondsAsClock(totalSeconds) {
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${m}:${String(sec).padStart(2, '0')}`;
}
