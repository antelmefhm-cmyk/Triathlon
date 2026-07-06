const ACTIVITIES_KEY = 'half-distance-activities-v1';
const PLAN_KEY = 'half-distance-plan-v1';

export function getActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveActivity(activity) {
  const all = getActivities();
  const withId = { ...activity, id: crypto.randomUUID() };
  const updated = [withId, ...all];
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  return withId;
}

export function deleteActivity(id) {
  const updated = getActivities().filter((a) => a.id !== id);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
}

export function getGoalTime() {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGoalTime(totalMinutes) {
  localStorage.setItem(PLAN_KEY, JSON.stringify({ totalMinutes }));
}
