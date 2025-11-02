import { router } from '../trpc';
import { postsRouter } from './_posts.router';
import { categoriesRouter } from './categories';

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
