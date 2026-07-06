import { daysUntilRace, trainingPhase, RACE_DATE } from '../lib/raceplan.js';

const RACE_DATE_LABEL = RACE_DATE.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function CountdownHero({ weekMinutesByDiscipline }) {
  const days = daysUntilRace();
  const phase = trainingPhase();

  const swim = weekMinutesByDiscipline.swim || 0;
  const bike = weekMinutesByDiscipline.bike || 0;
  const run = weekMinutesByDiscipline.run || 0;
  const total = swim + bike + run;

  const swimPct = total ? (swim / total) * 100 : 33.3;
  const bikePct = total ? (bike / total) * 100 : 33.3;
  const runPct = total ? (run / total) * 100 : 33.4;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <p className="eyebrow">{days > 0 ? `${phase} phase` : 'Race week'}</p>
      <div
        className="tabular"
        style={{ fontSize: 56, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        {Math.max(days, 0)}
        <span style={{ fontSize: 18, color: 'var(--slate)', marginLeft: 8, fontWeight: 400 }}>
          {days === 1 ? 'day' : 'days'}
        </span>
      </div>
      <p style={{ margin: '4px 0 16px', fontSize: 13, color: 'var(--slate)' }}>
        to the half — {RACE_DATE_LABEL}
      </p>

      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${swimPct}%`, background: 'var(--swim)' }} />
        <div style={{ width: `${bikePct}%`, background: 'var(--bike)' }} />
        <div style={{ width: `${runPct}%`, background: 'var(--run)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--slate)' }}>
        <span style={{ color: 'var(--swim)' }}>Swim {Math.round(swim)}m</span>
        <span style={{ color: 'var(--bike)' }}>Bike {Math.round(bike)}m</span>
        <span style={{ color: 'var(--run)' }}>Run {Math.round(run)}m</span>
      </div>
    </div>
  );
}
