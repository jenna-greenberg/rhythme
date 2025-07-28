import React, { useState, useEffect } from 'react';

const DEFAULT_SECTIONS = ['calendar', 'todos', 'reminders', 'goals', 'productivity'];
const TEMPLATES = {
  'Student': ['calendar', 'todos', 'reminders', 'goals', 'homework'],
  'Parent of 2': ['calendar', 'todos', 'reminders', 'kidsSchedule1', 'kidsSchedule2', 'goals'],
  'Minimal': ['calendar', 'todos'],
};

const LayoutCustomizer = ({ onChangeLayout }) => {
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('rhythmeLayout');
    return saved ? JSON.parse(saved) : DEFAULT_SECTIONS;
  });

  const [customMode, setCustomMode] = useState(false);
  const [newSection, setNewSection] = useState('');

  const updateLayout = (updated) => {
    setSections(updated);
    localStorage.setItem('rhythmeLayout', JSON.stringify(updated));
    onChangeLayout(updated);
  };

  const toggleSection = (section) => {
    const updated = sections.includes(section)
      ? sections.filter(s => s !== section)
      : [...sections, section];
    updateLayout(updated);
  };

  const applyTemplate = (templateName) => {
    const template = TEMPLATES[templateName];
    updateLayout(template);
    setCustomMode(false);
  };

  const handleAddSection = () => {
    if (!newSection.trim()) return;
    updateLayout([...sections, newSection.trim()]);
    setNewSection('');
  };

  return (
    <div>
      <h3>🎛 Layout Customizer</h3>

      <label>
        <strong>Choose a template:</strong>
        <select onChange={e => applyTemplate(e.target.value)}>
          <option disabled selected>-- Select Template --</option>
          {Object.keys(TEMPLATES).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <hr />

      <label>
        <input
          type="checkbox"
          checked={customMode}
          onChange={() => setCustomMode(!customMode)}
        />
        Enable Custom Mode
      </label>

      {customMode && (
        <div>
          <h4>Active Sections:</h4>
          <ul>
            {sections.map((s, i) => (
              <li key={i}>
                {s} <button onClick={() => toggleSection(s)}>Remove</button>
              </li>
            ))}
          </ul>

          <input
            placeholder="Add custom section"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
          />
          <button onClick={handleAddSection}>Add</button>
        </div>
      )}
    </div>
  );
};

export default LayoutCustomizer;