import { createTRPCReact } from '@trpc/react-query';
import type { inferReactQueryProcedureOptions } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { appRouter } from './server/routers/_app';
import type { AppRouter } from './server/routers/_app';
import { createContext } from './server/context';
import type { Context } from './server/context';

// Create the tRPC React client
export const trpc = createTRPCReact<AppRouter, Context>();

// Export types for type-safe API calls
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Export the app router and context
export { appRouter, createContext };
export type { AppRouter, Context };
