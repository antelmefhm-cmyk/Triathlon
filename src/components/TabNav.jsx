const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'log', label: 'Log' },
  { id: 'history', label: 'History' },
  { id: 'plan', label: 'Plan' },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: 'var(--ink-raised)',
        borderTop: '1px solid var(--ink-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              padding: '14px 0 12px',
              background: 'transparent',
              border: 'none',
              color: isActive ? 'var(--mist)' : 'var(--slate)',
              fontSize: 12,
              letterSpacing: '0.04em',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              borderTop: isActive ? '2px solid var(--mist)' : '2px solid transparent',
              marginTop: -1,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
