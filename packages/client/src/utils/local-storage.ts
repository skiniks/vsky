export function getLocalStorage(key: string): string | null {
  return localStorage.getItem(key)
}

export function setLocalStorage(key: string, value: string): void {
  localStorage.setItem(key, value)
}

export function removeItemLocalStorage(key: string): void {
  localStorage.removeItem(key)
}
