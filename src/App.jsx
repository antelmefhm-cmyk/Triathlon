import { useState, useEffect, useCallback } from 'react';
import TabNav from './components/TabNav.jsx';
import Dashboard from './components/Dashboard.jsx';
import LogEntry from './components/LogEntry.jsx';
import Sessions from './components/Sessions.jsx';
import History from './components/History.jsx';
import Plan from './components/Plan.jsx';
import { getActivities } from './lib/storage.js';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [activities, setActivities] = useState([]);

  const refresh = useCallback(() => setActivities(getActivities()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="app">
      {tab === 'dashboard' && <Dashboard activities={activities} />}
      {tab === 'log' && <LogEntry onSaved={refresh} />}
      {tab === 'sessions' && <Sessions activities={activities} />}
      {tab === 'history' && <History activities={activities} onChanged={refresh} />}
      {tab === 'plan' && <Plan />}
      <TabNav active={tab} onChange={setTab} />
    </div>
  );
}
