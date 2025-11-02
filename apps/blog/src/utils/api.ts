import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@workspace/trpc';

export const api = createTRPCReact<AppRouter>();

// This is a helper to get the tRPC client
export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export const transformer = {
  // This is used for serialization/deserialization of dates
  input: (data: unknown) => JSON.parse(JSON.stringify(data)),
  output: (data: unknown) => JSON.parse(JSON.stringify(data)),
};
