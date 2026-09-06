import express from 'express'
import type { Application, Request, Response } from 'express'

import { parseLine } from '../shared/parser'
import { tailFile } from './lib/lib'
import { LOG_FILE } from '../shared/path'

const tally = new Map<number, number>()

function handleLines(lines: string[]) {
  for (const line of lines) {
    const statusCode = parseLine(line)
    if (statusCode !== null) {
      tally.set(statusCode, (tally.get(statusCode) ?? 0) + 1)
    }
  }
}

await tailFile(LOG_FILE, handleLines).catch(err => {
  console.error('tailFile failed:: ', err)
})

const PORT = 9090
const URL = `http://localhost:${PORT}`
const app: Application = express()

app.use(express.json())

app.get("/metrics", (_, res: Response) => {
  const entries = Object.fromEntries(tally)
  res.status(200).json({ entries })
})

app.listen(PORT, () => {
  console.log(`sidecar is listening on ${URL}`)
})
