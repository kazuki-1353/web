export function deepClone(value) {
  // Prefer native structuredClone when available for better type support.
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  } else {
    return deepCloneFallback(value, new WeakMap())
  }
}

function deepCloneFallback(value, seen) {
  switch (true) {
    case value === null:{
      return null
    }

    case typeof value !== 'object':{
      return value
    }

    case seen.has(value):{
      return seen.get(value)
    }

    case value instanceof Date:{
      return new Date(value.getTime())
    }

    case value instanceof RegExp:{
      return new RegExp(value.source, value.flags)
    }

    case value instanceof Map:{
      const result = new Map()
      seen.set(value, result)
      value.forEach((mapValue, key) => {
        result.set(deepCloneFallback(key, seen), deepCloneFallback(mapValue, seen))
      })
      return result
    }

    case value instanceof Set:{
      const result = new Set()
      seen.set(value, result)
      value.forEach((setValue) => {
        result.add(deepCloneFallback(setValue, seen))
      })
      return result
    }

    case Array.isArray(value):{
      const result = []
      seen.set(value, result)
      for (let i = 0; i < value.length; i += 1) {
        result[i] = deepCloneFallback(value[i], seen)
      }
      return result
    }

    default:{
      const result = Object.create(Object.getPrototypeOf(value))
      seen.set(value, result)
      Object.keys(value).forEach((key) => {
        result[key] = deepCloneFallback(value[key], seen)
      })
      return result
    }
  }
}
