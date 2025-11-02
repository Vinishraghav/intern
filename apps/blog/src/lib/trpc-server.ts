import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause && 
          typeof error.cause === 'object' &&
          'name' in error.cause && 
          error.cause.name === 'ZodError' &&
          'flatten' in error.cause && 
          typeof error.cause.flatten === 'function'
            ? (error.cause as { flatten: () => any }).flatten()
            : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure

// Export types for client
export type Router = typeof router
