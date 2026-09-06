import { open } from "fs/promises";
import { watch } from "fs";
import { sleep } from "bun";

export async function tailFile(filePath: string, onLines: (lines: string[]) => void) {
  while (true) {
    try {
      const fileHandle = await open(filePath)
      const stats = await fileHandle.stat()
      const currentSize = stats.size
      let offset = currentSize

      watch(filePath, async (eventype) => {
        if (eventype === "change") {
          const stats = await fileHandle.stat()
          const length = stats.size - offset
          if (length <= 0) {
            return
          } else {
            const buffer = Buffer.alloc(length)
            const { bytesRead } = await fileHandle.read(buffer, 0, length, offset)
            const chunk = buffer.toString('utf-8', 0, bytesRead)
            const lines = chunk.split("\n").filter(line => line.trim().length > 0)
            onLines(lines)
            offset = stats.size
          }
        }
      })
      break      
    } catch {
      await sleep(500)
    }
  }
}
