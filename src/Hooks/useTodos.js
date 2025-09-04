/**
 * useTodos Custom Hook
 * 
 * Manages todo lists across different time periods (day, week, month, year)
 * and categories (goals, reminders). Also handles recurring todos with
 * completion state tracking and progress statistics.
 * 
 * Features:
 * - Multiple todo categories with separate storage
 * - Recurring todos (daily, weekly, monthly, yearly)
 * - Progress tracking and streak calculation
 * - Batch operations and filtering
 * - LocalStorage persistence
 * - ADHD-friendly layout customization
 */


// imports
import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage, useLocalStorageObject } from './useLocalStorage.js';
import { storageKeys, defaultProgressStats, defaultRecurringTodos, defaultLayoutSections } from '../Constants/index.js';


/**
 * Custom hook for managing todos and recurring tasks
 * 
 * @returns {Object} Object containing todo state and management functions
 */


export const useTodos = () => {
    // Individual todo lists for different time periods
    const [dayTodos, setDayTodos] = useLocalStorage(storageKeys.dayTodos, []);
    const [weekTodos, setWeekTodos] = useLocalStorage(storageKeys.weekTodos, []);
    const [monthTodos, setMonthTodos] = useLocalStorage(storageKeys.monthTodos, []);
    const [yearTodos, setYearTodos] = useLocalStorage(storageKeys.yearTodos, []);
    const [goals, setGoals] = useLocalStorage(storageKeys.goals, []);
    const [reminders, setReminders] = useLocalStorage(storageKeys.reminders, []);
  
    // Recurring todos storage and completion tracking
    const [recurringTodos, setRecurringTodos] = useLocalStorage(
      storageKeys.recurringTodos, 
      defaultRecurringTodos
    );
    
    const [recurringCompletionState, setRecurringCompletionState] = useLocalStorage(
      storageKeys.recurringCompletionState, 
      {}
    );
  
    // Progress tracking for motivation and statistics
    const [progressStats, setProgressStats] = useLocalStorage(
      storageKeys.progressStats, 
      defaultProgressStats
    );
  
    // Layout customization for ADHD-friendly experience
    const [layoutSections, setLayoutSections] = useLocalStorage(
      storageKeys.layoutSections, 
      defaultLayoutSections
    );
  
    // Input states for adding new todos
    const [newTodoInputs, setNewTodoInputs] = useState({
      day: '',
      week: '',
      month: '',
      year: '',
      goal: '',
      reminder: ''
    });
  
    // Input states for adding new recurring todos
    const [newRecurringInputs, setNewRecurringInputs] = useState({
      day: '',
      week: '',
      month: '',
      year: ''
    });
  
    /**
     * Gets the appropriate setter function for a todo type
     * 
     * @param {string} type - Todo type (day, week, month, year, goal, reminder)
     * @returns {Function} Setter function for the todo type
     */
    const getTodoSetter = useCallback((type) => {
      const setters = {
        day: setDayTodos,
        week: setWeekTodos,
        month: setMonthTodos,
        year: setYearTodos,
        goal: setGoals,
        reminder: setReminders
      };
      return setters[type];
    }, [setDayTodos, setWeekTodos, setMonthTodos, setYearTodos, setGoals, setReminders]);
  
    /**
     * Gets the todo list for a specific type
     * 
     * @param {string} type - Todo type
     * @returns {Array} Array of todos for the specified type
     */
    const getTodoList = useCallback((type) => {
      const lists = {
        day: dayTodos,
        week: weekTodos,
        month: monthTodos,
        year: yearTodos,
        goal: goals,
        reminder: reminders
      };
      return lists[type] || [];
    }, [dayTodos, weekTodos, monthTodos, yearTodos, goals, reminders]);
  
    /**
     * Updates progress statistics when todos are completed
     * 
     * @param {string} type - Type of completion ('todo' or 'recurring')
     * @param {string} action - Action performed ('complete' or 'uncomplete')
     */
    const updateProgressStats = useCallback((type, action) => {
      setProgressStats(prev => {
        const today = new Date().toDateString();
        let newStats = { ...prev };
        
        // Update completion counters
        if (action === 'complete') {
          if (type === 'todo') {
            newStats.todosCompleted += 1;
          } else if (type === 'recurring') {
            newStats.recurringCompleted += 1;
          }
        } else if (action === 'uncomplete') {
          if (type === 'todo') {
            newStats.todosCompleted = Math.max(0, newStats.todosCompleted - 1);
          } else if (type === 'recurring') {
            newStats.recurringCompleted = Math.max(0, newStats.recurringCompleted - 1);
          }
        }
        
        // Update activity streak
        if (prev.lastActiveDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (prev.lastActiveDate === yesterday.toDateString()) {
            // Consecutive day - increment streak
            newStats.streakDays += 1;
          } else {
            // Gap in activity - reset streak
            newStats.streakDays = 1;
          }
          newStats.lastActiveDate = today;
        }
        
        return newStats;
      });
    }, [setProgressStats]);
  
    /**
     * Adds a new todo item
     * 
     * @param {string} type - Todo type (day, week, etc.)
     * @param {string} text - Optional custom text (uses input state if not provided)
     * @returns {boolean} True if todo was added successfully
     */
    const addTodo = useCallback((type, text = null) => {
      const todoText = text || newTodoInputs[type];
      
      if (!todoText || !todoText.trim()) {
        console.warn('Todo text cannot be empty');
        return false;
      }
  
      const setter = getTodoSetter(type);
      if (!setter) {
        console.warn(`Invalid todo type: ${type}`);
        return false;
      }
  
      // Create new todo object
      const newTodo = {
        id: Date.now() + Math.random(), // Ensure uniqueness
        text: todoText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
  
      // Add to appropriate list
      setter(prev => [...prev, newTodo]);
  
      // Clear input if we used the input state
      if (!text) {
        setNewTodoInputs(prev => ({ ...prev, [type]: '' }));
      }
  
      return true;
    }, [newTodoInputs, getTodoSetter]);
  
    /**
     * Toggles the completion status of a todo
     * 
     * @param {string} type - Todo type
     * @param {number} id - Todo ID
     * @returns {boolean} True if todo was toggled successfully
     */
    const toggleTodo = useCallback((type, id) => {
      const setter = getTodoSetter(type);
      if (!setter) {
        console.warn(`Invalid todo type: ${type}`);
        return false;
      }
  
      let wasCompleted = false;
      let nowCompleted = false;
  
      setter(prev => {
        return prev.map(todo => {
          if (todo.id === id) {
            wasCompleted = todo.completed;
            nowCompleted = !todo.completed;
            
            return {
              ...todo,
              completed: nowCompleted,
              completedAt: nowCompleted ? new Date().toISOString() : null
            };
          }
          return todo;
        });
      });
  
      // Update progress statistics
      if (!wasCompleted && nowCompleted) {
        updateProgressStats('todo', 'complete');
      } else if (wasCompleted && !nowCompleted) {
        updateProgressStats('todo', 'uncomplete');
      }
  
      return true;
    }, [getTodoSetter, updateProgressStats]);
  
    /**
     * Removes a todo item
     * 
     * @param {string} type - Todo type
     * @param {number} id - Todo ID
     * @returns {boolean} True if todo was removed successfully
     */
    const removeTodo = useCallback((type, id) => {
      const setter = getTodoSetter(type);
      if (!setter) {
        console.warn(`Invalid todo type: ${type}`);
        return false;
      }
  
      setter(prev => prev.filter(todo => todo.id !== id));
      return true;
    }, [getTodoSetter]);
  
    /**
     * Adds a new recurring todo
     * 
     * @param {string} type - Recurring type (day, week, month, year)
     * @param {string} text - Optional custom text
     * @returns {boolean} True if recurring todo was added successfully
     */
    const addRecurringTodo = useCallback((type, text = null) => {
      const todoText = text || newRecurringInputs[type];
      
      if (!todoText || !todoText.trim()) {
        console.warn('Recurring todo text cannot be empty');
        return false;
      }
  
      if (!['day', 'week', 'month', 'year'].includes(type)) {
        console.warn(`Invalid recurring todo type: ${type}`);
        return false;
      }
  
      const newRecurringTodo = {
        id: Date.now() + Math.random(),
        text: todoText.trim(),
        createdAt: new Date().toISOString()
      };
  
      setRecurringTodos(prev => ({
        ...prev,
        [type]: [...prev[type], newRecurringTodo]
      }));
  
      // Clear input if we used the input state
      if (!text) {
        setNewRecurringInputs(prev => ({ ...prev, [type]: '' }));
      }
  
      return true;
    }, [newRecurringInputs, setRecurringTodos]);
  
    /**
     * Removes a recurring todo
     * 
     * @param {string} type - Recurring type
     * @param {number} id - Recurring todo ID
     * @returns {boolean} True if recurring todo was removed successfully
     */
    const removeRecurringTodo = useCallback((type, id) => {
      if (!['day', 'week', 'month', 'year'].includes(type)) {
        console.warn(`Invalid recurring todo type: ${type}`);
        return false;
      }
  
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
  
      return true;
    }, [setRecurringTodos, setRecurringCompletionState]);
  
    /**
     * Toggles completion state of a recurring todo
     * 
     * @param {string} type - Recurring type
     * @param {number} id - Recurring todo ID
     * @returns {boolean} True if recurring todo was toggled successfully
     */
    const toggleRecurringTodo = useCallback((type, id) => {
      if (!['day', 'week', 'month', 'year'].includes(type)) {
        console.warn(`Invalid recurring todo type: ${type}`);
        return false;
      }
  
      const key = `${type}-${id}`;
      const wasCompleted = recurringCompletionState[key] || false;
      const nowCompleted = !wasCompleted;
  
      setRecurringCompletionState(prev => ({
        ...prev,
        [key]: nowCompleted
      }));
  
      // Update progress statistics
      if (!wasCompleted && nowCompleted) {
        updateProgressStats('recurring', 'complete');
      } else if (wasCompleted && !nowCompleted) {
        updateProgressStats('recurring', 'uncomplete');
      }
  
      return true;
    }, [recurringCompletionState, setRecurringCompletionState, updateProgressStats]);
  
    /**
     * Gets active reminders (uncompleted reminders)
     */
    const getActiveReminders = useCallback(() => {
      return reminders.filter(reminder => !reminder.completed);
    }, [reminders]);
  
    /**
     * Toggles visibility of a layout section
     * 
     * @param {string} sectionId - Section ID to toggle
     */
    const toggleLayoutSection = useCallback((sectionId) => {
      setLayoutSections(prev => 
        prev.map(section => 
          section.id === sectionId 
            ? { ...section, enabled: !section.enabled } 
            : section
        )
      );
    }, [setLayoutSections]);
  
    /**
     * Applies a layout preset
     * 
     * @param {string[]} enabledSections - Array of section IDs to enable
     */
    const applyLayoutPreset = useCallback((enabledSections) => {
      setLayoutSections(prev => prev.map(section => ({
        ...section,
        enabled: enabledSections.includes(section.id)
      })));
    }, [setLayoutSections]);
  
    /**
     * Gets completion statistics for all todos
     */
    const getCompletionStats = useMemo(() => {
      const stats = {
        totalTodos: 0,
        completedTodos: 0,
        totalRecurring: 0,
        completedRecurring: 0,
        completionPercentage: 0,
        recurringCompletionPercentage: 0
      };
  
      // Calculate regular todo stats
      [dayTodos, weekTodos, monthTodos, yearTodos, goals, reminders].forEach(todoList => {
        stats.totalTodos += todoList.length;
        stats.completedTodos += todoList.filter(todo => todo.completed).length;
      });
  
      // Calculate recurring todo stats
      Object.values(recurringTodos).forEach(recurringList => {
        stats.totalRecurring += recurringList.length;
      });
  
      stats.completedRecurring = Object.values(recurringCompletionState)
        .filter(Boolean).length;
  
      // Calculate percentages
      if (stats.totalTodos > 0) {
        stats.completionPercentage = Math.round(
          (stats.completedTodos / stats.totalTodos) * 100
        );
      }
  
      if (stats.totalRecurring > 0) {
        stats.recurringCompletionPercentage = Math.round(
          (stats.completedRecurring / stats.totalRecurring) * 100
        );
      }
  
      return stats;
    }, [dayTodos, weekTodos, monthTodos, yearTodos, goals, reminders, recurringTodos, recurringCompletionState]);
  
    // Return all state and functions needed by components
    return {
      // Todo lists
      dayTodos,
      weekTodos,
      monthTodos,
      yearTodos,
      goals,
      reminders,
      
      // Recurring todos
      recurringTodos,
      recurringCompletionState,
      
      // Input states
      newTodoInputs,
      setNewTodoInputs,
      newRecurringInputs,
      setNewRecurringInputs,
      
      // Progress and layout
      progressStats,
      layoutSections,
      
      // Todo management functions
      addTodo,
      toggleTodo,
      removeTodo,
      getTodoList,
      
      // Recurring todo functions
      addRecurringTodo,
      removeRecurringTodo,
      toggleRecurringTodo,
      
      // Utility functions
      getActiveReminders,
      getCompletionStats,
      
      // Layout functions
      toggleLayoutSection,
      applyLayoutPreset,
      
      // Batch operations
      clearCompletedTodos: useCallback((type) => {
        const setter = getTodoSetter(type);
        if (setter) {
          setter(prev => prev.filter(todo => !todo.completed));
        }
      }, [getTodoSetter]),
      
      // Reset functions for testing/cleanup
      resetAllTodos: useCallback(() => {
        setDayTodos([]);
        setWeekTodos([]);
        setMonthTodos([]);
        setYearTodos([]);
        setGoals([]);
        setReminders([]);
        setRecurringTodos(defaultRecurringTodos);
        setRecurringCompletionState({});
        setProgressStats(defaultProgressStats);
      }, [setDayTodos, setWeekTodos, setMonthTodos, setYearTodos, setGoals, setReminders, setRecurringTodos, setRecurringCompletionState, setProgressStats])
    };
  };