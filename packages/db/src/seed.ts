import { db } from '../index'
import { posts, categories, postCategories } from './schema'

async function seed() {
  console.log('Seeding database...')

  // Create categories
  const techCategory = await db.insert(categories).values({
    name: 'Technology',
    slug: 'technology',
    description: 'Posts about technology, programming, and software development'
  }).returning()

  const designCategory = await db.insert(categories).values({
    name: 'Design',
    slug: 'design',
    description: 'Posts about design, UX, UI, and creative processes'
  }).returning()

  const businessCategory = await db.insert(categories).values({
    name: 'Business',
    slug: 'business',
    description: 'Posts about business, entrepreneurship, and productivity'
  }).returning()

  const tutorialCategory = await db.insert(categories).values({
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Step-by-step guides and how-to articles'
  }).returning()

  const newsCategory = await db.insert(categories).values({
    name: 'News',
    slug: 'news',
    description: 'Latest updates and announcements from the tech world'
  }).returning()

  // Create sample posts
  const postsData = [
    {
      title: 'Getting Started with Next.js 15',
      slug: 'getting-started-nextjs-15',
      content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements to the React framework. This comprehensive guide will walk you through everything you need to know.

## What's New in Next.js 15

### App Router Improvements
The App Router has received significant enhancements:
- Better performance optimizations
- Enhanced TypeScript support
- Improved error handling
- New caching strategies

### Server Components
Server Components are now more powerful than ever:
- Better integration with client components
- Enhanced streaming capabilities
- Improved SEO features

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js application with all the latest features.

## Best Practices

1. **Use Server Components**: Leverage server components for better performance
2. **Implement Proper Caching**: Use appropriate caching strategies
3. **Type Safety**: Always use TypeScript for better development experience

## Conclusion

Next.js 15 is a major step forward for React applications. The improvements in performance, developer experience, and features make it an excellent choice for modern web applications.`,
      excerpt: 'Learn about the latest features in Next.js 15 and how to get started with the App Router, Server Components, and more.',
      author: 'Sarah Johnson',
      published: true,
      publishedAt: new Date('2024-01-15')
    },
    {
      title: 'Database Design Patterns for Modern Applications',
      slug: 'database-design-patterns',
      content: `# Database Design Patterns

Understanding database design patterns is crucial for building scalable and maintainable applications. This article explores common patterns and when to use them.

## Common Database Patterns

### 1. Repository Pattern
The Repository pattern abstracts data access logic and provides a more testable way to interact with your database.

\`\`\`typescript
interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<User>
  delete(id: string): Promise<void>
}
\`\`\`

### 2. Unit of Work Pattern
The Unit of Work pattern manages transactions and ensures data consistency across multiple operations.

### 3. Active Record Pattern
Active Record combines data and behavior in the same class, making it easy to work with but potentially violating SOLID principles.

## Choosing the Right Pattern

Consider these factors when selecting a pattern:
- **Complexity**: How complex are your data operations?
- **Testing**: How important is testability?
- **Performance**: What are your performance requirements?
- **Team Size**: How large is your development team?

## Best Practices

1. **Normalize your data** to reduce redundancy
2. **Use appropriate indexes** for query performance
3. **Consider your query patterns** when designing your schema
4. **Plan for scalability** from the beginning

## Conclusion

The right database design pattern depends on your specific use case. Start simple and evolve as your application grows.`,
      excerpt: 'Explore common database design patterns including Repository, Unit of Work, and Active Record. Learn when to use each pattern and best practices for scalable applications.',
      author: 'Mike Chen',
      published: true,
      publishedAt: new Date('2024-01-10')
    },
    {
      title: 'Building Responsive UIs with Tailwind CSS',
      slug: 'responsive-ui-tailwind-css',
      content: `# Building Responsive UIs with Tailwind CSS

Tailwind CSS has revolutionized how we think about styling web applications. This guide covers advanced techniques for building responsive user interfaces.

## Responsive Design Principles

### Mobile-First Approach
Always start with mobile design and scale up:
\`\`\`html
<div class="block md:hidden">Mobile only</div>
<div class="hidden md:block">Desktop only</div>
<div class="block sm:hidden md:block lg:hidden">Tablet only</div>
\`\`\`

### Fluid Typography
Use responsive typography scales:
\`\`\`html
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Responsive heading</h1>
\`\`\`

## Advanced Layout Techniques

### CSS Grid with Tailwind
\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
\`\`\`

### Flexbox Utilities
\`\`\`html
<div class="flex flex-col sm:flex-row items-center justify-between">
  <div>Logo</div>
  <nav class="flex space-x-4">
    <a href="#" class="px-3 py-2">Home</a>
    <a href="#" class="px-3 py-2">About</a>
  </nav>
</div>
\`\`\`

## Design System Integration

### Custom Color Palette
\`\`\`css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}
\`\`\`

### Consistent Spacing
Use a consistent spacing scale throughout your application.

## Performance Considerations

1. **Purge unused styles** in production
2. **Use responsive utilities wisely** to avoid large CSS bundles
3. **Consider component extraction** for complex UI patterns

## Conclusion

Tailwind CSS provides powerful utilities for building responsive interfaces. Focus on mobile-first design and use the utility classes effectively to create maintainable and scalable UIs.`,
      excerpt: 'Master responsive design with Tailwind CSS. Learn mobile-first approaches, advanced layout techniques, and performance best practices for modern web applications.',
      author: 'Alex Rivera',
      published: true,
      publishedAt: new Date('2024-01-05')
    },
    {
      title: 'TypeScript Best Practices for Large Applications',
      slug: 'typescript-best-practices-large-apps',
      content: `# TypeScript Best Practices for Large Applications

As your TypeScript application grows, maintaining code quality becomes increasingly important. Here are proven strategies for large-scale TypeScript development.

## Project Structure

### Feature-Based Organization
\`\`\`
src/
├── features/
│   ├── auth/
│   ├── dashboard/
│   └── posts/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── types/
    └── index.ts
\`\`\`

### Module Resolution
Configure your tsconfig.json for optimal module resolution:
\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/shared/components/*"]
    }
  }
}
\`\`\`

## Type Safety Strategies

### Strict Mode Configuration
\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
\`\`\`

### Advanced Type Definitions
\`\`\`typescript
// Discriminated unions
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

// Utility types
type NonEmptyArray<T> = [T, ...T[]]
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
\`\`\`

## Code Organization

### Interface Segregation
\`\`\`typescript
// Instead of large interfaces
interface User {
  id: string
  name: string
  email: string
  profile: UserProfile
  preferences: UserPreferences
}

// Use smaller, focused interfaces
interface User {
  id: string
  name: string
  email: string
}

interface UserProfile {
  avatar?: string
  bio?: string
}

interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: boolean
}
\`\`\`

## Testing Considerations

### Type-Safe Testing
\`\`\`typescript
// Use types in tests
const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
}

expect(user).toEqual(mockUser)
\`\`\`

## Performance Optimization

1. **Use const assertions** for better performance
2. **Avoid type assertions** when possible
3. **Use module augmentation** for extending third-party types

## Conclusion

Following these best practices will help you build maintainable, type-safe, and scalable TypeScript applications. Start with strict mode and gradually adopt these patterns as your team grows.`,
      excerpt: 'Learn essential TypeScript best practices for large applications including project structure, type safety strategies, and performance optimization techniques.',
      author: 'David Kim',
      published: true,
      publishedAt: new Date('2024-01-01')
    },
    {
      title: 'The Future of Web Development in 2024',
      slug: 'future-web-development-2024',
      content: `# The Future of Web Development in 2024

Web development continues to evolve rapidly. Here are the key trends and technologies shaping the future of how we build web applications.

## Major Trends

### 1. AI Integration
Artificial Intelligence is becoming integral to web development:
- **AI-Powered Code Generation**: Tools like GitHub Copilot
- **Automated Testing**: AI-driven test generation
- **Content Creation**: AI-assisted content management

### 2. Edge Computing
Moving computation closer to users:
\`\`\`typescript
// Edge runtime example
export const config = {
  runtime: 'edge',
}

export default function handler(request: Request) {
  return new Response('Hello from the edge!')
}
\`\`\`

### 3. WebAssembly (WASM)
High-performance applications in the browser:
\`\`\`rust
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
\`\`\`

## Framework Evolution

### React Server Components
\`\`\`tsx
// Server Component
async function BlogPost({ id }: { id: string }) {
  const post = await db.posts.find(id)

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
\`\`\`

### Next.js App Router
The new routing system offers:
- **Layout System**: Nested layouts and templates
- **Loading States**: Built-in loading and error boundaries
- **Streaming**: Progressive page loading

## Development Tools

### Bun Runtime
\`\`\`bash
# Faster than npm
bun install
bun run dev
bun run build
\`\`\`

### Turborepo
\`\`\`json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false
    }
  }
}
\`\`\`

## Performance Focus

1. **Core Web Vitals** remain crucial
2. **Bundle Analysis** tools are essential
3. **Image Optimization** is non-negotiable
4. **CDN Integration** for global performance

## Security Considerations

- **Content Security Policy (CSP)**
- **Subresource Integrity (SRI)**
- **HTTPS Everywhere**
- **Input Validation**

## Conclusion

2024 promises to be an exciting year for web development. Focus on learning new tools while maintaining solid fundamentals. The key is staying adaptable and continuously learning.`,
      excerpt: 'Explore the major trends shaping web development in 2024 including AI integration, edge computing, WebAssembly, and the evolution of modern frameworks.',
      author: 'Emma Thompson',
      published: true,
      publishedAt: new Date('2023-12-28')
    },
    {
      title: 'Work in Progress: Advanced React Patterns',
      slug: 'advanced-react-patterns-draft',
      content: `# Advanced React Patterns

This article is still in draft. It will cover advanced React patterns and best practices for building complex applications.

## Compound Components
Compound components allow you to create flexible component APIs...

## Render Props
Render props provide a way to share code between components...

## Higher-Order Components
HOCs are functions that take a component and return an enhanced component...

More content coming soon!`,
      excerpt: 'Advanced React patterns for building complex applications. This article is still in draft.',
      author: 'John Smith',
      published: false,
      publishedAt: null
    },
    {
      title: 'Draft: Microservices Architecture Guide',
      slug: 'microservices-architecture-draft',
      content: `# Microservices Architecture Guide

A comprehensive guide to designing and implementing microservices architecture.

## What are Microservices?

Microservices are an architectural approach where a single application is composed of many small services...

## Benefits and Challenges

### Benefits:
- Scalability
- Technology diversity
- Team autonomy

### Challenges:
- Distributed systems complexity
- Data consistency
- Monitoring and debugging

This guide is still being written...`,
      excerpt: 'A comprehensive guide to microservices architecture. Currently in draft.',
      author: 'Lisa Wang',
      published: false,
      publishedAt: null
    }
  ]

  // Create posts
  for (const postData of postsData) {
    const post = await db.insert(posts).values(postData).returning()

    // Assign categories based on content
    if (postData.title.includes('Next.js') || postData.title.includes('TypeScript')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: techCategory[0].id
      })
    }

    if (postData.title.includes('Design') || postData.title.includes('Tailwind')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: designCategory[0].id
      })
    }

    if (postData.title.includes('Database') || postData.title.includes('Business')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: businessCategory[0].id
      })
    }

    if (postData.title.includes('Tutorial')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: tutorialCategory[0].id
      })
      excerpt: 'Master responsive design with Tailwind CSS. Learn mobile-first approaches, advanced layout techniques, and performance best practices for modern web applications.',
      author: 'Alex Rivera'
    },
    {
      title: 'TypeScript Best Practices for Large Applications',
      slug: 'typescript-best-practices-large-apps',
      content: `# TypeScript Best Practices for Large Applications

As your TypeScript application grows, maintaining code quality becomes increasingly important. Here are proven strategies for large-scale TypeScript development.

## Project Structure

### Feature-Based Organization
\`\`\`
src/
├── features/
│   ├── auth/
│   ├── dashboard/
│   └── posts/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── types/
    └── index.ts
\`\`\`

### Module Resolution
Configure your tsconfig.json for optimal module resolution:
\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/shared/components/*"]
    }
  }
}
\`\`\`

## Type Safety Strategies

### Strict Mode Configuration
\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
\`\`\`

### Advanced Type Definitions
\`\`\`typescript
// Discriminated unions
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

// Utility types
type NonEmptyArray<T> = [T, ...T[]]
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
\`\`\`

## Code Organization

### Interface Segregation
\`\`\`typescript
// Instead of large interfaces
interface User {
  id: string
  name: string
  email: string
  profile: UserProfile
  preferences: UserPreferences
}

// Use smaller, focused interfaces
interface User {
  id: string
  name: string
  email: string
}

interface UserProfile {
  avatar?: string
  bio?: string
}

interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: boolean
}
\`\`\`

## Testing Considerations

### Type-Safe Testing
\`\`\`typescript
// Use types in tests
const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
}

expect(user).toEqual(mockUser)
\`\`\`

## Performance Optimization

1. **Use const assertions** for better performance
2. **Avoid type assertions** when possible
3. **Use module augmentation** for extending third-party types

## Conclusion

Following these best practices will help you build maintainable, type-safe, and scalable TypeScript applications. Start with strict mode and gradually adopt these patterns as your team grows.`,
      excerpt: 'Learn essential TypeScript best practices for large applications including project structure, type safety strategies, and performance optimization techniques.',
      author: 'David Kim'
    },
    {
      title: 'The Future of Web Development in 2024',
      slug: 'future-web-development-2024',
      content: `# The Future of Web Development in 2024

Web development continues to evolve rapidly. Here are the key trends and technologies shaping the future of how we build web applications.

## Major Trends

### 1. AI Integration
Artificial Intelligence is becoming integral to web development:
- **AI-Powered Code Generation**: Tools like GitHub Copilot
- **Automated Testing**: AI-driven test generation
- **Content Creation**: AI-assisted content management

### 2. Edge Computing
Moving computation closer to users:
\`\`\`typescript
// Edge runtime example
export const config = {
  runtime: 'edge',
}

export default function handler(request: Request) {
  return new Response('Hello from the edge!')
}
\`\`\`

### 3. WebAssembly (WASM)
High-performance applications in the browser:
\`\`\`rust
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
\`\`\`

## Framework Evolution

### React Server Components
\`\`\`tsx
// Server Component
async function BlogPost({ id }: { id: string }) {
  const post = await db.posts.find(id)

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
\`\`\`

### Next.js App Router
The new routing system offers:
- **Layout System**: Nested layouts and templates
- **Loading States**: Built-in loading and error boundaries
- **Streaming**: Progressive page loading

## Development Tools

### Bun Runtime
\`\`\`bash
# Faster than npm
bun install
bun run dev
bun run build
\`\`\`

### Turborepo
\`\`\`json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false
    }
  }
}
\`\`\`

## Performance Focus

1. **Core Web Vitals** remain crucial
2. **Bundle Analysis** tools are essential
3. **Image Optimization** is non-negotiable
4. **CDN Integration** for global performance

## Security Considerations

- **Content Security Policy (CSP)**
- **Subresource Integrity (SRI)**
- **HTTPS Everywhere**
- **Input Validation**

## Conclusion

2024 promises to be an exciting year for web development. Focus on learning new tools while maintaining solid fundamentals. The key is staying adaptable and continuously learning.`,
      excerpt: 'Explore the major trends shaping web development in 2024 including AI integration, edge computing, WebAssembly, and the evolution of modern frameworks.',
      author: 'Emma Thompson'
    }
  ]

  // Create posts
  for (const postData of postsData) {
    const post = await db.insert(posts).values(postData).returning()

    // Assign categories based on content
    if (postData.title.includes('Next.js') || postData.title.includes('TypeScript')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: techCategory[0].id
      })
    }

    if (postData.title.includes('Design') || postData.title.includes('Tailwind')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: designCategory[0].id
      })
    }

    if (postData.title.includes('Database') || postData.title.includes('Business')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: businessCategory[0].id
      })
    }

    if (postData.title.includes('Tutorial')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: tutorialCategory[0].id
      })
    }

    if (postData.title.includes('Future') || postData.title.includes('News')) {
      await db.insert(postCategories).values({
        postId: post[0].id,
        categoryId: newsCategory[0].id
      })
    }
  }

  console.log('Database seeded successfully with enhanced data!')
}

seed().catch(console.error)
