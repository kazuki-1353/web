const getSessionStorage = () => {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch (error) {
    console.warn('Session storage is not available:', error)
    return null
  }
}

const getLocalStorage = () => {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch (error) {
    console.warn('Local storage is not available:', error)
    return null
  }
}

export const setSessionJson = (key, value) => {
  const storage = getSessionStorage()
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn('Failed to set session storage:', error)
    return false
  }
}

export const getSessionJson = (key, fallback = null) => {
  const storage = getSessionStorage()
  if (!storage) return fallback

  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Failed to read session storage:', error)
    return fallback
  }
}

export const removeSessionItem = (key) => {
  const storage = getSessionStorage()
  if (!storage) return false

  try {
    storage.removeItem(key)
    return true
  } catch (error) {
    console.warn('Failed to remove session storage item:', error)
    return false
  }
}

export const setLocalJson = (key, value) => {
  const storage = getLocalStorage()
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn('Failed to set local storage:', error)
    return false
  }
}

export const getLocalJson = (key, fallback = null) => {
  const storage = getLocalStorage()
  if (!storage) return fallback

  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Failed to read local storage:', error)
    return fallback
  }
}

export const removeLocalItem = (key) => {
  const storage = getLocalStorage()
  if (!storage) return false

  try {
    storage.removeItem(key)
    return true
  } catch (error) {
    console.warn('Failed to remove local storage item:', error)
    return false
  }
}
