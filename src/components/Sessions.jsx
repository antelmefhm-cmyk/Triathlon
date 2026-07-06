import { getTargetSplits } from '../lib/storage.js';
import {
  trainingPhase,
  startOfWeek,
  CURRENT_PACES,
  swimPacePer100ydFromSeconds,
  bikeMphFromSeconds,
  runPacePerMileFromSeconds,
  formatSecondsAsClock,
} from '../lib/raceplan.js';

const DISCIPLINE_COLOR = { swim: 'var(--swim)', bike: 'var(--bike)', run: 'var(--run)', brick: 'var(--mist)' };

// Weekly session mix per training phase. Bike gets extra Intervals work
// since that's the discipline being prioritized this block.
const WEEKLY_TEMPLATES = {
  Base: [
    { discipline: 'swim', sessionType: 'Endurance', count: 2, description: '30–40min continuous, easy aerobic effort' },
    { discipline: 'bike', sessionType: 'Endurance', count: 1, description: 'Long steady ride, conversational pace' },
    { discipline: 'bike', sessionType: 'Intervals', count: 1, description: 'Building tempo work, e.g. 4 x 8min moderately hard, 4min easy' },
    { discipline: 'run', sessionType: 'Endurance', count: 2, description: '30–45min easy pace' },
    { discipline: 'brick', sessionType: 'Endurance', count: 1, description: 'Short bike-to-run transition practice' },
  ],
  Build: [
    { discipline: 'swim', sessionType: 'Endurance', count: 1, description: '30–40min continuous, easy aerobic effort' },
    { discipline: 'swim', sessionType: 'Tempo', count: 1, description: 'Broken swim with sustained hard efforts, e.g. 4 x 400yd' },
    { discipline: 'bike', sessionType: 'Intervals', count: 2, description: 'Threshold intervals, e.g. 5 x 6min hard, 3min easy' },
    { discipline: 'bike', sessionType: 'Endurance', count: 1, description: 'Long ride, steady aerobic pace' },
    { discipline: 'run', sessionType: 'Tempo', count: 1, description: 'Sustained comfortably-hard effort, 20–30min' },
    { discipline: 'run', sessionType: 'Endurance', count: 1, description: '30–45min easy pace' },
    { discipline: 'brick', sessionType: 'Tempo', count: 1, description: 'Longer brick at race effort' },
  ],
  Peak: [
    { discipline: 'swim', sessionType: 'Race pace', count: 1, description: 'Race-pace intervals, e.g. 6 x 200yd' },
    { discipline: 'swim', sessionType: 'Endurance', count: 1, description: '30min continuous, easy aerobic effort' },
    { discipline: 'bike', sessionType: 'Intervals', count: 2, description: 'Threshold/race-pace intervals, e.g. 4 x 10min hard' },
    { discipline: 'bike', sessionType: 'Race pace', count: 1, description: 'Long ride with sustained race-effort blocks' },
    { discipline: 'run', sessionType: 'Race pace', count: 1, description: 'Sustained blocks at goal race pace' },
    { discipline: 'run', sessionType: 'Recovery', count: 1, description: 'Short, easy shakeout run' },
    { discipline: 'brick', sessionType: 'Race pace', count: 1, description: 'Full-length brick simulation at race effort' },
  ],
  Taper: [
    { discipline: 'swim', sessionType: 'Endurance', count: 1, description: 'Short, easy — maintain feel for the water' },
    { discipline: 'bike', sessionType: 'Intervals', count: 1, description: 'Short and sharp, e.g. 4 x 3min at race effort — not about building fitness now' },
    { discipline: 'run', sessionType: 'Race pace', count: 1, description: 'Short race-pace strides, keep legs sharp' },
    { discipline: 'brick', sessionType: 'Endurance', count: 1, description: 'Short shakeout brick' },
  ],
};

function targetNote(item, targets) {
  if (item.discipline === 'swim' && (item.sessionType === 'Intervals' || item.sessionType === 'Race pace' || item.sessionType === 'Tempo')) {
    const sec = targets?.swimSec ? swimPacePer100ydFromSeconds(targets.swimSec) : CURRENT_PACES.swimPer100ydSec;
    return `${item.description} — target ~${formatSecondsAsClock(sec)}/100yd`;
  }
  if (item.discipline === 'bike' && (item.sessionType === 'Intervals' || item.sessionType === 'Race pace')) {
    const mph = targets?.bikeSec ? bikeMphFromSeconds(targets.bikeSec) : CURRENT_PACES.bikeMph;
    return `${item.description} — target ~${mph.toFixed(1)} mph`;
  }
  if (item.discipline === 'run' && (item.sessionType === 'Tempo' || item.sessionType === 'Race pace')) {
    const sec = targets?.runSec ? runPacePerMileFromSeconds(targets.runSec) : CURRENT_PACES.runEasyPerMileSec;
    return `${item.description} — target ~${formatSecondsAsClock(sec)}/mi`;
  }
  return item.description;
}

export default function Sessions({ activities }) {
  const phase = trainingPhase();
  const template = WEEKLY_TEMPLATES[phase] || WEEKLY_TEMPLATES.Base;
  const targets = getTargetSplits();

  const weekStart = startOfWeek(new Date());
  const thisWeek = activities.filter((a) => new Date(a.date) >= weekStart);

  function countLogged(discipline, sessionType) {
    return thisWeek.filter((a) => a.discipline === discipline && (a.sessionType || 'Endurance') === sessionType).length;
  }

  const totalPlanned = template.reduce((sum, item) => sum + item.count, 0);
  const totalDone = template.reduce((sum, item) => sum + Math.min(countLogged(item.discipline, item.sessionType), item.count), 0);

  return (
    <div className="screen">
      <p className="eyebrow">{phase} phase — this week's sessions</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--slate)' }}>Sessions completed</span>
          <span className="tabular" style={{ fontSize: 15, fontWeight: 600 }}>{totalDone} / {totalPlanned}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {template.map((item, idx) => {
          const done = countLogged(item.discipline, item.sessionType);
          const complete = done >= item.count;
          return (
            <div key={idx} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: DISCIPLINE_COLOR[item.discipline], fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>
                  {item.discipline} · {item.sessionType}
                </span>
                <span className="tabular" style={{ fontSize: 13, color: complete ? '#4CAF7A' : 'var(--slate)' }}>
                  {done} / {item.count}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--slate)' }}>{targetNote(item, targets)}</p>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--slate)', marginTop: 16 }}>
        This is a rules-based weekly template driven by your training phase and focus discipline — a starting structure to adjust around life, not a rigid prescription.
      </p>
    </div>
  );
}
