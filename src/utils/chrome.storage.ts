export const getFromStorage = async (key: string) => {
  // Check if we're in a Chrome extension environment
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    console.log(`Getting from Chrome storage: ${key}`);
    const result = await chrome.storage.local.get(key);
    return result[key];
  }

  // Fallback for non-extension environments
  const data = localStorage.getItem(key);
  console.log(`Getting from local storage: ${key}`);
  return data ? data : null;
};

export const setToStorage = async (key: string, value: unknown) => {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    console.log(`Setting to Chrome storage: ${key}`);
    await chrome.storage.local.set({ [key]: value });
  } else {
    console.log(`Setting to local storage: ${key}`);
    localStorage.setItem(key, JSON.stringify(value));
  }
};
