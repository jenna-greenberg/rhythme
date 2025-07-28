import React from 'react';

const CalendarEvents = () => {
  const events = JSON.parse(localStorage.getItem('rhythmeEvents') || '[]');

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h3>🗓️ Today’s Events</h3>
      {events.filter(e => e.date === today).length === 0 ? (
        <p>No events today</p>
      ) : (
        <ul>
          {events
            .filter((e) => e.date === today)
            .map((e, i) => (
              <li key={i}>
                <strong>{e.title}</strong>: {e.description}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarEvents;