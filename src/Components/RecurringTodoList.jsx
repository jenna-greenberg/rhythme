import React, { useEffect, useState } from 'react';

const BUCKETS = ['daily', 'weekly', 'monthly', 'yearly'];

const RecurringTodoList = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('rhythmeTodos');
    return saved ? JSON.parse(saved) : initTodos();
  });

  function initTodos() {
    return BUCKETS.reduce((acc, bucket) => {
      acc[bucket] = [];
      return acc;
    }, {});
  }

  const saveTodos = (updated) => {
    setTodos(updated);
    localStorage.setItem('rhythmeTodos', JSON.stringify(updated));
  };

  const addTodo = (bucket, text, recurring = false) => {
    const updated = { ...todos };
    updated[bucket].push({ text, done: false, recurring });
    saveTodos(updated);
  };

  const toggleDone = (bucket, index) => {
    const updated = { ...todos };
    updated[bucket][index].done = !updated[bucket][index].done;
    saveTodos(updated);
  };

  const rolloverTodos = () => {
    const updated = { ...todos };
    for (const bucket of BUCKETS) {
      updated[bucket] = updated[bucket].map(todo => {
        if (todo.done && !todo.recurring) return null;
        return { ...todo, done: false };
      }).filter(Boolean);
    }
    saveTodos(updated);
  };

  // Run once per new day/week/month/year (simple daily for now)
  useEffect(() => {
    const lastCheck = localStorage.getItem('lastRollover') || '';
    const today = new Date().toLocaleDateString();
    if (lastCheck !== today) {
      rolloverTodos();
      localStorage.setItem('lastRollover', today);
    }
  }, []);

  return (
    <div>
      {BUCKETS.map(bucket => (
        <div key={bucket}>
          <h3>{bucket.toUpperCase()} To-Dos</h3>
          <ul>
            {todos[bucket].map((todo, i) => (
              <li key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => toggleDone(bucket, i)}
                  />
                  {todo.text} {todo.recurring && <em>(recurring)</em>}
                </label>
              </li>
            ))}
          </ul>
          <TodoInput onAdd={(text, recurring) => addTodo(bucket, text, recurring)} />
        </div>
      ))}
    </div>
  );
};

const TodoInput = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [recurring, setRecurring] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), recurring);
    setText('');
    setRecurring(false);
  };

  return (
    <div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New to-do"
      />
      <label>
        <input
          type="checkbox"
          checked={recurring}
          onChange={() => setRecurring(!recurring)}
        />
        Recurring
      </label>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default RecurringTodoList;
