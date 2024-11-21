const saveToStorage = async (key: string, value: unknown) => {
  await chrome.storage.local.set({ [key]: value });
};

const getFromStorage = async (key: string) => {
  const result = await chrome.storage.local.get(key);
  return result[key];
};

export { saveToStorage, getFromStorage };
