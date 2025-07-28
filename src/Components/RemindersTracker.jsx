import React, { useEffect, useState } from 'react';

const RemindersTracker = () => {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('rhythmeReminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    text: '',
    time: '',
    date: '',
  });

  const saveReminders = (updated) => {
    setReminders(updated);
    localStorage.setItem('rhythmeReminders', JSON.stringify(updated));
  };

  const addReminder = () => {
    if (!form.text || (!form.date && !form.time)) return;
    const updated = [...reminders, { ...form }];
    saveReminders(updated);
    setForm({ text: '', time: '', date: '' });
  };

  const deleteReminder = (index) => {
    const updated = reminders.filter((_, i) => i !== index);
    saveReminders(updated);
  };

  const today = new Date().toISOString().split('T')[0];

  const todayReminders = reminders.filter((reminder) => {
    return !reminder.date || reminder.date === today;
  });

  return (
    <div>
      <h3>⏰ Reminders</h3>

      {todayReminders.length === 0 ? (
        <p>No daily reminders 🎉</p>
      ) : (
        <ul>
          {todayReminders.map((r, i) => (
            <li key={i}>
              <strong>{r.text}</strong>
              {r.time && ` @ ${r.time}`}
              <button onClick={() => deleteReminder(i)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <input
          placeholder="Reminder text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button onClick={addReminder}>Add Reminder</button>
      </div>
    </div>
  );
};

export default RemindersTracker;