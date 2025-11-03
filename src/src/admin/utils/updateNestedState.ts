export function updateNestedState<T>(prev: T, fullKey: string, value: any): T {
  const keys = fullKey.split(/\.|\[|\]/).filter(Boolean);
  function setDeep(obj: any, pathKeys: string[], newValue: any): any {
    if (pathKeys.length === 0) return newValue;
    const [key, ...rest] = pathKeys;
    if (/^\d+$/.test(key)) {
      const idx = parseInt(key, 10);
      const arr = Array.isArray(obj) ? [...obj] : [];
      arr[idx] = setDeep(arr[idx], rest, newValue);
      return arr;
    } else {
      return {
        ...obj,
        [key]: setDeep(obj && obj[key], rest, newValue)
      };
    }
  }
  return setDeep(prev, keys, value);
}

export default updateNestedState;

