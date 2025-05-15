/**
 * Returns a new array containing only unique elements from the input array.
 * @param array - The input array with potential duplicate elements
 * @returns A new array with duplicates removed
 */
export function getUniqueElements<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Returns a new array containing only unique elements from the input array
 * based on a specific key or property.
 * Useful for arrays of objects where equality is determined by a specific property.
 *
 * @param array - The input array with potential duplicate elements
 * @param getKey - A function that extracts the comparison key from each element
 * @returns A new array with duplicates removed
 */
export function getUniqueElementsByKey<T>(
  array: T[],
  getKey: (item: T) => any
): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const key = getKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Returns a new array containing only unique strings from the input array,
 * ignoring case sensitivity. For example, "Test" and "test" are considered duplicates,
 * and only the first occurrence is kept.
 *
 * @param strings - The input array of strings with potential duplicate elements
 * @returns A new array with case-insensitive duplicates removed
 */
export function getUniqueStringsIgnoreCase(strings?: string[]): string[] {
  if (!strings) return []
  const seen = new Set<string>()
  return strings.filter((str) => {
    const lowerStr = str.toLowerCase()
    if (seen.has(lowerStr)) return false
    seen.add(lowerStr)
    return true
  })
}
