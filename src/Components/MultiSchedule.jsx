import React, { useEffect, useState } from 'react';

const defaultData = {
  main: [],
};

const MultiSchedule = () => {
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('rhythmeSchedules');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [activeView, setActiveView] = useState('main');
  const [form, setForm] = useState({ title: '', time: '' });
  const [overlayUsers, setOverlayUsers] = useState([]);

  const saveSchedules = (updated) => {
    setSchedules(updated);
    localStorage.setItem('rhythmeSchedules', JSON.stringify(updated));
  };

  const addEvent = () => {
    if (!form.title || !form.time) return;
    const updated = { ...schedules };
    updated[activeView] = [...(updated[activeView] || []), { ...form }];
    saveSchedules(updated);
    setForm({ title: '', time: '' });
  };

  const addNewUser = (name) => {
    const updated = { ...schedules, [name.toLowerCase()]: [] };
    saveSchedules(updated);
  };

  const allUsers = Object.keys(schedules);

  return (
    <div>
      <h3>📅 Schedule Manager</h3>

      <label>
        View schedule for:
        <select value={activeView} onChange={(e) => setActiveView(e.target.value)}>
          {allUsers.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </label>

      <div>
        <input
          placeholder="New user's name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addNewUser(e.target.value.trim());
              e.target.value = '';
            }
          }}
        />
      </div>

      <div>
        <h4>Add to {activeView}'s schedule</h4>
        <input
          placeholder="Event title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
        <button onClick={addEvent}>Add Event</button>
      </div>

      <div>
        <h4>Overlay schedules onto main:</h4>
        {allUsers
          .filter(u => u !== 'main')
          .map(user => (
            <label key={user} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={overlayUsers.includes(user)}
                onChange={() => {
                  setOverlayUsers(prev =>
                    prev.includes(user)
                      ? prev.filter(name => name !== user)
                      : [...prev, user]
                  );
                }}
              />
              {user}
            </label>
          ))}
      </div>

      <hr />
      <h4>🗓️ Your Main Schedule</h4>
      <ul>
        {(schedules.main || []).map((item, i) => (
          <li key={i}><strong>{item.time}</strong> — {item.title}</li>
        ))}
      </ul>

      {overlayUsers.map((user, index) => (
        <div key={index}>
          <h5 style={{ opacity: 0.6 }}>Ghosted: {user}</h5>
          <ul style={{ opacity: 0.6 }}>
            {(schedules[user] || []).map((item, i) => (
              <li key={i}><strong>{item.time}</strong> — {item.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MultiSchedule;