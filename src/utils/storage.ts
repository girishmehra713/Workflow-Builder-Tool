const STORAGE_KEY = "workflow-builder-data";

export function saveToStorage(data: unknown): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
    return false;
  }
}

export function loadFromStorage<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
