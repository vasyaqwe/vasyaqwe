import { Hono } from "hono"
import type { HonoEnv } from "./types"

export const createRouter = () => new Hono<HonoEnv>()
