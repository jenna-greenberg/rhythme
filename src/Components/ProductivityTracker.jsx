import React, { useEffect, useState } from 'react';

const ProductivityTracker = () => {
  const [stats, setStats] = useState(() => {
    const stored = localStorage.getItem('rhythmeStats');
    return stored ? JSON.parse(stored) : initStats();
  });

  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem('rhythmeTodos');
    return stored ? JSON.parse(stored) : null;
  });

  const [goals, setGoals] = useState(() => {
    const stored = localStorage.getItem('rhythmeGoals');
    return stored ? JSON.parse(stored) : [];
  });

  const todayKey = new Date().toLocaleDateString();

  function initStats() {
    return {
      completionLog: {},
      recurringStreak: 0,
      weeklyGoalCount: 0,
    };
  }

  const updateStats = () => {
    if (!todos) return;

    const completedToday = Object.values(todos).flat().filter(t => t.done).length;
    const recurringCompleted = Object.values(todos)
      .flat()
      .filter(t => t.recurring && t.done).length;

    const updatedStats = { ...stats };

    // Update completion log
    updatedStats.completionLog[todayKey] = completedToday;

    // Streak logic (increase if recurring done today, reset if 0)
    if (recurringCompleted > 0) {
      updatedStats.recurringStreak += 1;
    } else {
      updatedStats.recurringStreak = 0;
    }

    // Weekly goals
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    });

    updatedStats.weeklyGoalCount = last7Days.reduce((acc, dateKey) => {
      return acc + (updatedStats.completionLog[dateKey] || 0);
    }, 0);

    setStats(updatedStats);
    localStorage.setItem('rhythmeStats', JSON.stringify(updatedStats));
  };

  useEffect(() => {
    updateStats();
  }, [todos]);

  return (
    <div>
      <h3>📈 Productivity Tracker</h3>
      <p><strong>To-dos completed today:</strong> {stats.completionLog[todayKey] || 0}</p>
      <p><strong>Recurring task streak:</strong> {stats.recurringStreak} day(s)</p>
      <p><strong>Goals hit this week:</strong> {stats.weeklyGoalCount}</p>
      <p><em>*More features like schedule consistency coming soon</em></p>
    </div>
  );
};

export default ProductivityTracker;