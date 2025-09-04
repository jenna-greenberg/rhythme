/**
 * Constants and Configuration for Weekly Planner Application
 * 
 * This file contains all static values, color schemes, and configuration
 * options used throughout the application. Centralizing these values
 * makes the app easier to maintain and customize.
 */


// Color scheme - Periwinkle theme with semantic variations
export const colors = {
  // Primary periwinkle color palette (50-900 scale)
  periwinkle: {
    25: '#fafaff',    // Ultra light background
    50: '#f0f4ff',    // Light background
    100: '#e0ecff',   // Section backgrounds
    200: '#c7dbff',   // Borders
    300: '#a4c2ff',   // Secondary borders
    400: '#819cff',   // Muted text
    500: '#6366f1',   // Primary brand color
    600: '#4f46e5',   // Hover states
    700: '#4338ca',   // Active states
    800: '#3730a3',   // Dark text
    900: '#312e81'    // Darkest text
  },
  
  // Color palette for different schedules (up to 6 schedules supported)
  scheduleColors: [
    '#6366f1', // Primary periwinkle
    '#8b5cf6', // Purple - complementary to periwinkle
    '#06b6d4', // Cyan - cool, professional
    '#10b981', // Emerald - success/productivity
    '#f59e0b', // Amber - attention/priority
    '#ef4444'  // Red - urgent/important
  ]
};

// Time slots for the weekly schedule grid (30-minute intervals)
// Covers typical working hours plus early morning and evening
export const timeSlots = [
  '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', 
  '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', 
  '21:00'
];

// Day names for calendar headers
export const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday'
];

// Abbreviated day names for compact displays
export const dayNamesShort = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

// Local storage keys for data persistence
// Organized by data type for easy management
export const storageKeys = {
  // Schedule-related data
  schedules: 'plannerSchedules',
  
  // Todo list data by time period
  dayTodos: 'plannerDayTodos',
  weekTodos: 'plannerWeekTodos',
  monthTodos: 'plannerMonthTodos',
  yearTodos: 'plannerYearTodos',
  goals: 'plannerGoals',
  reminders: 'plannerReminders',
  
  // Recurring todos and their completion states
  recurringTodos: 'plannerRecurringTodos',
  recurringCompletionState: 'plannerRecurringCompletionState',
  
  // Application state
  progressStats: 'plannerProgressStats',
  layoutSections: 'plannerLayoutSections',
  calendarEvents: 'plannerCalendarEvents'
};

// Default layout sections configuration
// Each section can be toggled on/off for ADHD-friendly customization
export const defaultLayoutSections = [
  { id: 'day', title: 'Day To-Do', type: 'todo', enabled: true },
  { id: 'week', title: 'Week To-Do', type: 'todo', enabled: true },
  { id: 'month', title: 'Month To-Do', type: 'todo', enabled: true },
  { id: 'year', title: 'Year To-Do', type: 'todo', enabled: true },
  { id: 'goals', title: 'Goals', type: 'todo', enabled: true },
  { id: 'reminders', title: 'Reminders', type: 'todo', enabled: true }
];

// Default progress statistics structure
export const defaultProgressStats = {
  todosCompleted: 0,      // Total regular todos completed
  recurringCompleted: 0,  // Total recurring todos completed
  totalTodos: 0,          // Total todos created
  totalRecurring: 0,      // Total recurring todos created
  streakDays: 0,          // Consecutive days of activity
  lastActiveDate: new Date().toDateString() // Last day user was active
};

// Default recurring todos structure
export const defaultRecurringTodos = {
  day: [],     // Daily recurring tasks
  week: [],    // Weekly recurring tasks  
  month: [],   // Monthly recurring tasks
  year: []     // Yearly recurring tasks
};

// Layout preset configurations for quick setup
export const layoutPresets = {
  // Show all available sections
  showAll: {
    name: 'Show All',
    sections: ['day', 'week', 'month', 'year', 'goals', 'reminders']
  },
  
  // Minimal setup to reduce cognitive load
  minimalFocus: {
    name: 'Minimal Focus', 
    sections: ['day', 'week', 'goals']
  },
  
  // Student-focused layout
  studentMode: {
    name: 'Student Mode',
    sections: ['day', 'week', 'month', 'reminders']
  }
};

// Maximum number of schedules allowed
export const maxSchedules = 6;

// Drag operation types for event manipulation
export const dragModes = {
  MOVE: 'move',           // Moving event to different time/date
  EXTEND_UP: 'extend-up', // Extending event upward
  EXTEND_DOWN: 'extend-down' // Extending event downward
};

// Animation and interaction timings
export const timings = {
  CLICK_TIMEOUT: 150,     // ms to wait to distinguish click vs drag
  TRANSITION_DURATION: 200, // ms for CSS transitions
  ANIMATION_DELAY: 100    // ms delay for staggered animations
};

// Grid layout configurations
export const gridConfig = {
  CALENDAR_COLUMNS: 8,    // Time column + 7 day columns
  TODO_COLUMNS: 3,        // 3 columns for todo sections
  MIN_CELL_HEIGHT: 32     // Minimum height for calendar cells
};