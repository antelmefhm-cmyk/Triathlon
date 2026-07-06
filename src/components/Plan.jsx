import { useState, useEffect } from 'react';
import { getGoalTime, saveGoalTime } from '../lib/storage.js';
import { splitGoalTime, formatSecondsAsClock, daysUntilRace, trainingPhase } from '../lib/raceplan.js';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--ink)',
  border: '1px solid var(--ink-border)',
  borderRadius: 8,
  color: 'var(--mist)',
  fontSize: 15,
};

export default function Plan() {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    const saved = getGoalTime();
    if (saved?.totalMinutes) {
      setHours(String(Math.floor(saved.totalMinutes / 60)));
      setMinutes(String(saved.totalMinutes % 60));
    }
  }, []);

  const totalMinutes = (Number(hours) || 0) * 60 + (Number(minutes) || 0);
  const splits = totalMinutes ? splitGoalTime(totalMinutes) : null;
  const days = daysUntilRace();
  const weeksLeft = Math.max(Math.ceil(days / 7), 0);

  function handleSave() {
    if (totalMinutes) saveGoalTime(totalMinutes);
  }

  return (
    <div className="screen">
      <p className="eyebrow">Goal time</p>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <label style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--slate)', marginBottom: 4 }}>Hours</span>
            <input style={inputStyle} inputMode="numeric" value={hours} onChange={(e) => setHours(e.target.value)} />
          </label>
          <label style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--slate)', marginBottom: 4 }}>Minutes</span>
            <input style={inputStyle} inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </label>
        </div>
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            border: 'none',
            background: 'var(--mist)',
            color: 'var(--ink)',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Set goal
        </button>
      </div>

      {splits && (
        <>
          <p className="eyebrow">Target splits</p>
          <div className="card" style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SplitRow color="var(--swim)" label="Swim (1.9km)" value={formatSecondsAsClock(splits.swim.seconds)} sub={`${splits.swim.pacePer100m.toFixed(0)}s / 100m`} />
            <SplitRow color="var(--slate)" label="T1" value={formatSecondsAsClock(splits.t1.seconds)} />
            <SplitRow color="var(--bike)" label="Bike (90km)" value={formatSecondsAsClock(splits.bike.seconds)} sub={`${splits.bike.speedKph.toFixed(1)} km/h`} />
            <SplitRow color="var(--slate)" label="T2" value={formatSecondsAsClock(splits.t2.seconds)} />
            <SplitRow color="var(--run)" label="Run (21.1km)" value={formatSecondsAsClock(splits.run.seconds)} sub={`${formatSecondsAsClock(splits.run.pacePerKm)} / km`} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--slate)', marginTop: -12, marginBottom: 20 }}>
            Based on typical age-group split proportions — a starting point, not a guarantee. Course profile and conditions will shift these.
          </p>
        </>
      )}

      <p className="eyebrow">Race week countdown</p>
      <div className="card">
        <p style={{ margin: 0, fontSize: 14 }}>
          {weeksLeft} week{weeksLeft === 1 ? '' : 's'} out — currently in the{' '}
          <strong style={{ color: 'var(--mist)' }}>{trainingPhase()}</strong> phase.
        </p>
      </div>
    </div>
  );
}

function SplitRow({ color, label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 14, color }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <div className="tabular" style={{ fontSize: 15 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--slate)' }}>{sub}</div>}
      </div>
    </div>
  );
}
