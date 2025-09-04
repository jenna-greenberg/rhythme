/**
 * useLocalStorage Custom Hook
 * 
 * A robust React hook for persisting state to localStorage with error handling,
 * automatic serialization/deserialization, and type safety.
 * 
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Error handling with graceful fallbacks
 * - Lazy initial state evaluation
 * - Synchronization across browser tabs (optional)
 * - TypeScript-friendly (works with JavaScript too)
 */


// imports
import { useState, useEffect, useCallback, useRef } from 'react';


/**
 * Custom hook for persisting state to localStorage
 * 
 * @param {string} key - localStorage key to store the value under
 * @param {any} initialValue - Initial value or function that returns initial value
 * @param {Object} options - Configuration options
 * @param {boolean} options.serialize - Whether to JSON serialize the value (default: true)
 * @param {boolean} options.syncAcrossTabs - Whether to sync across browser tabs (default: false)
 * @param {Function} options.validator - Optional function to validate loaded data
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 */


export const useLocalStorage = (key, initialValue, options = {}) => {
    const {
      serialize = true,
      syncAcrossTabs = false,
      validator = null
    } = options;
  
    // Use ref to store the key to detect changes
    const keyRef = useRef(key);
    
    // Helper function to get value from localStorage
    const getStoredValue = useCallback(() => {
      try {
        // Check if localStorage is available (may not be in some environments)
        if (typeof window === 'undefined' || !window.localStorage) {
          return initialValue;
        }
  
        const item = window.localStorage.getItem(key);
        
        // If no item exists, return initial value
        if (item === null) {
          return typeof initialValue === 'function' ? initialValue() : initialValue;
        }
  
        // Parse the stored value
        const parsedValue = serialize ? JSON.parse(item) : item;
        
        // Validate the parsed value if validator is provided
        if (validator && !validator(parsedValue)) {
          console.warn(`Invalid data found in localStorage for key "${key}", using initial value`);
          return typeof initialValue === 'function' ? initialValue() : initialValue;
        }
        
        return parsedValue;
      } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
        return typeof initialValue === 'function' ? initialValue() : initialValue;
      }
    }, [key, initialValue, serialize, validator]);
  
    // Initialize state with stored value or initial value
    const [value, setValue] = useState(getStoredValue);
  
    // Helper function to set value in localStorage
    const setStoredValue = useCallback((newValue) => {
      try {
        // Allow function updates like normal useState
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        
        // Update state
        setValue(valueToStore);
        
        // Store in localStorage if available
        if (typeof window !== 'undefined' && window.localStorage) {
          if (valueToStore === null || valueToStore === undefined) {
            window.localStorage.removeItem(key);
          } else {
            const serializedValue = serialize ? JSON.stringify(valueToStore) : valueToStore;
            window.localStorage.setItem(key, serializedValue);
          }
        }
      } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
        // Still update state even if localStorage fails
        setValue(newValue instanceof Function ? newValue(value) : newValue);
      }
    }, [key, value, serialize]);
  
    // Helper function to remove value from localStorage
    const removeStoredValue = useCallback(() => {
      try {
        setValue(typeof initialValue === 'function' ? initialValue() : initialValue);
        
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch (error) {
        console.error(`Error removing from localStorage for key "${key}":`, error);
      }
    }, [key, initialValue]);
  
    // Handle storage events for cross-tab synchronization
    useEffect(() => {
      if (!syncAcrossTabs || typeof window === 'undefined') {
        return;
      }
  
      const handleStorageChange = (e) => {
        // Only respond to changes for our specific key
        if (e.key !== key) return;
        
        try {
          if (e.newValue === null) {
            // Key was removed
            setValue(typeof initialValue === 'function' ? initialValue() : initialValue);
          } else {
            // Key was updated
            const newValue = serialize ? JSON.parse(e.newValue) : e.newValue;
            
            // Validate if validator is provided
            if (!validator || validator(newValue)) {
              setValue(newValue);
            }
          }
        } catch (error) {
          console.error(`Error handling storage change for key "${key}":`, error);
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [key, initialValue, serialize, validator, syncAcrossTabs]);
  
    // Re-read from localStorage if key changes
    useEffect(() => {
      if (keyRef.current !== key) {
        keyRef.current = key;
        setValue(getStoredValue);
      }
    }, [key, getStoredValue]);
  
    return [value, setStoredValue, removeStoredValue];
  };
  
  /**
   * Specialized hook for storing arrays in localStorage
   * Provides additional array manipulation methods
   * 
   * @param {string} key - localStorage key
   * @param {Array} initialArray - Initial array value
   * @param {Object} options - Configuration options
   * @returns {Object} Object with array value and manipulation methods
   */
  export const useLocalStorageArray = (key, initialArray = [], options = {}) => {
    const [array, setArray, removeArray] = useLocalStorage(key, initialArray, {
      ...options,
      validator: (value) => Array.isArray(value) && (!options.validator || options.validator(value))
    });
  
    const arrayMethods = {
      // Add item to array
      push: useCallback((item) => {
        setArray(prev => [...prev, item]);
      }, [setArray]),
  
      // Remove item by index
      removeByIndex: useCallback((index) => {
        setArray(prev => prev.filter((_, i) => i !== index));
      }, [setArray]),
  
      // Remove item by value
      removeByValue: useCallback((item) => {
        setArray(prev => prev.filter(i => i !== item));
      }, [setArray]),
  
      // Remove items matching predicate
      removeBy: useCallback((predicate) => {
        setArray(prev => prev.filter(item => !predicate(item)));
      }, [setArray]),
  
      // Update item by index
      updateByIndex: useCallback((index, newValue) => {
        setArray(prev => prev.map((item, i) => i === index ? newValue : item));
      }, [setArray]),
  
      // Update items matching predicate
      updateBy: useCallback((predicate, updater) => {
        setArray(prev => prev.map(item => 
          predicate(item) ? 
            (typeof updater === 'function' ? updater(item) : updater) : 
            item
        ));
      }, [setArray]),
  
      // Clear array
      clear: useCallback(() => {
        setArray([]);
      }, [setArray]),
  
      // Set entire array
      set: setArray,
      
      // Remove from localStorage
      remove: removeArray
    };
  
    return {
      value: array,
      ...arrayMethods
    };
  };
  
  /**
   * Specialized hook for storing objects in localStorage
   * Provides methods for updating nested properties
   * 
   * @param {string} key - localStorage key
   * @param {Object} initialObject - Initial object value
   * @param {Object} options - Configuration options
   * @returns {Object} Object with value and manipulation methods
   */
  export const useLocalStorageObject = (key, initialObject = {}, options = {}) => {
    const [object, setObject, removeObject] = useLocalStorage(key, initialObject, {
      ...options,
      validator: (value) => 
        typeof value === 'object' && 
        value !== null && 
        !Array.isArray(value) && 
        (!options.validator || options.validator(value))
    });
  
    const objectMethods = {
      // Update specific property
      updateProperty: useCallback((property, value) => {
        setObject(prev => ({
          ...prev,
          [property]: typeof value === 'function' ? value(prev[property]) : value
        }));
      }, [setObject]),
  
      // Update multiple properties
      updateProperties: useCallback((updates) => {
        setObject(prev => ({ ...prev, ...updates }));
      }, [setObject]),
  
      // Remove property
      removeProperty: useCallback((property) => {
        setObject(prev => {
          const newObj = { ...prev };
          delete newObj[property];
          return newObj;
        });
      }, [setObject]),
  
      // Merge with new object
      merge: useCallback((newData) => {
        setObject(prev => ({ ...prev, ...newData }));
      }, [setObject]),
  
      // Set entire object
      set: setObject,
      
      // Remove from localStorage
      remove: removeObject
    };
  
    return {
      value: object,
      ...objectMethods
    };
  };
  export default useLocalStorage;
