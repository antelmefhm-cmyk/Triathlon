import CountdownHero from './CountdownHero.jsx';

const DISCIPLINE_COLOR = { swim: 'var(--swim)', bike: 'var(--bike)', run: 'var(--run)' };

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function bestByDiscipline(activities) {
  const bests = {};
  for (const a of activities) {
    if (!a.distanceKm || !a.durationSec) continue;
    const speed = a.distanceKm / (a.durationSec / 3600); // kph, higher = better
    if (!bests[a.discipline] || speed > bests[a.discipline].speed) {
      bests[a.discipline] = { speed, activity: a };
    }
  }
  return bests;
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
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['swim', 'bike', 'run'].map((disc) => (
          <div key={disc} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: DISCIPLINE_COLOR[disc], textTransform: 'capitalize' }}>{disc}</span>
            <span className="tabular" style={{ color: bests[disc] ? 'var(--mist)' : 'var(--slate)' }}>
              {bests[disc] ? `${bests[disc].speed.toFixed(1)} km/h` : 'No data yet'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
