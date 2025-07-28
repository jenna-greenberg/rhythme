import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BarChart3, Clock, Layout, Bell, Plus, X } from 'lucide-react';

// TodoSection component
const TodoSection = ({ 
  title, 
  todos, 
  type, 
  newTodoInputs, 
  setNewTodoInputs, 
  addTodo, 
  toggleTodo, 
  removeTodo,
  recurringTodos,
  newRecurringInputs,
  setNewRecurringInputs,
  addRecurringTodo,
  removeRecurringTodo,
  recurringCompletionState,
  toggleRecurringTodo
}) => {
  const hasRecurring = ['day', 'week', 'month', 'year'].includes(type);
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      height: '360px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        <h3 style={{ 
          fontWeight: 'bold', 
          color: '#374151', 
          fontSize: '14px',
          margin: 0 
        }}>{title}</h3>
      </div>
      <div style={{
        padding: '12px',
        flex: 1,
        overflowY: 'auto'
      }}>
        {/* Regular todos - sorted with completed at bottom */}
        {todos
          .sort((a, b) => a.completed - b.completed)
          .map(todo => (
          <div key={todo.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            padding: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(type, todo.id)}
                style={{ borderRadius: '4px' }}
              />
              <span style={{
                fontSize: '14px',
                color: todo.completed ? '#9ca3af' : '#374151',
                textDecoration: todo.completed ? 'line-through' : 'none',
                wordWrap: 'break-word',
                whiteSpace: 'normal'
              }}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => removeTodo(type, todo.id)}
              style={{
                color: '#ef4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Recurring todos section */}
        {hasRecurring && recurringTodos && recurringTodos[type] && recurringTodos[type].length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
              🔄 Recurring {type === 'day' ? 'Daily' : type === 'week' ? 'Weekly' : type === 'month' ? 'Monthly' : 'Yearly'}
            </div>
            {recurringTodos[type]
              .sort((a, b) => {
                const aCompleted = recurringCompletionState[`${type}-${a.id}`] || false;
                const bCompleted = recurringCompletionState[`${type}-${b.id}`] || false;
                return aCompleted - bCompleted;
              })
              .map(recurringTodo => {
              const isCompleted = recurringCompletionState[`${type}-${recurringTodo.id}`] || false;
              return (
                <div key={recurringTodo.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  padding: '4px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleRecurringTodo(type, recurringTodo.id)}
                      style={{ borderRadius: '4px' }}
                    />
                    <span style={{
                      fontSize: '13px',
                      color: isCompleted ? '#9ca3af' : '#0369a1',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}>
                      {recurringTodo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => removeRecurringTodo(type, recurringTodo.id)}
                    style={{
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div style={{
        padding: '12px',
        borderTop: '1px solid #e5e7eb'
      }}>
        {/* Regular todo input */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: hasRecurring ? '8px' : '0' }}>
          <input
            type="text"
            value={newTodoInputs[type] || ''}
            onChange={(e) => setNewTodoInputs(prev => ({ ...prev, [type]: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && addTodo(type)}
            placeholder={`Add ${title.toLowerCase()}...`}
            style={{
              flex: 1,
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={() => addTodo(type)}
            style={{
              padding: '6px 8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Recurring todo input */}
        {hasRecurring && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newRecurringInputs[type] || ''}
              onChange={(e) => setNewRecurringInputs(prev => ({ ...prev, [type]: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && addRecurringTodo(type)}
              placeholder={`Add recurring ${type === 'day' ? 'daily' : type === 'week' ? 'weekly' : type === 'month' ? 'monthly' : 'yearly'}...`}
              style={{
                flex: 1,
                padding: '6px 8px',
                border: '1px solid #0ea5e9',
                borderRadius: '4px',
                fontSize: '13px',
                backgroundColor: '#f0f9ff'
              }}
            />
            <button
              onClick={() => addRecurringTodo(type)}
              style={{
                padding: '6px 8px',
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄+
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PlannerDashboard = () => {
  // Helper function to get week string - defined first
  const getWeekString = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    return startOfWeek.toDateString();
  };

  // Load initial data from localStorage or use defaults
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerEvents');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [dayTodos, setDayTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerDayTodos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [weekTodos, setWeekTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerWeekTodos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [monthTodos, setMonthTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerMonthTodos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [yearTodos, setYearTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerYearTodos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerGoals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerReminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [eventInput, setEventInput] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  
  // Recurring todos storage
  const [recurringTodos, setRecurringTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerRecurringTodos');
      return saved ? JSON.parse(saved) : {
        day: [],
        week: [],
        month: [],
        year: []
      };
    } catch {
      return {
        day: [],
        week: [],
        month: [],
        year: []
      };
    }
  });

  // Recurring todos completion state
  const [recurringCompletionState, setRecurringCompletionState] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerRecurringCompletionState');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  const [newTodoInputs, setNewTodoInputs] = useState({
    day: '',
    week: '',
    month: '',
    year: '',
    goal: '',
    reminder: ''
  });
  
  const [newRecurringInputs, setNewRecurringInputs] = useState({
    day: '',
    week: '',
    month: '',
    year: ''
  });

  const timeSlots = [
    '0:00', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '010:00', '010:30', '011:00', '011:30',
  ];

  // Save data whenever state changes
  useEffect(() => {
    localStorage.setItem('plannerEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('plannerDayTodos', JSON.stringify(dayTodos));
  }, [dayTodos]);

  useEffect(() => {
    localStorage.setItem('plannerWeekTodos', JSON.stringify(weekTodos));
  }, [weekTodos]);

  useEffect(() => {
    localStorage.setItem('plannerMonthTodos', JSON.stringify(monthTodos));
  }, [monthTodos]);

  useEffect(() => {
    localStorage.setItem('plannerYearTodos', JSON.stringify(yearTodos));
  }, [yearTodos]);

  useEffect(() => {
    localStorage.setItem('plannerGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('plannerReminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('plannerRecurringTodos', JSON.stringify(recurringTodos));
  }, [recurringTodos]);

  useEffect(() => {
    localStorage.setItem('plannerRecurringCompletionState', JSON.stringify(recurringCompletionState));
  }, [recurringCompletionState]);

  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startDate.setDate(diff + i));
      week.push(new Date(weekDate));
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const getEventKey = (date, time) => {
    return `${date.toDateString()}-${time}`;
  };

  // Get time slot index
  const getTimeIndex = (time) => {
    return timeSlots.indexOf(time);
  };

  // Check if event exists at time slot
  const getEventAtSlot = (date, time) => {
    // Check for single-slot events
    const directKey = getEventKey(date, time);
    if (events[directKey] && typeof events[directKey] === 'string') {
      return { key: directKey, event: events[directKey], type: 'single' };
    }

    // Check for multi-slot events
    for (const [key, event] of Object.entries(events)) {
      if (typeof event === 'object' && event.startTime && event.endTime) {
        const eventDate = key.split('-')[0] + '-' + key.split('-')[1] + '-' + key.split('-')[2];
        if (eventDate === date.toDateString()) {
          const startIndex = getTimeIndex(event.startTime);
          const endIndex = getTimeIndex(event.endTime);
          const currentIndex = getTimeIndex(time);
          if (currentIndex >= startIndex && currentIndex <= endIndex) {
            return { key, event, type: 'multi' };
          }
        }
      }
    }
    return null;
  };

  const addEvent = () => {
    if (selectedTimeSlot && eventInput.trim()) {
      const { date, time } = selectedTimeSlot;
      const key = getEventKey(date, time);
      setEvents(prev => ({ ...prev, [key]: eventInput.trim() }));
      setEventInput('');
      setSelectedTimeSlot(null);
    }
  };

  const editEvent = () => {
    if (editingEvent && eventInput.trim()) {
      setEvents(prev => ({ 
        ...prev, 
        [editingEvent.key]: typeof editingEvent.event === 'object' 
          ? { ...editingEvent.event, text: eventInput.trim() }
          : eventInput.trim()
      }));
      setEventInput('');
      setEditingEvent(null);
    }
  };

  const removeEvent = (eventKey) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      delete newEvents[eventKey];
      return newEvents;
    });
  };

  // Handle cell click
  const handleCellClick = (date, time) => {
    const existingEvent = getEventAtSlot(date, time);
    
    if (existingEvent) {
      // Edit existing event
      setEditingEvent(existingEvent);
      setEventInput(typeof existingEvent.event === 'object' ? existingEvent.event.text : existingEvent.event);
    } else {
      // Create new event
      setSelectedTimeSlot({ date, time });
      setEventInput('');
    }
  };

  // Handle drag start
  const handleDragStart = (date, time, event) => {
    event.preventDefault();
    const existingEvent = getEventAtSlot(date, time);
    if (existingEvent) {
      setIsDragging(true);
      setDragStart({ date, time, eventKey: existingEvent.key, event: existingEvent.event });
    }
  };

  // Handle drag over
  const handleDragOver = (date, time) => {
    if (isDragging && dragStart) {
      setDragEnd({ date, time });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging && dragStart && dragEnd) {
      const startIndex = getTimeIndex(dragStart.time);
      const endIndex = getTimeIndex(dragEnd.time);
      
      if (startIndex <= endIndex && dragStart.date.toDateString() === dragEnd.date.toDateString()) {
        // Remove old event
        setEvents(prev => {
          const newEvents = { ...prev };
          delete newEvents[dragStart.eventKey];
          return newEvents;
        });

        // Add new extended event
        const newKey = getEventKey(dragStart.date, dragStart.time);
        const eventText = typeof dragStart.event === 'object' ? dragStart.event.text : dragStart.event;
        
        setEvents(prev => ({
          ...prev,
          [newKey]: {
            text: eventText,
            startTime: dragStart.time,
            endTime: dragEnd.time
          }
        }));
      }
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // Add recurring todo
  const addRecurringTodo = (type) => {
    const input = newRecurringInputs[type];
    if (input && input.trim()) {
      const newRecurringTodo = {
        id: Date.now(),
        text: input.trim()
      };
      
      setRecurringTodos(prev => ({
        ...prev,
        [type]: [...prev[type], newRecurringTodo]
      }));
      
      setNewRecurringInputs(prev => ({ ...prev, [type]: '' }));
    }
  };

  // Remove recurring todo
  const removeRecurringTodo = (type, id) => {
    setRecurringTodos(prev => ({
      ...prev,
      [type]: prev[type].filter(todo => todo.id !== id)
    }));
    // Also remove from completion state
    setRecurringCompletionState(prev => {
      const newState = { ...prev };
      delete newState[`${type}-${id}`];
      return newState;
    });
  };

  // Toggle recurring todo completion
  const toggleRecurringTodo = (type, id) => {
    const key = `${type}-${id}`;
    setRecurringCompletionState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Regular todo functions
  const addTodo = (type) => {
    const input = newTodoInputs[type];
    if (input && input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input.trim(),
        completed: false
      };
      
      switch (type) {
        case 'day':
          setDayTodos(prev => [...prev, newTodo]);
          break;
        case 'week':
          setWeekTodos(prev => [...prev, newTodo]);
          break;
        case 'month':
          setMonthTodos(prev => [...prev, newTodo]);
          break;
        case 'year':
          setYearTodos(prev => [...prev, newTodo]);
          break;
        case 'goal':
          setGoals(prev => [...prev, newTodo]);
          break;
        case 'reminder':
          setReminders(prev => [...prev, newTodo]);
          break;
        default:
          break;
      }
      
      setNewTodoInputs(prev => ({ ...prev, [type]: '' }));
    }
  };

  const toggleTodo = (type, id) => {
    const setters = {
      day: setDayTodos,
      week: setWeekTodos,
      month: setMonthTodos,
      year: setYearTodos,
      goal: setGoals,
      reminder: setReminders
    };
    
    if (setters[type]) {
      setters[type](prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const removeTodo = (type, id) => {
    const setters = {
      day: setDayTodos,
      week: setWeekTodos,
      month: setMonthTodos,
      year: setYearTodos,
      goal: setGoals,
      reminder: setReminders
    };
    
    if (setters[type]) {
      setters[type](prev => prev.filter(todo => todo.id !== id));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
          }}>Weekly Planner</h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={goToPreviousWeek}
              style={{
                padding: '8px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#374151',
              minWidth: 'max-content'
            }}>
              {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={goToNextWeek}
              style={{
                padding: '8px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, padding: '24px' }}>
        {/* Weekly Schedule */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#374151',
              margin: 0
            }}>Weekly Schedule</h2>
          </div>
          <div style={{ padding: '16px' }}>
            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(7, 1fr)',
              gap: '1px',
              backgroundColor: '#e5e7eb',
              border: '1px solid #e5e7eb'
            }}>
              {/* Empty top-left corner */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '8px',
                fontWeight: 'bold',
                fontSize: '12px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                TIME
              </div>
              
              {/* Day Headers */}
              {weekDates.map((date, index) => (
                <div key={index} style={{
                  backgroundColor: '#f9fafb',
                  padding: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {dayNames[index].slice(0, 3).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
              
              {/* Time slots and grid cells */}
              {timeSlots.map(time => (
                <React.Fragment key={time}>
                  {/* Time label */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {time}
                  </div>
                  
                  {/* Day cells for this time */}
                  {weekDates.map((date, dayIndex) => {
                    const existingEvent = getEventAtSlot(date, time);
                    const isSelected = selectedTimeSlot && 
                      selectedTimeSlot.date.toDateString() === date.toDateString() && 
                      selectedTimeSlot.time === time;
                    const isDragTarget = isDragging && dragEnd && 
                      dragEnd.date.toDateString() === date.toDateString() && 
                      dragEnd.time === time;
                    
                    return (
                      <div
                        key={`${dayIndex}-${time}`}
                        style={{
                          backgroundColor: isSelected ? '#dbeafe' : 
                                         isDragTarget ? '#fef3c7' :
                                         existingEvent ? '#dcfce7' : 'white',
                          minHeight: '24px',
                          cursor: existingEvent ? 'grab' : 'pointer',
                          position: 'relative',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          border: isDragTarget ? '2px dashed #f59e0b' : 'none'
                        }}
                        onClick={() => handleCellClick(date, time)}
                        onMouseDown={(e) => handleDragStart(date, time, e)}
                        onMouseEnter={() => handleDragOver(date, time)}
                        onMouseUp={handleDragEnd}
                      >
                        {existingEvent && (
                          <div 
                            style={{
                              backgroundColor: existingEvent.type === 'multi' ? '#a7f3d0' : '#bbf7d0',
                              borderRadius: '4px',
                              padding: '2px 4px',
                              fontSize: '10px',
                              color: '#166534',
                              fontWeight: '500',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              wordWrap: 'break-word',
                              whiteSpace: 'normal',
                              cursor: 'grab',
                              border: existingEvent.type === 'multi' ? '1px solid #065f46' : 'none'
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleDragStart(date, time, e);
                            }}
                          >
                            <span style={{
                              wordWrap: 'break-word',
                              whiteSpace: 'normal',
                              fontSize: '9px'
                            }}>
                              {typeof existingEvent.event === 'object' ? existingEvent.event.text : existingEvent.event}
                              {existingEvent.type === 'multi' && existingEvent.event.startTime === time && 
                                ` (${existingEvent.event.startTime} - ${existingEvent.event.endTime})`}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeEvent(existingEvent.key);
                              }}
                              style={{
                                color: '#ef4444',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                marginLeft: '2px'
                              }}
                            >
                              <X size={8} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Todo Sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <TodoSection 
            title="Day To-Do" 
            todos={dayTodos} 
            type="day" 
            newTodoInputs={newTodoInputs}
            setNewTodoInputs={setNewTodoInputs}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            recurringTodos={recurringTodos}
            newRecurringInputs={newRecurringInputs}
            setNewRecurringInputs={setNewRecurringInputs}
            addRecurringTodo={addRecurringTodo}
            removeRecurringTodo={removeRecurringTodo}
            recurringCompletionState={recurringCompletionState}
            toggleRecurringTodo={toggleRecurringTodo}
          />
          <TodoSection 
            title="Week To-Do" 
            todos={weekTodos} 
            type="week" 
            newTodoInputs={newTodoInputs}
            setNewTodoInputs={setNewTodoInputs}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            recurringTodos={recurringTodos}
            newRecurringInputs={newRecurringInputs}
            setNewRecurringInputs={setNewRecurringInputs}
            addRecurringTodo={addRecurringTodo}
            removeRecurringTodo={removeRecurringTodo}
            recurringCompletionState={recurringCompletionState}
            toggleRecurringTodo={toggleRecurringTodo}
          />
          <TodoSection 
            title="Month To-Do" 
            todos={monthTodos} 
            type="month" 
            newTodoInputs={newTodoInputs}
            setNewTodoInputs={setNewTodoInputs}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            recurringTodos={recurringTodos}
            newRecurringInputs={newRecurringInputs}
            setNewRecurringInputs={setNewRecurringInputs}
            addRecurringTodo={addRecurringTodo}
            removeRecurringTodo={removeRecurringTodo}
            recurringCompletionState={recurringCompletionState}
            toggleRecurringTodo={toggleRecurringTodo}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          <TodoSection 
            title="Year To-Do" 
            todos={yearTodos} 
            type="year" 
            newTodoInputs={newTodoInputs}
            setNewTodoInputs={setNewTodoInputs}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            recurringTodos={recurringTodos}
            newRecurringInputs={newRecurringInputs}
            setNewRecurringInputs={setNewRecurringInputs}
            addRecurringTodo={addRecurringTodo}
            removeRecurringTodo={removeRecurringTodo}
            recurringCompletionState={recurringCompletionState}
            toggleRecurringTodo={toggleRecurringTodo}
          />
          <TodoSection 
            title="Goals" 
            todos={goals} 
            type="goal" 
            newTodoInputs={newTodoInputs}
            setNewTodoInputs={setNewTodoInputs}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            recurringTodos={recurringTodos}
            newRecurringInputs={newRecurringInputs}
            setNewRecurringInputs={setNewRecurringInputs}
            addRecurringTodo={addRecurringTodo}
            removeRecurringTodo={removeRecurringTodo}
            recurringCompletionState={recurringCompletionState}
            toggleRecurringTodo={toggleRecurringTodo}
          />
          <TodoSection 
            title="Reminders" 
            todos={reminders} 
            type="reminder" 
            newTodoInputs={newTodoInputs}
            setNewTodoInputs={setNewTodoInputs}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            recurringTodos={recurringTodos}
            newRecurringInputs={newRecurringInputs}
            setNewRecurringInputs={setNewRecurringInputs}
            addRecurringTodo={addRecurringTodo}
            removeRecurringTodo={removeRecurringTodo}
            recurringCompletionState={recurringCompletionState}
            toggleRecurringTodo={toggleRecurringTodo}
          />
        </div>
      </div>

      {/* Event Input Modal */}
      {(selectedTimeSlot || editingEvent) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            width: '384px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              {editingEvent ? 'Edit Event' : 
               `Add Event - ${selectedTimeSlot?.date.toLocaleDateString()} at ${selectedTimeSlot?.time}`}
            </h3>
            <input
              type="text"
              value={eventInput}
              onChange={(e) => setEventInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (editingEvent ? editEvent() : addEvent())}
              placeholder="Enter event description..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              autoFocus
            />
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '16px'
            }}>
              <button
                onClick={() => {
                  setSelectedTimeSlot(null);
                  setEditingEvent(null);
                  setEventInput('');
                }}
                style={{
                  padding: '8px 16px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? editEvent : addEvent}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px'
        }}>
          {[
            { icon: Calendar, label: 'Calendar' },
            { icon: BarChart3, label: 'Tracker' },
            { icon: Clock, label: 'Events' },
            { icon: Layout, label: 'Layout' },
            { icon: Bell, label: 'Reminders' }
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Icon size={24} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default PlannerDashboard;