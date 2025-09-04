/**
 * useSchedules Custom Hook
 * 
 * Manages the multi-schedule system for the weekly planner.
 * Handles schedule creation, deletion, visibility toggling, and event management
 * across multiple overlaid schedules.
 * 
 * Features:
 * - Multiple schedule support (up to 6 schedules)
 * - Schedule visibility toggles for overlay system
 * - Color-coded schedules
 * - Active schedule management
 * - Event CRUD operations
 * - Persistent storage via localStorage
 */


// imports
import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { colors, maxSchedules, storageKeys } from '../Constants/index.js';
import { getEventKey } from '../Utilities/EventUtils.js';


/**
 * Default schedule structure
 * Every app instance starts with a main schedule that cannot be deleted
 */


const defaultSchedules = [
    {
      id: 'main',
      name: 'Main Schedule',
      events: {},
      isVisible: true,
      color: colors.scheduleColors[0]
    }
  ];
  
  /**
   * Custom hook for managing multiple schedules
   * 
   * @returns {Object} Object containing schedule state and management functions
   */
  export const useSchedules = () => {
    // Persist schedules to localStorage
    const [schedules, setSchedules] = useLocalStorage(
      storageKeys.schedules, 
      defaultSchedules,
      {
        validator: (data) => {
          // Validate that data is an array of valid schedule objects
          return Array.isArray(data) && 
                 data.every(schedule => 
                   schedule.id && 
                   schedule.name && 
                   typeof schedule.events === 'object' &&
                   typeof schedule.isVisible === 'boolean' &&
                   schedule.color
                 );
        }
      }
    );
  
    // Track which schedule is currently active for adding new events
    const [activeScheduleId, setActiveScheduleId] = useState('main');
  
    // State for schedule management modal
    const [showScheduleManager, setShowScheduleManager] = useState(false);
    const [newScheduleName, setNewScheduleName] = useState('');
  
    /**
     * Gets the currently active schedule object
     * Fallbacks to first schedule if active schedule is not found
     */
    const getActiveSchedule = useCallback(() => {
      return schedules.find(s => s.id === activeScheduleId) || schedules[0];
    }, [schedules, activeScheduleId]);
  
    /**
     * Gets all visible schedules for display purposes
     */
    const getVisibleSchedules = useCallback(() => {
      return schedules.filter(schedule => schedule.isVisible);
    }, [schedules]);
  
    /**
     * Creates a new schedule with validation
     * 
     * @param {string} name - Name for the new schedule
     * @returns {boolean} True if schedule was created successfully
     */
    const createSchedule = useCallback((name = newScheduleName) => {
      const trimmedName = name.trim();
      
      // Validate input
      if (!trimmedName) {
        console.warn('Schedule name cannot be empty');
        return false;
      }
  
      // Check if we've reached the maximum number of schedules
      if (schedules.length >= maxSchedules) {
        console.warn(`Maximum of ${maxSchedules} schedules allowed`);
        return false;
      }
  
      // Check for duplicate names
      if (schedules.some(schedule => 
        schedule.name.toLowerCase() === trimmedName.toLowerCase()
      )) {
        console.warn('Schedule name already exists');
        return false;
      }
  
      // Create new schedule object
      const newSchedule = {
        id: Date.now().toString(), // Simple unique ID generation
        name: trimmedName,
        events: {},
        isVisible: true,
        color: colors.scheduleColors[schedules.length % colors.scheduleColors.length]
      };
  
      // Add to schedules array
      setSchedules(prev => [...prev, newSchedule]);
      setNewScheduleName('');
      
      return true;
    }, [schedules, newScheduleName, setSchedules]);
  
    /**
     * Deletes a schedule with validation
     * Cannot delete the main schedule or if it's the only schedule
     * 
     * @param {string} scheduleId - ID of schedule to delete
     * @returns {boolean} True if schedule was deleted successfully
     */
    const deleteSchedule = useCallback((scheduleId) => {
      // Prevent deletion of main schedule
      if (scheduleId === 'main') {
        console.warn('Cannot delete main schedule');
        return false;
      }
  
      // Prevent deletion if it's the only schedule
      if (schedules.length <= 1) {
        console.warn('Cannot delete the only remaining schedule');
        return false;
      }
  
      // Remove the schedule
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  
      // If deleted schedule was active, switch to main
      if (activeScheduleId === scheduleId) {
        setActiveScheduleId('main');
      }
  
      return true;
    }, [schedules.length, setSchedules, activeScheduleId]);
  
    /**
     * Toggles the visibility of a schedule for overlay system
     * 
     * @param {string} scheduleId - ID of schedule to toggle
     */
    const toggleScheduleVisibility = useCallback((scheduleId) => {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, isVisible: !schedule.isVisible }
          : schedule
      ));
    }, [setSchedules]);
  
    /**
     * Renames a schedule with validation
     * 
     * @param {string} scheduleId - ID of schedule to rename
     * @param {string} newName - New name for the schedule
     * @returns {boolean} True if schedule was renamed successfully
     */
    const renameSchedule = useCallback((scheduleId, newName) => {
      const trimmedName = newName.trim();
      
      if (!trimmedName) {
        console.warn('Schedule name cannot be empty');
        return false;
      }
  
      // Check for duplicate names (excluding current schedule)
      if (schedules.some(schedule => 
        schedule.id !== scheduleId && 
        schedule.name.toLowerCase() === trimmedName.toLowerCase()
      )) {
        console.warn('Schedule name already exists');
        return false;
      }
  
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, name: trimmedName }
          : schedule
      ));
  
      return true;
    }, [schedules, setSchedules]);
  
    /**
     * Updates events for a specific schedule
     * 
     * @param {string} scheduleId - ID of schedule to update
     * @param {Object} events - New events object
     */
    const updateScheduleEvents = useCallback((scheduleId, events) => {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, events }
          : schedule
      ));
    }, [setSchedules]);
  
    /**
     * Adds an event to the active schedule
     * 
     * @param {Date} date - Date of the event
     * @param {string} time - Time slot of the event
     * @param {string} eventText - Text content of the event
     * @returns {boolean} True if event was added successfully
     */
    const addEvent = useCallback((date, time, eventText) => {
      if (!eventText.trim()) {
        console.warn('Event text cannot be empty');
        return false;
      }
  
      const activeSchedule = getActiveSchedule();
      const eventKey = getEventKey(date, time);
      
      const newEvents = { 
        ...activeSchedule.events, 
        [eventKey]: eventText.trim() 
      };
  
      updateScheduleEvents(activeSchedule.id, newEvents);
      return true;
    }, [getActiveSchedule, updateScheduleEvents]);
  
    /**
     * Updates an existing event
     * 
     * @param {string} eventKey - Key of the event to update
     * @param {string} scheduleId - ID of the schedule containing the event
     * @param {string} newText - New text content for the event
     * @returns {boolean} True if event was updated successfully
     */
    const updateEvent = useCallback((eventKey, scheduleId, newText) => {
      if (!newText.trim()) {
        console.warn('Event text cannot be empty');
        return false;
      }
  
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) {
        console.warn('Schedule not found');
        return false;
      }
  
      const currentEvent = schedule.events[eventKey];
      const updatedEvent = typeof currentEvent === 'object' 
        ? { ...currentEvent, text: newText.trim() }
        : newText.trim();
  
      const newEvents = { 
        ...schedule.events, 
        [eventKey]: updatedEvent
      };
  
      updateScheduleEvents(scheduleId, newEvents);
      return true;
    }, [schedules, updateScheduleEvents]);
  
    /**
     * Removes an event from a schedule
     * 
     * @param {string} eventKey - Key of the event to remove
     * @param {string} scheduleId - ID of the schedule containing the event
     * @returns {boolean} True if event was removed successfully
     */
    const removeEvent = useCallback((eventKey, scheduleId) => {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) {
        console.warn('Schedule not found');
        return false;
      }
  
      const newEvents = { ...schedule.events };
      delete newEvents[eventKey];
      
      updateScheduleEvents(scheduleId, newEvents);
      return true;
    }, [schedules, updateScheduleEvents]);
  
    /**
     * Moves an event from one time slot to another
     * 
     * @param {string} oldEventKey - Current event key
     * @param {string} scheduleId - Schedule ID
     * @param {Date} newDate - New date for the event
     * @param {string} newTime - New time slot for the event
     * @returns {boolean} True if event was moved successfully
     */
    const moveEvent = useCallback((oldEventKey, scheduleId, newDate, newTime) => {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) {
        console.warn('Schedule not found');
        return false;
      }
  
      const event = schedule.events[oldEventKey];
      if (!event) {
        console.warn('Event not found');
        return false;
      }
  
      const newEventKey = getEventKey(newDate, newTime);
      const newEvents = { ...schedule.events };
      
      // Remove old event and add at new location
      delete newEvents[oldEventKey];
      newEvents[newEventKey] = event;
  
      updateScheduleEvents(scheduleId, newEvents);
      return true;
    }, [schedules, updateScheduleEvents]);
  
    /**
     * Gets statistics about all schedules
     */
    const getScheduleStats = useMemo(() => {
      const stats = {
        totalSchedules: schedules.length,
        visibleSchedules: schedules.filter(s => s.isVisible).length,
        totalEvents: 0,
        eventsBySchedule: {}
      };
  
      schedules.forEach(schedule => {
        const eventCount = Object.keys(schedule.events).length;
        stats.totalEvents += eventCount;
        stats.eventsBySchedule[schedule.id] = {
          name: schedule.name,
          eventCount,
          isVisible: schedule.isVisible
        };
      });
  
      return stats;
    }, [schedules]);
  
    // Return all state and functions needed by components
    return {
      // State
      schedules,
      activeScheduleId,
      showScheduleManager,
      newScheduleName,
      
      // Setters for state
      setActiveScheduleId,
      setShowScheduleManager,
      setNewScheduleName,
      
      // Schedule management functions
      getActiveSchedule,
      getVisibleSchedules,
      createSchedule,
      deleteSchedule,
      toggleScheduleVisibility,
      renameSchedule,
      updateScheduleEvents,
      
      // Event management functions
      addEvent,
      updateEvent,
      removeEvent,
      moveEvent,
      
      // Computed values
      getScheduleStats,
      
      // Validation helpers
      canCreateSchedule: schedules.length < maxSchedules,
      canDeleteSchedule: (scheduleId) => scheduleId !== 'main' && schedules.length > 1
    };
  };