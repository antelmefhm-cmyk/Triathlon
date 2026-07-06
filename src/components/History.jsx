import { deleteActivity } from '../lib/storage.js';
import { formatSecondsAsClock } from '../lib/raceplan.js';

const DISCIPLINE_COLOR = { swim: 'var(--swim)', bike: 'var(--bike)', run: 'var(--run)', brick: 'var(--mist)' };

export default function History({ activities, onChanged }) {
  function handleDelete(id) {
    deleteActivity(id);
    onChanged?.();
  }

  return (
    <div className="screen">
      <p className="eyebrow">History</p>

      {activities.length === 0 && (
        <div className="card">
          <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)' }}>
            No sessions logged yet — head to the Log tab after your next swim, bike, or run.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {activities.map((a) => (
          <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: DISCIPLINE_COLOR[a.discipline], fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
                {a.discipline}
              </span>
              {a.sessionType && a.sessionType !== 'Endurance' && (
                <span style={{ fontSize: 11, color: 'var(--slate)', marginLeft: 8 }}>{a.sessionType}</span>
              )}
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--slate)' }}>
                {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {a.distance ? ` · ${a.distance} ${a.distanceUnit || (a.discipline === 'swim' ? 'yd' : 'mi')}` : ''}
              </p>
              {a.intervalStructure && <p style={{ margin: '4px 0 0', fontSize: 13 }}>{a.intervalStructure}</p>}
              {a.notes && <p style={{ margin: '4px 0 0', fontSize: 13 }}>{a.notes}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="tabular" style={{ margin: 0, fontSize: 15 }}>
                {formatSecondsAsClock(a.durationSec)}
              </p>
              <button
                onClick={() => handleDelete(a.id)}
                style={{ background: 'none', border: 'none', color: 'var(--slate)', fontSize: 11, cursor: 'pointer', padding: 0, marginTop: 4 }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
