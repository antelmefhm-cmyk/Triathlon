// Standard half-distance triathlon splits
export const SWIM_KM = 1.9;
export const BIKE_KM = 90;
export const RUN_KM = 21.1;

export const RACE_DATE = new Date('2026-09-13T07:00:00');

// Rough benchmark proportions of total finish time for an age-group
// half-Ironman split. These are starting points for a plan, not
// guarantees — conditions, course profile, and pacing strategy shift
// them in practice.
const SPLIT_SHARE = {
  swim: 0.06,
  t1: 0.015,
  bike: 0.535,
  t2: 0.015,
  run: 0.375,
};

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

export function splitGoalTime(totalMinutes) {
  const totalSeconds = totalMinutes * 60;
  const swimSec = totalSeconds * SPLIT_SHARE.swim;
  const t1Sec = totalSeconds * SPLIT_SHARE.t1;
  const bikeSec = totalSeconds * SPLIT_SHARE.bike;
  const t2Sec = totalSeconds * SPLIT_SHARE.t2;
  const runSec = totalSeconds * SPLIT_SHARE.run;

  return {
    swim: {
      seconds: swimSec,
      pacePer100m: (swimSec / (SWIM_KM * 10)),
    },
    t1: { seconds: t1Sec },
    bike: {
      seconds: bikeSec,
      speedKph: BIKE_KM / (bikeSec / 3600),
    },
    t2: { seconds: t2Sec },
    run: {
      seconds: runSec,
      pacePerKm: runSec / RUN_KM,
    },
  };
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
