import { useState, useEffect } from 'react';
import { getTargetSplits, saveTargetSplits } from '../lib/storage.js';
import {
  BASELINE,
  CURRENT_PACES,
  baselineTotalSeconds,
  formatSecondsAsClock,
  daysUntilRace,
  trainingPhase,
  swimPacePer100ydFromSeconds,
  bikeMphFromSeconds,
  runPacePerMileFromSeconds,
} from '../lib/raceplan.js';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--ink)',
  border: '1px solid var(--ink-border)',
  borderRadius: 8,
  color: 'var(--mist)',
  fontSize: 15,
};

function clockToSeconds(h, m, s) {
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

function secondsToHMS(totalSec) {
  const s = Math.round(totalSec || 0);
  return {
    h: Math.floor(s / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function Plan() {
  const [swim, setSwim] = useState(secondsToHMS(BASELINE.swimSec));
  const [bike, setBike] = useState(secondsToHMS(BASELINE.bikeSec));
  const [run, setRun] = useState(secondsToHMS(BASELINE.runSec));

  useEffect(() => {
    const saved = getTargetSplits();
    if (saved) {
      if (saved.swimSec != null) setSwim(secondsToHMS(saved.swimSec));
      if (saved.bikeSec != null) setBike(secondsToHMS(saved.bikeSec));
      if (saved.runSec != null) setRun(secondsToHMS(saved.runSec));
    }
  }, []);

  const swimSec = clockToSeconds(swim.h, swim.m, swim.s);
  const bikeSec = clockToSeconds(bike.h, bike.m, bike.s);
  const runSec = clockToSeconds(run.h, run.m, run.s);
  const targetTotal = swimSec + BASELINE.t1Sec + bikeSec + BASELINE.t2Sec + runSec;
  const baselineTotal = baselineTotalSeconds();
  const deltaSec = targetTotal - baselineTotal;

  function handleSave() {
    saveTargetSplits({ swimSec, bikeSec, runSec });
  }

  const days = daysUntilRace();
  const weeksLeft = Math.max(Math.ceil(days / 7), 0);

  return (
    <div className="screen">
      <p className="eyebrow">Last half-Ironman</p>
      <div className="card" style={{ marginBottom: 20 }}>
        <BaselineRow color="var(--swim)" label="Swim" value={formatSecondsAsClock(BASELINE.swimSec)} />
        <BaselineRow color="var(--bike)" label="Bike" value={formatSecondsAsClock(BASELINE.bikeSec)} />
        <BaselineRow color="var(--run)" label="Run" value={formatSecondsAsClock(BASELINE.runSec)} />
        <div style={{ borderTop: '1px solid var(--ink-border)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--slate)' }}>Total</span>
          <span className="tabular" style={{ fontSize: 15, fontWeight: 600 }}>{formatSecondsAsClock(baselineTotal)}</span>
        </div>
      </div>

      <p className="eyebrow">Target splits</p>
      <div className="card" style={{ marginBottom: 12 }}>
        <ClockField label="Swim (2112yd)" color="var(--swim)" value={swim} onChange={setSwim} />
        <p className="tabular" style={{ fontSize: 12, color: 'var(--slate)', margin: '-6px 0 14px' }}>
          {swimSec ? `${formatSecondsAsClock(swimPacePer100ydFromSeconds(swimSec))} / 100yd` : ''}
        </p>

        <ClockField label="Bike (56mi)" color="var(--bike)" value={bike} onChange={setBike} />
        <p className="tabular" style={{ fontSize: 12, color: 'var(--slate)', margin: '-6px 0 14px' }}>
          {bikeSec ? `${bikeMphFromSeconds(bikeSec).toFixed(1)} mph` : ''}
        </p>

        <ClockField label="Run (13.1mi)" color="var(--run)" value={run} onChange={setRun} />
        <p className="tabular" style={{ fontSize: 12, color: 'var(--slate)', margin: '-6px 0 4px' }}>
          {runSec ? `${formatSecondsAsClock(runPacePerMileFromSeconds(runSec))} / mi` : ''}
        </p>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            marginTop: 14,
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
          Save targets
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--slate)' }}>Projected total</span>
          <span className="tabular" style={{ fontSize: 18, fontWeight: 600 }}>{formatSecondsAsClock(targetTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--slate)' }}>vs last time</span>
          <span
            className="tabular"
            style={{ fontSize: 13, color: deltaSec < 0 ? '#4CAF7A' : deltaSec > 0 ? 'var(--run)' : 'var(--slate)' }}
          >
            {deltaSec === 0 ? 'even' : `${deltaSec < 0 ? '−' : '+'}${formatSecondsAsClock(Math.abs(deltaSec))}`}
          </span>
        </div>
      </div>

      <p className="eyebrow">Current training paces</p>
      <div className="card" style={{ marginBottom: 20, fontSize: 13, color: 'var(--slate)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span>Swim: {formatSecondsAsClock(CURRENT_PACES.swimPer100ydSec)} / 100yd</span>
        <span>Bike: {CURRENT_PACES.bikeMph.toFixed(1)} mph typical training pace — last race was ridden at {bikeMphFromSeconds(BASELINE.bikeSec).toFixed(1)} mph, so race effort is already above this</span>
        <span>Run easy pace: {formatSecondsAsClock(CURRENT_PACES.runEasyPerMileSec)} / mi · recent 5K pace: {formatSecondsAsClock(CURRENT_PACES.run5kPerMileSec)} / mi</span>
      </div>

      <p className="eyebrow">Countdown</p>
      <div className="card">
        <p style={{ margin: 0, fontSize: 14 }}>
          {weeksLeft} week{weeksLeft === 1 ? '' : 's'} out — currently in the{' '}
          <strong style={{ color: 'var(--mist)' }}>{trainingPhase()}</strong> phase.
        </p>
      </div>
    </div>
  );
}

function BaselineRow({ color, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 14, color }}>{label}</span>
      <span className="tabular" style={{ fontSize: 14 }}>{value}</span>
    </div>
  );
}

function ClockField({ label, color, value, onChange }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ display: 'block', fontSize: 12, color, marginBottom: 4 }}>{label}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={inputStyle}
          inputMode="numeric"
          placeholder="hh"
          value={value.h || ''}
          onChange={(e) => onChange({ ...value, h: e.target.value })}
        />
        <input
          style={inputStyle}
          inputMode="numeric"
          placeholder="mm"
          value={value.m || ''}
          onChange={(e) => onChange({ ...value, m: e.target.value })}
        />
        <input
          style={inputStyle}
          inputMode="numeric"
          placeholder="ss"
          value={value.s || ''}
          onChange={(e) => onChange({ ...value, s: e.target.value })}
        />
      </div>
    </div>
  );
}
