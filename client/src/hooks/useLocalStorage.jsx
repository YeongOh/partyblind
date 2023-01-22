import { useState, useEffect } from 'react';

const getLocalValue = (key, initialValue) => {
  // SSR - in Next.js, window is undefined
  if (typeof window === 'undefined') return initialValue;

  // if a value is already stored
  const localValue = JSON.parse(localStorage.getItem(key));
  if (localValue) return localValue;

  // return result of a function
  if (initialValue instanceof Function) return initialValue();

  return initialValue;
};

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initialValue);
  });

  // only for string data
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
