export const parseLine = (line: string): number | null => {
  const tokens = line.trim().split(/\s+/)
  if (tokens.length < 4) return null
  const statusCode = Number(tokens[3])
  return Number.isNaN(statusCode) ? null : statusCode
}
