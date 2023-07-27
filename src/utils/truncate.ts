export function truncate(string: string | undefined, maxLength: number) {
  if (!string)
    return null
  if (string.length <= maxLength)
    return string
  return `${string.substring(0, maxLength)}...`
}
