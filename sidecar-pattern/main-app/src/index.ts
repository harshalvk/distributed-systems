import express from "express";
import type { Application, Request, Response } from "express";
import { logger } from "./lib/logger";
import { mkdir, stat } from "fs/promises";
import { LOG_DIR } from "../../shared/path";

const PORT = 8080;
const URL = `http://localhost:${PORT}`;

const app: Application = express();

app.use(express.json())
app.use(logger)

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "helloo" })
});

app.get("/fail", async (req: Request, res: Response) => {
  res.status(500).json({ message: "fail" });
});

app.listen(PORT, async () => {
  try {
    await stat(LOG_DIR)
  } catch (err) {
    await mkdir(LOG_DIR, { recursive: true })
  }
  console.log(`server is listening on ${URL}`);
});
