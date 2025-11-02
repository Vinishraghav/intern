# Contributing Guide

Thank you for your interest in contributing to the Multi-User Blogging Platform! This guide will help you get started with development, testing, and submitting contributions.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/blogging-platform.git`
3. **Install** dependencies: `npm install`
4. **Set up** environment: `cp .env.example .env.local`
5. **Run** database migrations: `npm run db:migrate`
6. **Seed** data: `npm run db:seed`
7. **Start** development: `npm run dev`

## 📝 Development Workflow

### Code Style
- **TypeScript**: Strict mode enabled, no `any` types preferred
- **ESLint**: Run `npm run lint` before committing
- **Prettier**: Run `npm run format` for consistent formatting
- **Imports**: Use path aliases (`@/`, `@ui/`, `@trpc/`) consistently

### Git Conventions
```bash
# Branch naming
feature/add-user-auth
fix/dashboard-loading-bug
refactor/api-error-handling
docs/update-readme

# Commit messages (Conventional Commits)
feat: add dark mode toggle
fix: resolve hydration mismatch
docs: update API documentation
style: improve button hover states
refactor: simplify component structure
test: add unit tests for post editor
```

### Testing Requirements
- **Unit Tests**: All new components and utilities must have tests
- **Integration Tests**: Test key user flows (create post, filter categories)
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Coverage**: Maintain >80% test coverage

## 🏗️ Architecture Guidelines

### Component Structure
```
components/
├── ui/           # Shared UI components (shadcn/ui)
├── forms/        # Form-specific components
├── layout/       # Layout components (header, footer)
└── features/     # Feature-specific components
```

### State Management
- **Zustand**: Global UI state (theme, preferences)
- **React Query**: Server state (API data, caching)
- **Form State**: React Hook Form with Zod validation

### API Design
- **tRPC**: Type-safe procedures with Zod validation
- **Error Handling**: Consistent error responses
- **Caching**: React Query for optimistic updates
- **Validation**: Input sanitization and edge case handling

## 🧪 Testing Strategy

### Test Categories
1. **Unit Tests**: Pure functions, utilities, components in isolation
2. **Integration Tests**: Component interactions, API calls, user flows
3. **E2E Tests**: Complete user journeys (ready for Playwright)

### Test Files
```
src/
├── __tests__/
│   ├── unit/
│   │   ├── utils.test.ts
│   │   └── content-utils.test.ts
│   ├── integration/
│   │   ├── post-workflow.test.tsx
│   │   └── category-management.test.tsx
│   └── e2e/
│       └── user-journeys.test.ts
└── components/
    └── __tests__/
        └── ComponentName.test.tsx
```

### Mocking Strategy
```typescript
// API mocks
jest.mock('@trpc/client')

// Router mocks
jest.mock('next/navigation')

// External dependencies
jest.mock('sonner')
```

## 🔧 Development Tools

### Available Scripts
```bash
# Development
npm run dev              # Start all services
npm run build           # Build for production
npm run lint            # ESLint + TypeScript checks
npm run format          # Prettier formatting

# Testing
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Database
npm run db:generate     # Generate types
npm run db:migrate      # Run migrations
npm run db:seed         # Seed sample data

# Performance
ANALYZE=true npm run build  # Bundle analysis
```

### Code Quality
- **ESLint**: Catches potential bugs and enforces consistency
- **TypeScript**: Compile-time error checking
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality gates

## 📋 Pull Request Process

1. **Create** feature branch from `main`
2. **Write** tests for new functionality
3. **Update** documentation if needed
4. **Run** full test suite: `npm run test`
5. **Check** linting: `npm run lint`
6. **Format** code: `npm run format`
7. **Submit** PR with clear description

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Accessibility tested

## Checklist
- [ ] Code follows project conventions
- [ ] Tests pass
- [ ] Lint checks pass
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🎯 Feature Development

### Adding New Components
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Implement accessibility features
4. Write unit tests
5. Add to UI package if reusable

### API Development
1. Define Zod schemas in `services/trpc/src/schemas.ts`
2. Implement tRPC procedures in routers
3. Add error handling and validation
4. Write integration tests
5. Update API documentation

### Database Changes
1. Update schema in `packages/db/src/schema.ts`
2. Generate migrations: `npm run db:generate`
3. Test migrations: `npm run db:migrate`
4. Update seed data if needed

## 🐛 Bug Reports

When reporting bugs, please include:
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment details** (Node version, OS, browser)
- **Error logs** (if applicable)

## 💡 Feature Requests

Feature requests are welcome! Please include:
- **Use case**: Why this feature is needed
- **Proposed solution**: How it should work
- **Alternatives**: Other approaches considered
- **Impact**: How it affects existing functionality

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct. By participating, you agree to maintain a respectful and inclusive environment.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for contributing! 🚀
