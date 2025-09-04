/**
 * useDragAndDrop Custom Hook
 * 
 * Manages complex drag and drop interactions for calendar events.
 * Supports moving events, extending event duration, and provides
 * visual feedback during drag operations.
 * 
 * Features:
 * - Event moving between time slots and days
 * - Event duration extension (up/down)
 * - Click vs. drag detection
 * - Visual feedback during drag
 * - Multi-slot event support
 * - Collision detection and prevention
 */


// imports
import { useState, useEffect, useCallback, useRef } from 'react';
import { dragModes, timings } from '../Constants/index.js';
import { getTimeIndex, createExtendedEvent } from '../Utilities/EventUtils.js';


/**
 * Custom hook for managing drag and drop interactions
 * 
 * @param {Object} schedules - Array of schedule objects
 * @param {Function} updateScheduleEvents - Function to update schedule events
 * @param {Function} onEventEdit - Callback for when user wants to edit an event
 * @returns {Object} Drag and drop state and handlers
 */


export const useDragAndDrop = (schedules, updateScheduleEvents, onEventEdit) => {
    // Drag operation state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [dragMode, setDragMode] = useState(null);
    
    // Visual feedback state
    const [hoveredEvent, setHoveredEvent] = useState(null);
    
    // Click detection state
    const [clickTimeout, setClickTimeout] = useState(null);
    const clickTimeoutRef = useRef(null);
  
    /**
     * Initiates a drag operation
     * 
     * @param {Date} date - Date of the event being dragged
     * @param {string} time - Time slot of the event
     * @param {MouseEvent} mouseEvent - Mouse event that triggered the drag
     * @param {Object} eventData - Event data object
     * @param {string} mode - Drag mode (move, extend-up, extend-down)
     */
    const handleDragStart = useCallback((date, time, mouseEvent, eventData, mode = dragModes.MOVE) => {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      
      if (!eventData) {
        console.warn('No event data provided for drag start');
        return;
      }
  
      // Clear any pending click timeout to prevent edit mode
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        setClickTimeout(null);
      }
      
      // Determine original time for multi-slot events
      const originalTime = (typeof eventData.event === 'object' && eventData.event.startTime) 
        ? eventData.event.startTime 
        : time;
          
      // Set drag state
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
  
      // Add visual feedback to body during drag
      document.body.style.userSelect = 'none';
      document.body.style.cursor = mode === dragModes.MOVE ? 'move' : 'ns-resize';
    }, []);
  
    /**
     * Handles mouse events on events to distinguish clicks from drags
     * 
     * @param {Date} date - Date of the event
     * @param {string} time - Time slot of the event
     * @param {MouseEvent} mouseEvent - Mouse event
     * @param {Object} eventData - Event data object
     */
    const handleEventClick = useCallback((date, time, mouseEvent, eventData) => {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      
      // Set a timeout to detect if this is a click or drag start
      const timeout = setTimeout(() => {
        // If we get here, it's a click not a drag
        if (onEventEdit) {
          onEventEdit(eventData);
        }
        clickTimeoutRef.current = null;
        setClickTimeout(null);
      }, timings.CLICK_TIMEOUT);
      
      clickTimeoutRef.current = timeout;
      setClickTimeout(timeout);
    }, [onEventEdit]);
  
    /**
     * Updates drag end position during drag operation
     * 
     * @param {Date} date - Current date under cursor
     * @param {string} time - Current time slot under cursor
     */
    const handleDragOver = useCallback((date, time) => {
      if (isDragging && dragStart) {
        // Clear click timeout if dragging starts
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
          setClickTimeout(null);
        }
        
        setDragEnd({ date, time });
      }
    }, [isDragging, dragStart]);
  
    /**
     * Completes the drag operation and updates the event
     */
    const handleDragEnd = useCallback(() => {
      if (!isDragging || !dragStart || !dragEnd || !dragEnd.date || !dragEnd.time) {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        setDragMode(null);
        return;
      }
  
      const originalTimeIndex = getTimeIndex(dragStart.originalTime || dragStart.time);
      const endTimeIndex = getTimeIndex(dragEnd.time);
      
      const schedule = schedules.find(s => s.id === dragStart.scheduleId);
      if (!schedule) {
        console.warn('Schedule not found for drag operation');
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        setDragMode(null);
        return;
      }
  
      const eventText = typeof dragStart.event === 'object' ? dragStart.event.text : dragStart.event;
      const newEvents = { ...schedule.events };
      
      // Remove the original event
      delete newEvents[dragStart.eventKey];
      
      // Determine the type of drag operation
      const isSameDate = dragStart.date.toDateString() === dragEnd.date.toDateString();
      const dragStartTime = dragStart.originalTime || dragStart.time;
      const isExtending = isSameDate && 
                         dragStartTime === dragStart.time && 
                         dragMode === dragModes.EXTEND_DOWN &&
                         endTimeIndex > originalTimeIndex;
      
      try {
        if (isExtending) {
          // Extending: create a multi-slot event from original time to drag end time
          const newEventKey = `${dragStart.date.toDateString()}-${dragStartTime}`;
          newEvents[newEventKey] = createExtendedEvent(eventText, dragStartTime, dragEnd.time);
        } else {
          // Moving: create event at new location
          const newEventKey = `${dragEnd.date.toDateString()}-${dragEnd.time}`;
          
          if (typeof dragStart.event === 'object' && dragStart.event.startTime && dragStart.event.endTime) {
            // Preserve duration for multi-slot events when moving
            const originalStartIndex = getTimeIndex(dragStart.event.startTime);
            const originalEndIndex = getTimeIndex(dragStart.event.endTime);
            const duration = originalEndIndex - originalStartIndex;
            const newEndIndex = Math.min(endTimeIndex + duration, 30); // Max time slot index
            
            if (duration > 0 && newEndIndex < 31) { // Ensure we don't exceed time slots
              const endTime = ['6:00', '6:30', '7:00', '7:30', '8:00', '8:30', 
                '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', 
                '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
                '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
                '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', 
                '21:00'][newEndIndex];
              
              newEvents[newEventKey] = createExtendedEvent(eventText, dragEnd.time, endTime);
            } else {
              // Fallback to single slot if duration calculations fail
              newEvents[newEventKey] = eventText;
            }
          } else {
            // Single slot event
            newEvents[newEventKey] = eventText;
          }
        }
        
        // Update the schedule with new events
        updateScheduleEvents(dragStart.scheduleId, newEvents);
      } catch (error) {
        console.error('Error updating events during drag operation:', error);
        // Restore original event if update fails
        newEvents[dragStart.eventKey] = dragStart.event;
        updateScheduleEvents(dragStart.scheduleId, newEvents);
      }
      
      // Reset drag state
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
      setDragMode(null);
    }, [isDragging, dragStart, dragEnd, schedules, updateScheduleEvents, dragMode]);
  
    /**
     * Determines if a cell should show drag feedback
     * 
     * @param {Date} date - Cell date
     * @param {string} time - Cell time
     * @returns {Object} Object with visual state flags
     */
    const getCellDragState = useCallback((date, time) => {
      if (!isDragging || !dragStart || !dragEnd) {
        return {
          isDragTarget: false,
          isDragPath: false,
          isDragSource: false
        };
      }
  
      const isDragTarget = dragEnd.date.toDateString() === date.toDateString() && 
                          dragEnd.time === time;
      
      const isDragSource = dragStart.date.toDateString() === date.toDateString() &&
                          ((dragMode === dragModes.MOVE && dragStart.time === time) ||
                           (dragMode === dragModes.EXTEND_DOWN && (dragStart.originalTime || dragStart.time) === time) ||
                           (dragMode === dragModes.EXTEND_UP && (dragStart.originalTime || dragStart.time) === time));
  
      const isDragPath = dragStart.date.toDateString() === date.toDateString() &&
                        dragEnd.date.toDateString() === date.toDateString() &&
                        ((dragMode === dragModes.EXTEND_DOWN && 
                          getTimeIndex(time) >= getTimeIndex(dragStart.originalTime || dragStart.time) &&
                          getTimeIndex(time) <= getTimeIndex(dragEnd.time)) ||
                         (dragMode === dragModes.EXTEND_UP &&
                          getTimeIndex(time) >= getTimeIndex(dragEnd.time) &&
                          getTimeIndex(time) <= getTimeIndex(dragStart.originalTime || dragStart.time)));
  
      return {
        isDragTarget,
        isDragPath,
        isDragSource
      };
    }, [isDragging, dragStart, dragEnd, dragMode]);
  
    /**
     * Gets appropriate cursor style based on drag mode
     */
    const getDragCursor = useCallback(() => {
      if (!isDragging) return 'default';
      
      switch (dragMode) {
        case dragModes.MOVE:
          return 'move';
        case dragModes.EXTEND_UP:
        case dragModes.EXTEND_DOWN:
          return 'ns-resize';
        default:
          return 'move';
      }
    }, [isDragging, dragMode]);
  
    /**
     * Gets drag status message for user feedback
     */
    const getDragStatusMessage = useCallback(() => {
      if (!isDragging || !dragStart || !dragEnd) return null;
  
      switch (dragMode) {
        case dragModes.EXTEND_DOWN:
          return '⬇️ Extending event down...';
        case dragModes.EXTEND_UP:
          return '⬆️ Extending event up...';
        case dragModes.MOVE:
          return '📅 Moving event...';
        default:
          return '🔄 Dragging...';
      }
    }, [isDragging, dragStart, dragEnd, dragMode]);
  
    // Global mouse event handlers for drag completion
    useEffect(() => {
      const handleGlobalMouseUp = (e) => {
        if (isDragging) {
          handleDragEnd();
        }
        
        // Clear any pending click timeout
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
          setClickTimeout(null);
        }
      };
  
      const handleGlobalMouseMove = (e) => {
        if (isDragging) {
          // Prevent text selection during drag
          e.preventDefault();
        }
      };
  
      // Add event listeners when dragging
      if (isDragging) {
        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('mousemove', handleGlobalMouseMove);
      }
  
      // Always listen for mouseup to clear click timeouts
      document.addEventListener('mouseup', handleGlobalMouseUp);
  
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }, [isDragging, handleDragEnd]);
  
    // Cleanup effect for component unmount
    useEffect(() => {
      return () => {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }
      };
    }, []);
  
    // Return all drag and drop state and handlers
    return {
      // State
      isDragging,
      dragStart,
      dragEnd,
      dragMode,
      hoveredEvent,
      
      // Event handlers
      handleDragStart,
      handleEventClick,
      handleDragOver,
      handleDragEnd,
      
      // Visual state helpers
      getCellDragState,
      getDragCursor,
      getDragStatusMessage,
      
      // Hover state
      setHoveredEvent,
      
      // Utility functions
      isEventHovered: useCallback((eventKey, eventIndex) => {
        return hoveredEvent === `${eventKey}-${eventIndex}`;
      }, [hoveredEvent]),
      
      // Drag validation
      canDragEvent: useCallback((eventData) => {
        return eventData && eventData.scheduleId && eventData.key;
      }, []),
      
      // Reset functions
      resetDragState: useCallback(() => {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        setDragMode(null);
        setHoveredEvent(null);
        
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
        }
        
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }, [])
    };
  };