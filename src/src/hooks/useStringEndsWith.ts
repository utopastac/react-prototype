import { useState, useEffect, useCallback } from 'react';

interface UseStringEndsWithOptions {
  onMatch?: (pattern: string) => void;
  ignoreModifierKeys?: boolean;
  matchPatterns?: string[];
}

/**
 * Custom hook for detecting if keyboard input ends with specific patterns
 * @param options Configuration options for the hook
 * @returns The current input string and a function to manually clear the input
 */
const useStringEndsWith = (options: UseStringEndsWithOptions = {}) => {
  const {
    onMatch,
    ignoreModifierKeys = true,
    matchPatterns = []
  } = options;

  const [input, setInput] = useState<string>('');

  // Clear the input string
  const clearInput = useCallback(() => {
    setInput('');
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore modifier keys if specified
      if (ignoreModifierKeys && (e.ctrlKey || e.altKey || e.metaKey)) return;
      
      const newInput = input + e.key.toLowerCase();
      setInput(newInput);
      
      if (onMatch) {
        const matchedPattern = matchPatterns.find(pattern => newInput.endsWith(pattern));
        
        if (matchedPattern) onMatch(matchedPattern);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [input, ignoreModifierKeys, onMatch, matchPatterns]);

  return {
    input,
    clearInput
  };
};

export default useStringEndsWith; 