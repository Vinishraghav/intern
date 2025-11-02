import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const dashboardRouter = router({
  getDashboardStats: publicProcedure.query(async ({ ctx }) => {
    // Mock data - replace with actual database queries
    return {
      totalPosts: 24,
      totalCategories: 8,
      totalViews: 1245,
      postsChange: 12.5,
      categoriesChange: 2.3,
      viewsChange: 8.7,
    };
  }),

  getRecentPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      // Mock data - replace with actual database queries
      return [
        {
          id: '1',
          title: 'Getting Started with Next.js 14',
          slug: 'getting-started-with-nextjs-14',
          views: 124,
          comments: 5,
          published: true,
        },
        {
          id: '2',
          title: 'The Future of Web Development',
          slug: 'future-of-web-dev',
          views: 89,
          comments: 3,
          published: true,
        },
        {
          id: '3',
          title: 'Draft: Advanced TypeScript Patterns',
          slug: 'advanced-typescript-patterns',
          views: 0,
          comments: 0,
          published: false,
        },
      ].slice(0, input.limit);
    }),
});
