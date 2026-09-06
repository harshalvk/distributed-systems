import type { Request, Response, NextFunction } from "express"
import fs from 'fs'
import { LOG_FILE } from "../../../shared/path"

export const logger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    try {
      const method = req.method
      const path = req.path
      const timestamp = new Date(Date.now()).toISOString()
      const statusCode = res.statusCode
      const log = `${timestamp} ${method} ${path} ${statusCode}\n`
      fs.writeFileSync(LOG_FILE, log, { flag: "a" })
    } catch (err) {
      console.error(err)
    }
  })

  next()

}
