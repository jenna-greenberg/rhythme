import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BarChart3, Clock, Layout, Bell, Plus, X, GripVertical, Eye, EyeOff, Edit2 } from 'lucide-react';

// Color scheme - Periwinkle theme
const colors = {
  periwinkle: {
    50: '#f0f4ff',
    100: '#e0ecff', 
    200: '#c7dbff',
    300: '#a4c2ff',
    400: '#819cff',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81'
  },
  scheduleColors: [
    '#6366f1', // Primary periwinkle
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan  
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444'  // Red
  ]
};

// TodoSection component (unchanged but with new colors)
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
      borderRadius: '12px',
      border: `1px solid ${colors.periwinkle[200]}`,
      boxShadow: '0 4px 6px rgba(99, 102, 241, 0.1)',
      height: '360px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '12px',
        borderBottom: `1px solid ${colors.periwinkle[200]}`,
        backgroundColor: colors.periwinkle[50],
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px'
      }}>
        <h3 style={{ 
          fontWeight: 'bold', 
          color: colors.periwinkle[800], 
          fontSize: '14px',
          margin: 0 
        }}>{title}</h3>
      </div>
      <div style={{
        padding: '12px',
        flex: 1,
        overflowY: 'auto'
      }}>
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
                style={{ borderRadius: '4px', accentColor: colors.periwinkle[500] }}
              />
              <span style={{
                fontSize: '14px',
                color: todo.completed ? colors.periwinkle[400] : colors.periwinkle[800],
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

        {hasRecurring && recurringTodos && recurringTodos[type] && recurringTodos[type].length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${colors.periwinkle[200]}` }}>
            <div style={{ fontSize: '12px', color: colors.periwinkle[600], marginBottom: '8px', fontWeight: '500' }}>
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
                  backgroundColor: colors.periwinkle[50],
                  borderRadius: '6px',
                  border: `1px solid ${colors.periwinkle[200]}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleRecurringTodo(type, recurringTodo.id)}
                      style={{ borderRadius: '4px', accentColor: colors.periwinkle[500] }}
                    />
                    <span style={{
                      fontSize: '13px',
                      color: isCompleted ? colors.periwinkle[400] : colors.periwinkle[700],
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
        borderTop: `1px solid ${colors.periwinkle[200]}`,
        backgroundColor: colors.periwinkle[25]
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: hasRecurring ? '8px' : '0' }}>
          <input
            type="text"
            value={newTodoInputs[type] || ''}
            onChange={(e) => setNewTodoInputs(prev => ({ ...prev, [type]: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && addTodo(type)}
            placeholder={`Add ${title.toLowerCase()}...`}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: `2px solid ${colors.periwinkle[200]}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = colors.periwinkle[400]}
            onBlur={(e) => e.target.style.borderColor = colors.periwinkle[200]}
          />
          <button
            onClick={() => addTodo(type)}
            style={{
              padding: '8px 12px',
              backgroundColor: colors.periwinkle[500],
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.periwinkle[600]}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.periwinkle[500]}
          >
            <Plus size={16} />
          </button>
        </div>

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
                padding: '8px 12px',
                border: `2px solid ${colors.periwinkle[300]}`,
                borderRadius: '8px',
                fontSize: '13px',
                backgroundColor: colors.periwinkle[50],
                outline: 'none'
              }}
            />
            <button
              onClick={() => addRecurringTodo(type)}
              style={{
                padding: '8px 12px',
                backgroundColor: colors.periwinkle[400],
                color: 'white',
                border: 'none',
                borderRadius: '8px',
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
  // Helper function to get week string
  const getWeekString = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    return startOfWeek.toDateString();
  };

  // Schedules state - NEW
  const [schedules, setSchedules] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerSchedules');
      return saved ? JSON.parse(saved) : [
        {
          id: 'main',
          name: 'Main Schedule',
          events: {},
          isVisible: true,
          color: colors.scheduleColors[0]
        }
      ];
    } catch {
      return [
        {
          id: 'main',
          name: 'Main Schedule', 
          events: {},
          isVisible: true,
          color: colors.scheduleColors[0]
        }
      ];
    }
  });

  const [activeScheduleId, setActiveScheduleId] = useState('main');
  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState('');

  // Load initial data from localStorage or use defaults
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date()); // For calendar modal
  
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
  // Enhanced drag and interaction states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [dragMode, setDragMode] = useState(null); // 'extend-down', 'extend-up', 'move'
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);
  
  // New states for enhanced features
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerCalendarEvents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [progressStats, setProgressStats] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerProgressStats');
      return saved ? JSON.parse(saved) : {
        todosCompleted: 0,
        recurringCompleted: 0,
        totalTodos: 0,
        totalRecurring: 0,
        streakDays: 0,
        lastActiveDate: new Date().toDateString()
      };
    } catch {
      return {
        todosCompleted: 0,
        recurringCompleted: 0,
        totalTodos: 0,
        totalRecurring: 0,
        streakDays: 0,
        lastActiveDate: new Date().toDateString()
      };
    }
  });
  const [layoutSections, setLayoutSections] = useState(() => {
    try {
      const saved = localStorage.getItem('plannerLayoutSections');
      return saved ? JSON.parse(saved) : [
        { id: 'day', title: 'Day To-Do', type: 'todo', enabled: true },
        { id: 'week', title: 'Week To-Do', type: 'todo', enabled: true },
        { id: 'month', title: 'Month To-Do', type: 'todo', enabled: true },
        { id: 'year', title: 'Year To-Do', type: 'todo', enabled: true },
        { id: 'goals', title: 'Goals', type: 'todo', enabled: true },
        { id: 'reminders', title: 'Reminders', type: 'todo', enabled: true }
      ];
    } catch {
      return [
        { id: 'day', title: 'Day To-Do', type: 'todo', enabled: true },
        { id: 'week', title: 'Week To-Do', type: 'todo', enabled: true },
        { id: 'month', title: 'Month To-Do', type: 'todo', enabled: true },
        { id: 'year', title: 'Year To-Do', type: 'todo', enabled: true },
        { id: 'goals', title: 'Goals', type: 'todo', enabled: true },
        { id: 'reminders', title: 'Reminders', type: 'todo', enabled: true }
      ];
    }
  });
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  
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
    '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  // Save schedules whenever they change
  useEffect(() => {
    localStorage.setItem('plannerSchedules', JSON.stringify(schedules));
  }, [schedules]);

  // Save other data whenever state changes
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

  useEffect(() => {
    localStorage.setItem('plannerCalendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('plannerProgressStats', JSON.stringify(progressStats));
  }, [progressStats]);

  useEffect(() => {
    localStorage.setItem('plannerLayoutSections', JSON.stringify(layoutSections));
  }, [layoutSections]);

  // SCHEDULE MANAGEMENT FUNCTIONS - NEW
  const createSchedule = () => {
    if (newScheduleName.trim() && schedules.length < 6) {
      const newSchedule = {
        id: Date.now().toString(),
        name: newScheduleName.trim(),
        events: {},
        isVisible: true,
        color: colors.scheduleColors[schedules.length % colors.scheduleColors.length]
      };
      setSchedules(prev => [...prev, newSchedule]);
      setNewScheduleName('');
    }
  };

  const deleteSchedule = (scheduleId) => {
    if (scheduleId !== 'main' && schedules.length > 1) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      if (activeScheduleId === scheduleId) {
        setActiveScheduleId('main');
      }
    }
  };

  const toggleScheduleVisibility = (scheduleId) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, isVisible: !schedule.isVisible }
        : schedule
    ));
  };

  const renameSchedule = (scheduleId, newName) => {
    if (newName.trim()) {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, name: newName.trim() }
          : schedule
      ));
    }
  };

  const getActiveSchedule = () => {
    return schedules.find(s => s.id === activeScheduleId) || schedules[0];
  };

  const updateScheduleEvents = (scheduleId, events) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, events }
        : schedule
    ));
  };

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

  const getTimeIndex = (time) => {
    return timeSlots.indexOf(time);
  };

  // Get all events at a time slot from all visible schedules - MODIFIED
  const getAllEventsAtSlot = (date, time) => {
    const events = [];
    
    schedules.forEach(schedule => {
      if (!schedule.isVisible) return;
      
      const directKey = getEventKey(date, time);
      if (schedule.events[directKey] && typeof schedule.events[directKey] === 'string') {
        events.push({ 
          key: directKey, 
          event: schedule.events[directKey], 
          type: 'single',
          scheduleId: schedule.id,
          scheduleName: schedule.name,
          color: schedule.color
        });
      }

      // Check for multi-slot events
      for (const [key, event] of Object.entries(schedule.events)) {
        if (typeof event === 'object' && event.startTime && event.endTime) {
          const eventDate = key.split('-')[0] + '-' + key.split('-')[1] + '-' + key.split('-')[2];
          if (eventDate === date.toDateString()) {
            const startIndex = getTimeIndex(event.startTime);
            const endIndex = getTimeIndex(event.endTime);
            const currentIndex = getTimeIndex(time);
            if (currentIndex >= startIndex && currentIndex <= endIndex) {
              events.push({ 
                key, 
                event, 
                type: 'multi',
                scheduleId: schedule.id,
                scheduleName: schedule.name,
                color: schedule.color
              });
            }
          }
        }
      }
    });
    
    return events;
  };

  const addEvent = () => {
    if (selectedTimeSlot && eventInput.trim()) {
      const { date, time } = selectedTimeSlot;
      const key = getEventKey(date, time);
      const activeSchedule = getActiveSchedule();
      const newEvents = { ...activeSchedule.events, [key]: eventInput.trim() };
      updateScheduleEvents(activeSchedule.id, newEvents);
      setEventInput('');
      setSelectedTimeSlot(null);
    }
  };

  const editEvent = () => {
    if (editingEvent && eventInput.trim()) {
      const schedule = schedules.find(s => s.id === editingEvent.scheduleId);
      if (schedule) {
        const newEvents = { 
          ...schedule.events, 
          [editingEvent.key]: typeof editingEvent.event === 'object' 
            ? { ...editingEvent.event, text: eventInput.trim() }
            : eventInput.trim()
        };
        updateScheduleEvents(schedule.id, newEvents);
      }
      setEventInput('');
      setEditingEvent(null);
    }
  };

  const removeEvent = (eventKey, scheduleId) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      const newEvents = { ...schedule.events };
      delete newEvents[eventKey];
      updateScheduleEvents(scheduleId, newEvents);
    }
  };

  // Handle cell click - SIMPLIFIED
  const handleCellClick = (date, time) => {
    if (!isDragging) {
      // Create new event in active schedule
      setSelectedTimeSlot({ date, time });
      setEventInput('');
    }
  };

  // Handle drag start with different modes - ENHANCED
  const handleDragStart = (date, time, mouseEvent, eventData, mode = 'move') => {
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    
    if (eventData) {
      // Clear any pending click timeout
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }
      
      // For multi-slot events, use the start time as the original time
      const originalTime = (typeof eventData.event === 'object' && eventData.event.startTime) 
        ? eventData.event.startTime 
        : time;
        
      setIsDragging(true);
      setDragMode(mode);
      setDragStart({ 
        date, 
        time, 
        eventKey: eventData.key, 
        event: eventData.event, 
        scheduleId: eventData.scheduleId,
        originalTime: originalTime,
        originalDate: date
      });
      setDragEnd({ date, time });
    }
  };

  // Handle event click (for editing) - NEW
  const handleEventClick = (date, time, mouseEvent, eventData) => {
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    
    // Set a timeout to detect if this is a click or drag start
    const timeout = setTimeout(() => {
      // If we get here, it's a click not a drag
      setEditingEvent(eventData);
      setEventInput(typeof eventData.event === 'object' ? eventData.event.text : eventData.event);
      setClickTimeout(null);
    }, 150); // 150ms delay to detect drag
    
    setClickTimeout(timeout);
  };

  // Handle drag over - ENHANCED
  const handleDragOver = (date, time) => {
    if (isDragging && dragStart) {
      // Clear click timeout if dragging starts
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }
      setDragEnd({ date, time });
    }
  };

  // Handle drag end - FIXED
  const handleDragEnd = useCallback(() => {
    if (isDragging && dragStart && dragEnd && dragEnd.date && dragEnd.time) {
      const originalTimeIndex = getTimeIndex(dragStart.originalTime || dragStart.time);
      const endTimeIndex = getTimeIndex(dragEnd.time);
      
      const schedule = schedules.find(s => s.id === dragStart.scheduleId);
      if (schedule) {
        const eventText = typeof dragStart.event === 'object' ? dragStart.event.text : dragStart.event;
        const newEvents = { ...schedule.events };
        
        // Remove the original event
        delete newEvents[dragStart.eventKey];
        
        // Determine if this is an extend operation (dragging down on same date from original position)
        // or a move operation (dragging to a different time/date)
        const isSameDate = dragStart.date.toDateString() === dragEnd.date.toDateString();
        const dragStartTime = dragStart.originalTime || dragStart.time;
        const isExtending = isSameDate && 
                           dragStartTime === dragStart.time && 
                           endTimeIndex > originalTimeIndex;
        
        if (isExtending) {
          // Extending: create a multi-slot event from original time to drag end time
          const newKey = getEventKey(dragStart.date, dragStartTime);
          newEvents[newKey] = {
            text: eventText,
            startTime: dragStartTime,
            endTime: dragEnd.time
          };
        } else {
          // Moving: create event at new location
          const newKey = getEventKey(dragEnd.date, dragEnd.time);
          
          if (typeof dragStart.event === 'object' && dragStart.event.startTime && dragStart.event.endTime) {
            // If it was a multi-slot event, preserve the duration
            const originalStartIndex = getTimeIndex(dragStart.event.startTime);
            const originalEndIndex = getTimeIndex(dragStart.event.endTime);
            const duration = originalEndIndex - originalStartIndex;
            const newEndIndex = Math.min(endTimeIndex + duration, timeSlots.length - 1);
            
            if (duration > 0) {
              newEvents[newKey] = {
                text: eventText,
                startTime: dragEnd.time,
                endTime: timeSlots[newEndIndex]
              };
            } else {
              newEvents[newKey] = eventText;
            }
          } else {
            // Single slot event
            newEvents[newKey] = eventText;
          }
        }
        
        updateScheduleEvents(schedule.id, newEvents);
      }
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [isDragging, dragStart, dragEnd, schedules, timeSlots, updateScheduleEvents]);

  // Handle mouse up globally to catch missed drag ends
  useEffect(() => {
    const handleGlobalMouseUp = (e) => {
      if (isDragging) {
        handleDragEnd();
      }
      // Clear any pending click timeout
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }
    };

    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        // Prevent text selection during drag
        e.preventDefault();
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = dragMode === 'move' ? 'move' : 'ns-resize';
    }

    // Always listen for mouseup to clear click timeouts
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragMode, handleDragEnd, clickTimeout]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  // CALENDAR FUNCTIONS - NEW
  const getCalendarDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dates.push(currentDate);
    }
    
    return { dates, firstDay, lastDay };
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toDateString();
    const events = [];
    
    schedules.forEach(schedule => {
      if (!schedule.isVisible) return;
      
      Object.entries(schedule.events).forEach(([key, event]) => {
        if (key.startsWith(dateStr)) {
          events.push({
            text: typeof event === 'object' ? event.text : event,
            color: schedule.color,
            scheduleName: schedule.name
          });
        }
      });
    });
    
    return events;
  };

  // Progress Tracking Functions
  const updateProgressStats = (type, action) => {
    setProgressStats(prev => {
      const today = new Date().toDateString();
      let newStats = { ...prev };
      
      if (action === 'complete') {
        if (type === 'todo') {
          newStats.todosCompleted += 1;
        } else if (type === 'recurring') {
          newStats.recurringCompleted += 1;
        }
      }
      
      // Update streak
      if (prev.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (prev.lastActiveDate === yesterday.toDateString()) {
          newStats.streakDays += 1;
        } else {
          newStats.streakDays = 1;
        }
        newStats.lastActiveDate = today;
      }
      
      return newStats;
    });
  };

  // Layout Functions
  const toggleLayoutSection = (id) => {
    setLayoutSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  // Enhanced Reminders Tracker
  const getTodaysReminders = () => {
    const today = new Date().toDateString();
    const activeReminders = reminders.filter(reminder => !reminder.completed);
    return [...activeReminders];
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

  const removeRecurringTodo = (type, id) => {
    setRecurringTodos(prev => ({
      ...prev,
      [type]: prev[type].filter(todo => todo.id !== id)
    }));
    setRecurringCompletionState(prev => {
      const newState = { ...prev };
      delete newState[`${type}-${id}`];
      return newState;
    });
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
      setters[type](prev => {
        const updated = prev.map(todo => {
          if (todo.id === id) {
            const wasCompleted = todo.completed;
            const nowCompleted = !todo.completed;
            
            if (!wasCompleted && nowCompleted) {
              updateProgressStats('todo', 'complete');
            }
            
            return { ...todo, completed: nowCompleted };
          }
          return todo;
        });
        return updated;
      });
    }
  };

  const toggleRecurringTodo = (type, id) => {
    const key = `${type}-${id}`;
    const wasCompleted = recurringCompletionState[key] || false;
    const nowCompleted = !wasCompleted;
    
    setRecurringCompletionState(prev => ({
      ...prev,
      [key]: nowCompleted
    }));
    
    if (!wasCompleted && nowCompleted) {
      updateProgressStats('recurring', 'complete');
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
    <div 
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.periwinkle[50]} 0%, ${colors.periwinkle[100]} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        userSelect: isDragging ? 'none' : 'auto',
        cursor: isDragging ? 'move' : 'default'
      }}
      onMouseUp={() => {
        if (isDragging) {
          handleDragEnd();
        }
      }}
      className={isDragging ? 'dragging' : ''}
    >
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: `0 4px 6px rgba(99, 102, 241, 0.1)`,
        borderBottom: `2px solid ${colors.periwinkle[200]}`,
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: colors.periwinkle[800],
              margin: 0,
              background: `linear-gradient(135deg, ${colors.periwinkle[600]}, ${colors.periwinkle[800]})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Weekly Planner</h1>
            
            {/* Schedule Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={activeScheduleId}
                onChange={(e) => setActiveScheduleId(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `2px solid ${colors.periwinkle[300]}`,
                  backgroundColor: 'white',
                  color: colors.periwinkle[800],
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {schedules.map(schedule => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowScheduleManager(true)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: colors.periwinkle[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Manage
              </button>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={goToPreviousWeek}
              style={{
                padding: '12px',
                color: colors.periwinkle[600],
                backgroundColor: colors.periwinkle[50],
                border: `2px solid ${colors.periwinkle[200]}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.periwinkle[100];
                e.target.style.borderColor = colors.periwinkle[300];
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.periwinkle[50];
                e.target.style.borderColor = colors.periwinkle[200];
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors.periwinkle[800],
              minWidth: 'max-content'
            }}>
              {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={goToNextWeek}
              style={{
                padding: '12px',
                color: colors.periwinkle[600],
                backgroundColor: colors.periwinkle[50],
                border: `2px solid ${colors.periwinkle[200]}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.periwinkle[100];
                e.target.style.borderColor = colors.periwinkle[300];
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.periwinkle[50];
                e.target.style.borderColor = colors.periwinkle[200];
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, padding: '24px' }}>
        {/* Progress Tracker */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `2px solid ${colors.periwinkle[200]}`,
          boxShadow: `0 8px 25px rgba(99, 102, 241, 0.15)`,
          marginBottom: '20px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: colors.periwinkle[800] }}>
              📊 Progress Tracker
            </h3>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
              <span style={{ color: '#059669', fontWeight: '600' }}>
                ✅ {progressStats.todosCompleted} Todos
              </span>
              <span style={{ color: colors.periwinkle[600], fontWeight: '600' }}>
                🔄 {progressStats.recurringCompleted} Recurring
              </span>
              <span style={{ color: '#dc2626', fontWeight: '600' }}>
                🔥 {progressStats.streakDays} Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Today's Reminders Tracker */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `2px solid ${colors.periwinkle[200]}`,
          boxShadow: `0 8px 25px rgba(99, 102, 241, 0.15)`,
          marginBottom: '24px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: colors.periwinkle[800] }}>
            🔔 Today's Reminders
          </h3>
          <div style={{ fontSize: '14px', color: colors.periwinkle[600] }}>
            {getTodaysReminders().length === 0 ? (
              <span>No daily reminders</span>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {getTodaysReminders().map((reminder, index) => (
                  <span key={index} style={{
                    backgroundColor: colors.periwinkle[100],
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: colors.periwinkle[700]
                  }}>
                    {reminder.title || reminder.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Schedule Overlay Indicators */}
        {schedules.filter(s => s.isVisible).length > 1 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: `2px solid ${colors.periwinkle[200]}`,
            boxShadow: `0 8px 25px rgba(99, 102, 241, 0.15)`,
            marginBottom: '24px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: colors.periwinkle[800] }}>
                Active Overlays:
              </span>
              {schedules.filter(s => s.isVisible).map(schedule => (
                <div key={schedule.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: schedule.color + '20',
                  border: `2px solid ${schedule.color}`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: schedule.color
                  }}></div>
                  {schedule.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Weekly Schedule */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `2px solid ${colors.periwinkle[200]}`,
          boxShadow: `0 8px 25px rgba(99, 102, 241, 0.15)`,
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: `2px solid ${colors.periwinkle[200]}`,
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            background: `linear-gradient(135deg, ${colors.periwinkle[50]}, ${colors.periwinkle[100]})`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: colors.periwinkle[800],
                margin: 0
              }}>Weekly Schedule - {getActiveSchedule().name}</h2>
              {isDragging && dragStart && dragEnd && (
                <div style={{
                  fontSize: '14px',
                  color: '#f59e0b',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {dragMode === 'extend-down' ? '⬇️ Extending event down...' : 
                   dragMode === 'extend-up' ? '⬆️ Extending event up...' :
                   dragMode === 'move' ? '📅 Moving event...' : '🔄 Dragging...'}
                </div>
              )}
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px repeat(7, 1fr)',
              gap: '2px',
              backgroundColor: colors.periwinkle[200],
              border: `2px solid ${colors.periwinkle[200]}`,
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {/* Empty top-left corner */}
              <div style={{
                backgroundColor: colors.periwinkle[100],
                padding: '12px',
                fontWeight: 'bold',
                fontSize: '12px',
                textAlign: 'center',
                color: colors.periwinkle[700]
              }}>
                TIME
              </div>
              
              {/* Day Headers */}
              {weekDates.map((date, index) => (
                <div key={index} style={{
                  backgroundColor: colors.periwinkle[100],
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: colors.periwinkle[800]
                }}>
                  <div style={{ fontSize: '12px', color: colors.periwinkle[600] }}>
                    {dayNames[index].slice(0, 3).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
              
              {/* Time slots and grid cells */}
              {timeSlots.map(time => (
                <React.Fragment key={time}>
                  {/* Time label */}
                  <div style={{
                    backgroundColor: colors.periwinkle[50],
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: colors.periwinkle[700],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {time}
                  </div>
                  
                  {/* Day cells for this time */}
                  {weekDates.map((date, dayIndex) => {
                    const allEvents = getAllEventsAtSlot(date, time);
                    const isSelected = selectedTimeSlot && 
                      selectedTimeSlot.date.toDateString() === date.toDateString() && 
                      selectedTimeSlot.time === time;
                    const isDragTarget = isDragging && dragEnd && 
                      dragEnd.date.toDateString() === date.toDateString() && 
                      dragEnd.time === time;
                    const isDragPath = isDragging && dragStart && dragEnd &&
                      dragStart.date.toDateString() === date.toDateString() &&
                      dragEnd.date.toDateString() === date.toDateString() &&
                      dragStart.date.toDateString() === dragEnd.date.toDateString() &&
                      ((dragMode === 'extend-down' && 
                        getTimeIndex(time) >= getTimeIndex(dragStart.originalTime || dragStart.time) &&
                        getTimeIndex(time) <= getTimeIndex(dragEnd.time)) ||
                       (dragMode === 'extend-up' &&
                        getTimeIndex(time) >= getTimeIndex(dragEnd.time) &&
                        getTimeIndex(time) <= getTimeIndex(dragStart.originalTime || dragStart.time)));
                    const isDragSource = isDragging && dragStart &&
                      dragStart.date.toDateString() === date.toDateString() &&
                      ((dragMode === 'move' && dragStart.time === time) ||
                       (dragMode === 'extend-down' && (dragStart.originalTime || dragStart.time) === time) ||
                       (dragMode === 'extend-up' && (dragStart.originalTime || dragStart.time) === time));
                    
                    return (
                      <div
                        key={`${dayIndex}-${time}`}
                        style={{
                          backgroundColor: isSelected ? colors.periwinkle[200] : 
                                         isDragTarget ? '#fef3c7' :
                                         isDragPath ? colors.periwinkle[100] :
                                         isDragSource ? colors.periwinkle[300] :
                                         'white',
                          minHeight: '32px',
                          cursor: !isDragging ? 'pointer' : 'default',
                          position: 'relative',
                          padding: '4px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          border: isDragTarget ? '2px dashed #f59e0b' : 
                                  isDragPath ? `2px solid ${colors.periwinkle[400]}` :
                                  isDragSource ? `2px solid ${colors.periwinkle[500]}` : 'none',
                          transition: 'background-color 0.1s',
                          opacity: isDragSource ? 0.7 : 1
                        }}
                        onClick={(e) => {
                          if (!isDragging && !e.target.closest('.drag-handle') && !e.target.closest('button')) {
                            handleCellClick(date, time);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (isDragging) {
                            handleDragOver(date, time);
                          } else if (allEvents.length === 0) {
                            e.target.style.backgroundColor = colors.periwinkle[50];
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isDragging && allEvents.length === 0) {
                            e.target.style.backgroundColor = 'white';
                          }
                        }}
                        onMouseMove={(e) => {
                          if (isDragging) {
                            handleDragOver(date, time);
                          }
                        }}
                      >
                        {allEvents.map((eventData, eventIndex) => {
                          const isHovered = hoveredEvent === `${eventData.key}-${eventIndex}`;
                          const isMultiSlot = typeof eventData.event === 'object' && eventData.event.startTime && eventData.event.endTime;
                          const isEventStart = !isMultiSlot || eventData.event.startTime === time;
                          const isEventEnd = !isMultiSlot || eventData.event.endTime === time;
                          
                          return (
                            <div 
                              key={`${eventData.key}-${eventIndex}`}
                              className="event-container"
                              style={{
                                backgroundColor: eventData.color + (allEvents.length > 1 ? '80' : 'CC'),
                                borderRadius: '6px',
                                padding: '3px 6px',
                                fontSize: '9px',
                                color: 'white',
                                fontWeight: '600',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'stretch',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                border: eventData.type === 'multi' ? `1px solid ${eventData.color}` : 'none',
                                position: 'relative',
                                opacity: eventData.scheduleId === activeScheduleId ? 1 : 0.7,
                                cursor: 'pointer',
                                minHeight: '20px'
                              }}
                              onMouseEnter={() => setHoveredEvent(`${eventData.key}-${eventIndex}`)}
                              onMouseLeave={() => setHoveredEvent(null)}
                            >
                              {/* Top Extend Arrow - only show on hover and for event start */}
                              {isHovered && isEventStart && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '16px',
                                    height: '8px',
                                    backgroundColor: eventData.color,
                                    borderRadius: '4px 4px 0 0',
                                    cursor: 'ns-resize',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '6px',
                                    color: 'white',
                                    zIndex: 10
                                  }}
                                  onMouseDown={(e) => handleDragStart(date, time, e, eventData, 'extend-up')}
                                  title="Drag to extend event upward"
                                >
                                  ▲
                                </div>
                              )}

                              {/* Event Content */}
                              <div 
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flex: 1
                                }}
                                onMouseDown={(e) => handleEventClick(date, time, e, eventData)}
                                onMouseMove={(e) => {
                                  // If mouse moves during mousedown, start drag
                                  if (e.buttons === 1 && clickTimeout) {
                                    clearTimeout(clickTimeout);
                                    setClickTimeout(null);
                                    handleDragStart(date, time, e, eventData, 'move');
                                  }
                                }}
                              >
                                <span style={{
                                  wordWrap: 'break-word',
                                  whiteSpace: 'normal',
                                  fontSize: '8px',
                                  flex: 1
                                }}>
                                  {typeof eventData.event === 'object' ? eventData.event.text : eventData.event}
                                  {eventData.type === 'multi' && eventData.event.startTime === time && 
                                    ` (${eventData.event.startTime} - ${eventData.event.endTime})`}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeEvent(eventData.key, eventData.scheduleId);
                                  }}
                                  style={{
                                    color: 'white',
                                    background: 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    marginLeft: '2px',
                                    borderRadius: '2px',
                                    width: '12px',
                                    height: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <X size={6} />
                                </button>
                              </div>

                              {/* Bottom Extend Arrow - only show on hover and for event end */}
                              {isHovered && isEventEnd && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '16px',
                                    height: '8px',
                                    backgroundColor: eventData.color,
                                    borderRadius: '0 0 4px 4px',
                                    cursor: 'ns-resize',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '6px',
                                    color: 'white',
                                    zIndex: 10
                                  }}
                                  onMouseDown={(e) => handleDragStart(date, time, e, eventData, 'extend-down')}
                                  title="Drag to extend event downward"
                                >
                                  ▼
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Todo Sections - filtered by enabled sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {layoutSections.slice(0, 3).filter(section => section.enabled).map(section => (
            <TodoSection 
              key={section.id}
              title={section.title} 
              todos={section.id === 'day' ? dayTodos : 
                     section.id === 'week' ? weekTodos : 
                     section.id === 'month' ? monthTodos : 
                     section.id === 'year' ? yearTodos :
                     section.id === 'goals' ? goals : reminders} 
              type={section.id} 
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
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {layoutSections.slice(3, 6).filter(section => section.enabled).map(section => (
            <TodoSection 
              key={section.id}
              title={section.title} 
              todos={section.id === 'day' ? dayTodos : 
                     section.id === 'week' ? weekTodos : 
                     section.id === 'month' ? monthTodos : 
                     section.id === 'year' ? yearTodos :
                     section.id === 'goals' ? goals : reminders} 
              type={section.id} 
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
          ))}
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
          backgroundColor: 'rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: `0 25px 50px rgba(99, 102, 241, 0.25)`,
            width: '420px',
            border: `2px solid ${colors.periwinkle[200]}`
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px',
              margin: '0 0 20px 0',
              color: colors.periwinkle[800]
            }}>
              {editingEvent ? `Edit Event - ${editingEvent.scheduleName}` : 
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
                padding: '16px',
                border: `2px solid ${colors.periwinkle[300]}`,
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.periwinkle[500]}
              onBlur={(e) => e.target.style.borderColor = colors.periwinkle[300]}
              autoFocus
            />
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              marginTop: '24px'
            }}>
              <button
                onClick={() => {
                  setSelectedTimeSlot(null);
                  setEditingEvent(null);
                  setEventInput('');
                }}
                style={{
                  padding: '12px 24px',
                  color: colors.periwinkle[600],
                  backgroundColor: colors.periwinkle[50],
                  border: `2px solid ${colors.periwinkle[200]}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? editEvent : addEvent}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.periwinkle[500],
                  color: 'white',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.periwinkle[600]}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.periwinkle[500]}
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Manager Modal */}
      {showScheduleManager && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: `0 25px 50px rgba(99, 102, 241, 0.25)`,
            width: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: `2px solid ${colors.periwinkle[200]}`
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px', margin: '0 0 24px 0', color: colors.periwinkle[800] }}>
              📅 Manage Schedules
            </h3>
            
            {/* Add New Schedule */}
            {schedules.length < 6 && (
              <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: colors.periwinkle[50], borderRadius: '12px', border: `2px solid ${colors.periwinkle[200]}` }}>
                <h4 style={{ margin: '0 0 12px 0', color: colors.periwinkle[800] }}>Create New Schedule</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={newScheduleName}
                    onChange={(e) => setNewScheduleName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createSchedule()}
                    placeholder="Schedule name..."
                    style={{ 
                      flex: 1, 
                      padding: '12px', 
                      border: `2px solid ${colors.periwinkle[300]}`, 
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={createSchedule}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: colors.periwinkle[500],
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {/* Existing Schedules */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: colors.periwinkle[800] }}>Your Schedules ({schedules.length}/6):</h4>
              {schedules.map(schedule => (
                <div key={schedule.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: schedule.isVisible ? 'white' : colors.periwinkle[50],
                  borderRadius: '12px',
                  border: `2px solid ${schedule.isVisible ? schedule.color : colors.periwinkle[200]}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: schedule.color
                    }}></div>
                    <span style={{ fontWeight: '600', color: colors.periwinkle[800] }}>{schedule.name}</span>
                    {schedule.id === activeScheduleId && (
                      <span style={{ 
                        fontSize: '12px', 
                        color: colors.periwinkle[600], 
                        backgroundColor: colors.periwinkle[100], 
                        padding: '2px 8px', 
                        borderRadius: '8px' 
                      }}>
                        Active
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => toggleScheduleVisibility(schedule.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: schedule.isVisible ? colors.periwinkle[500] : colors.periwinkle[300],
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {schedule.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {schedule.isVisible ? 'Visible' : 'Hidden'}
                    </button>
                    {schedule.id !== 'main' && (
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        style={{
                          padding: '6px 8px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowScheduleManager(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.periwinkle[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal - NEW */}
      {showCalendarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: `0 25px 50px rgba(99, 102, 241, 0.25)`,
            width: '700px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: `2px solid ${colors.periwinkle[200]}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: colors.periwinkle[800] }}>
                📅 Calendar View
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={goToPreviousMonth}
                  style={{
                    padding: '8px',
                    color: colors.periwinkle[600],
                    backgroundColor: colors.periwinkle[50],
                    border: `2px solid ${colors.periwinkle[200]}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '18px', fontWeight: '600', color: colors.periwinkle[800], minWidth: '200px', textAlign: 'center' }}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={goToNextMonth}
                  style={{
                    padding: '8px',
                    color: colors.periwinkle[600],
                    backgroundColor: colors.periwinkle[50],
                    border: `2px solid ${colors.periwinkle[200]}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              backgroundColor: colors.periwinkle[200],
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{
                  backgroundColor: colors.periwinkle[100],
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: colors.periwinkle[800]
                }}>
                  {day}
                </div>
              ))}
              
              {/* Calendar Dates */}
              {getCalendarDates(currentMonth).dates.map((date, index) => {
                const events = getEventsForDate(date);
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div key={index} style={{
                    backgroundColor: isToday ? colors.periwinkle[200] : 'white',
                    minHeight: '80px',
                    padding: '8px',
                    opacity: isCurrentMonth ? 1 : 0.3,
                    border: isToday ? `2px solid ${colors.periwinkle[500]}` : 'none'
                  }}>
                    <div style={{
                      fontWeight: isToday ? 'bold' : 'normal',
                      color: isToday ? colors.periwinkle[800] : colors.periwinkle[600],
                      marginBottom: '4px'
                    }}>
                      {date.getDate()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {events.slice(0, 3).map((event, eventIndex) => (
                        <div key={eventIndex} style={{
                          backgroundColor: event.color,
                          color: 'white',
                          fontSize: '10px',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {event.text}
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div style={{ 
                          fontSize: '10px', 
                          color: colors.periwinkle[600], 
                          fontWeight: '500' 
                        }}>
                          +{events.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowCalendarModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.periwinkle[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout Customization Modal */}
      {showLayoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: `0 25px 50px rgba(99, 102, 241, 0.25)`,
            width: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: `2px solid ${colors.periwinkle[200]}`
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px', margin: '0 0 24px 0', color: colors.periwinkle[800] }}>
              🎨 Customize Layout
            </h3>
            
            <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: colors.periwinkle[50], borderRadius: '12px', border: `2px solid ${colors.periwinkle[200]}` }}>
              <h4 style={{ margin: '0 0 12px 0', color: colors.periwinkle[700] }}>✨ Perfect for ADHD</h4>
              <p style={{ margin: 0, fontSize: '14px', color: colors.periwinkle[600] }}>
                Toggle sections on/off to reduce overwhelm and focus on what matters most to you.
              </p>
            </div>

            {/* Section Toggles */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: colors.periwinkle[800] }}>Current Sections:</h4>
              {layoutSections.map(section => (
                <div key={section.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  backgroundColor: section.enabled ? colors.periwinkle[50] : '#f3f4f6',
                  borderRadius: '12px',
                  border: section.enabled ? `2px solid ${colors.periwinkle[300]}` : '2px solid #e5e7eb'
                }}>
                  <span style={{ fontWeight: '600', color: section.enabled ? colors.periwinkle[800] : '#6b7280' }}>{section.title}</span>
                  <button
                    onClick={() => toggleLayoutSection(section.id)}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: section.enabled ? '#ef4444' : colors.periwinkle[500],
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {section.enabled ? 'Hide' : 'Show'}
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Layout Presets */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: colors.periwinkle[800] }}>Quick Presets:</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setLayoutSections(prev => prev.map(s => ({ ...s, enabled: true })));
                  }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: colors.periwinkle[500],
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Show All
                </button>
                <button
                  onClick={() => {
                    setLayoutSections(prev => prev.map(s => ({ 
                      ...s, 
                      enabled: ['day', 'week', 'goals'].includes(s.id) 
                    })));
                  }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Minimal Focus
                </button>
                <button
                  onClick={() => {
                    setLayoutSections(prev => prev.map(s => ({ 
                      ...s, 
                      enabled: ['day', 'week', 'month', 'reminders'].includes(s.id) 
                    })));
                  }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Student Mode
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowLayoutModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.periwinkle[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderTop: `2px solid ${colors.periwinkle[200]}`,
        padding: '20px',
        boxShadow: `0 -4px 6px rgba(99, 102, 241, 0.1)`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px'
        }}>
          {[
            { icon: Calendar, label: 'Calendar', action: () => setShowCalendarModal(true) },
            { icon: BarChart3, label: 'Tracker', action: () => {} },
            { icon: Clock, label: 'Schedules', action: () => setShowScheduleManager(true) },
            { icon: Layout, label: 'Layout', action: () => setShowLayoutModal(true) },
            { icon: Bell, label: 'Reminders', action: () => {} }
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px',
                color: colors.periwinkle[600],
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.periwinkle[50];
                e.target.style.color = colors.periwinkle[700];
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = colors.periwinkle[600];
              }}
            >
              <Icon size={28} />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default PlannerDashboard;