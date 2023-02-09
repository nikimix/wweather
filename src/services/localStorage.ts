export const setLocalStorageItem = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorageItem = <T>(key: string): T | undefined => {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return undefined;
};

export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
};
