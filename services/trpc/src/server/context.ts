import type { inferAsyncReturnType } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { db } from '@workspace/db'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = (opts?: FetchCreateContextFnOptions) => {
  return {
    db,
    req: opts?.req,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
