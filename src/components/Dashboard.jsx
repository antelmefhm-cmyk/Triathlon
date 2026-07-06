import CountdownHero from './CountdownHero.jsx';
import { CURRENT_PACES, startOfWeek, formatSecondsAsClock } from '../lib/raceplan.js';

const DISCIPLINE_COLOR = { swim: 'var(--swim)', bike: 'var(--bike)', run: 'var(--run)' };

function bestByDiscipline(activities) {
  const bests = {};
  for (const a of activities) {
    if (!a.distance || !a.durationSec) continue;
    if (a.discipline === 'swim') {
      const pace = a.durationSec / (a.distance / 100); // sec per 100yd, lower = better
      if (!bests.swim || pace < bests.swim.value) bests.swim = { value: pace, kind: 'pace100yd' };
    } else if (a.discipline === 'bike') {
      const mph = a.distance / (a.durationSec / 3600); // higher = better
      if (!bests.bike || mph > bests.bike.value) bests.bike = { value: mph, kind: 'mph' };
    } else if (a.discipline === 'run') {
      const pace = a.durationSec / a.distance; // sec per mile, lower = better
      if (!bests.run || pace < bests.run.value) bests.run = { value: pace, kind: 'paceMile' };
    }
  }
  return bests;
}

function formatBest(best) {
  if (!best) return null;
  if (best.kind === 'mph') return `${best.value.toFixed(1)} mph`;
  if (best.kind === 'pace100yd') return `${formatSecondsAsClock(best.value)} / 100yd`;
  if (best.kind === 'paceMile') return `${formatSecondsAsClock(best.value)} / mi`;
  return null;
}

export default function Dashboard({ activities }) {
  const weekStart = startOfWeek(new Date());
  const thisWeek = activities.filter((a) => new Date(a.date) >= weekStart);

  const weekMinutesByDiscipline = { swim: 0, bike: 0, run: 0 };
  for (const a of thisWeek) {
    const mins = (a.durationSec || 0) / 60;
    if (a.discipline === 'brick') {
      weekMinutesByDiscipline.bike += mins / 2;
      weekMinutesByDiscipline.run += mins / 2;
    } else if (weekMinutesByDiscipline[a.discipline] !== undefined) {
      weekMinutesByDiscipline[a.discipline] += mins;
    }
  }

  const bests = bestByDiscipline(activities);

  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const bikeIntervals = activities
    .filter((a) => a.discipline === 'bike' && a.sessionType === 'Intervals' && new Date(a.date) >= fourWeeksAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="screen">
      <CountdownHero weekMinutesByDiscipline={weekMinutesByDiscipline} />

      <p className="eyebrow">This week</p>
      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          {thisWeek.length === 0
            ? 'Nothing logged yet this week.'
            : `${thisWeek.length} session${thisWeek.length === 1 ? '' : 's'} logged.`}
        </p>
      </div>

      <p className="eyebrow">Personal bests</p>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {['swim', 'bike', 'run'].map((disc) => (
          <div key={disc} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: DISCIPLINE_COLOR[disc], textTransform: 'capitalize' }}>{disc}</span>
            <span className="tabular" style={{ color: bests[disc] ? 'var(--mist)' : 'var(--slate)' }}>
              {formatBest(bests[disc]) || 'No data yet'}
            </span>
          </div>
        ))}
      </div>

      <p className="eyebrow">Bike intervals — last 4 weeks</p>
      <div className="card">
        {bikeIntervals.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)' }}>
            No interval sessions logged yet. Tag a bike session as "Intervals" in the Log tab to start tracking this.
          </p>
        ) : (
          <>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--slate)' }}>
              {bikeIntervals.length} session{bikeIntervals.length === 1 ? '' : 's'} logged
            </p>
            {bikeIntervals.map((a) => {
              const mph = a.distance && a.durationSec ? a.distance / (a.durationSec / 3600) : null;
              return (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--slate)' }}>
                    {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="tabular">{mph ? `${mph.toFixed(1)} mph` : '—'}</span>
                </div>
              );
            })}
            <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--slate)' }}>
              Training pace reference: {CURRENT_PACES.bikeMph.toFixed(1)} mph
            </p>
          </>
        )}
      </div>
    </div>
  );
}
