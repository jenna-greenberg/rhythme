import React, { useState, useEffect } from 'react';

const EventsModal = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('rhythmeEvents');
    return stored ? JSON.parse(stored) : [];
  });

  const [form, setForm] = useState({
    title: '',
    date: '',
    description: '',
  });

  const saveEvents = (updated) => {
    setEvents(updated);
    localStorage.setItem('rhythmeEvents', JSON.stringify(updated));
  };

  const addEvent = () => {
    if (!form.title || !form.date) return;
    const updated = [...events, { ...form }];
    saveEvents(updated);
    setForm({ title: '', date: '', description: '' });
  };

  const deleteEvent = (index) => {
    const updated = events.filter((_, i) => i !== index);
    saveEvents(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>📅 Add an Event</h2>
      <div>
        <input
          type="text"
          placeholder="Title (e.g. Mom’s Birthday)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <textarea
          placeholder="Optional description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button onClick={addEvent}>Add Event</button>
        <button onClick={onClose}>Close</button>
      </div>

      <h3>Upcoming Events</h3>
      <ul>
        {events
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((event, i) => (
            <li key={i}>
              <strong>{event.title}</strong> — {event.date}
              <br />
              <em>{event.description}</em>
              <button onClick={() => deleteEvent(i)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EventsModal;