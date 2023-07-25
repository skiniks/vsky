export function getElapsedTime(createdAt: string | number | Date) {
  const currentTime = new Date()
  const createdAtTime = new Date(createdAt)
  const elapsedTime = currentTime.getTime() - createdAtTime.getTime()

  const seconds = Math.floor(elapsedTime / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0)
    return `${days}d`
  else if (hours > 0)
    return `${hours}h`
  else if (minutes > 0)
    return `${minutes}m`
  else
    return `${seconds}s`
}
