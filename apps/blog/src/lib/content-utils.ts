/**
 * Calculate reading time based on word count
 * Average reading speed is 200-250 words per minute
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  const wordsPerMinute = 200
  const readingTime = Math.ceil(words / wordsPerMinute)
  return Math.max(1, readingTime) // Minimum 1 minute
}

/**
 * Count words in content
 */
export function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Count characters in content
 */
export function countCharacters(content: string): number {
  return content.length
}
