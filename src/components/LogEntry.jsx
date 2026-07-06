import { useState } from 'react';
import { saveActivity } from '../lib/storage.js';

const DISCIPLINES = [
  { id: 'swim', label: 'Swim', color: 'var(--swim)' },
  { id: 'bike', label: 'Bike', color: 'var(--bike)' },
  { id: 'run', label: 'Run', color: 'var(--run)' },
  { id: 'brick', label: 'Brick', color: 'var(--mist)' },
];

const SESSION_TYPES = ['Endurance', 'Tempo', 'Intervals', 'Recovery', 'Race pace'];

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--ink)',
  border: '1px solid var(--ink-border)',
  borderRadius: 8,
  color: 'var(--mist)',
  fontSize: 15,
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <span style={{ display: 'block', fontSize: 12, color: 'var(--slate)', marginBottom: 4 }}>{label}</span>
      {children}
    </label>
  );
}

export default function LogEntry({ onSaved }) {
  const [discipline, setDiscipline] = useState('run');
  const [sessionType, setSessionType] = useState('Endurance');
  const [intervalStructure, setIntervalStructure] = useState('');
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [avgHr, setAvgHr] = useState('');
  const [notes, setNotes] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const durationSec =
    (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60 + (Number(seconds) || 0);

  const pace = (() => {
    if (!distance || !durationSec) return null;
    if (discipline === 'swim') {
      const per100yd = durationSec / (Number(distance) / 100);
      const m = Math.floor(per100yd / 60);
      const s = Math.round(per100yd % 60);
      return `${m}:${String(s).padStart(2, '0')} / 100yd`;
    }
    if (discipline === 'run') {
      const perMile = durationSec / Number(distance);
      const m = Math.floor(perMile / 60);
      const s = Math.round(perMile % 60);
      return `${m}:${String(s).padStart(2, '0')} / mi`;
    }
    if (discipline === 'bike') {
      const mph = Number(distance) / (durationSec / 3600);
      return `${mph.toFixed(1)} mph`;
    }
    return null;
  })();

  function reset() {
    setDistance('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setAvgHr('');
    setNotes('');
    setIntervalStructure('');
  }

  function handleSave() {
    if (!durationSec) return;
    saveActivity({
      discipline,
      sessionType,
      intervalStructure: sessionType === 'Intervals' && intervalStructure ? intervalStructure : null,
      distance: distance ? Number(distance) : null,
      distanceUnit: discipline === 'swim' ? 'yd' : 'mi',
      durationSec,
      avgHr: avgHr ? Number(avgHr) : null,
      notes: notes || null,
      date: new Date().toISOString(),
    });
    setSavedFlash(true);
    reset();
    onSaved?.();
    setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <div className="screen">
      <p className="eyebrow">Log a session</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {DISCIPLINES.map((d) => (
          <button
            key={d.id}
            onClick={() => setDiscipline(d.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 8,
              border: `1px solid ${discipline === d.id ? d.color : 'var(--ink-border)'}`,
              background: discipline === d.id ? 'var(--ink-raised)' : 'transparent',
              color: discipline === d.id ? d.color : 'var(--slate)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="card">
        <Field label={discipline === 'swim' ? 'Distance (yards)' : discipline === 'brick' ? 'Total distance (miles, optional)' : 'Distance (miles)'}>
          <input
            style={inputStyle}
            inputMode="decimal"
            placeholder={discipline === 'swim' ? 'e.g. 1650' : 'e.g. 4.0'}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </Field>

        <Field label="Duration">
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={inputStyle} inputMode="numeric" placeholder="hh" value={hours} onChange={(e) => setHours(e.target.value)} />
            <input style={inputStyle} inputMode="numeric" placeholder="mm" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            <input style={inputStyle} inputMode="numeric" placeholder="ss" value={seconds} onChange={(e) => setSeconds(e.target.value)} />
          </div>
        </Field>

        {pace && (
          <p className="tabular" style={{ fontSize: 13, color: 'var(--slate)', margin: '0 0 12px' }}>
            {pace}
          </p>
        )}

        <Field label="Session type">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SESSION_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSessionType(type)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: `1px solid ${sessionType === type ? 'var(--mist)' : 'var(--ink-border)'}`,
                  background: sessionType === type ? 'var(--ink)' : 'transparent',
                  color: sessionType === type ? 'var(--mist)' : 'var(--slate)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </Field>

        {sessionType === 'Intervals' && (
          <Field label="Interval structure (optional)">
            <input
              style={inputStyle}
              placeholder="e.g. 6 x 5min @ 32km/h, 3min easy"
              value={intervalStructure}
              onChange={(e) => setIntervalStructure(e.target.value)}
            />
          </Field>
        )}

        <button
          onClick={() => setShowMore((s) => !s)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--slate)',
            fontSize: 12,
            padding: 0,
            marginBottom: showMore ? 12 : 4,
            cursor: 'pointer',
          }}
        >
          {showMore ? '– Less detail' : '+ Add more detail'}
        </button>

        {showMore && (
          <>
            <Field label="Average heart rate (bpm)">
              <input style={inputStyle} inputMode="numeric" value={avgHr} onChange={(e) => setAvgHr(e.target.value)} />
            </Field>
            <Field label="Notes">
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={!durationSec}
          style={{
            width: '100%',
            marginTop: 8,
            padding: '14px 0',
            borderRadius: 8,
            border: 'none',
            background: durationSec ? 'var(--mist)' : 'var(--ink-border)',
            color: durationSec ? 'var(--ink)' : 'var(--slate)',
            fontWeight: 600,
            fontSize: 14,
            cursor: durationSec ? 'pointer' : 'not-allowed',
          }}
        >
          {savedFlash ? 'Saved ✓' : 'Save session'}
        </button>
      </div>
    </div>
  );
}
