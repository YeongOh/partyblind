import useLocalStorage from './useLocalStorage';

export default function useInput(key, initialValue) {
  const [value, setValue] = useLocalStorage(key, initialValue);

  //   const reset = () => setValue(initialValue);

  const attributeObj = {
    value,
    onChange: (e) => setValue(e.target.value),
  };

  return [value, attributeObj];
}
