# 🚀 Multi-User Blogging Platform - Local Development Guide

This guide provides step-by-step instructions for setting up and running the Multi-User Blogging Platform monorepo locally, including database setup, development servers, testing, and output verification.

## 📋 Prerequisites

### Required Software
- **Node.js 20+** - Download from [nodejs.org](https://nodejs.org/)
- **PostgreSQL Database** - Choose one option:
  - **Local PostgreSQL** (recommended for development)
  - **Docker PostgreSQL** - Run `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15`
  - **Cloud Database** (Neon/Supabase free tier) - Get connection string from dashboard
- **Git** - For repository management
- **Windsurf IDE** - Open to project root (`blogging-platform/`)

### Verify Installation
```bash
# Check Node.js version
node --version  # Should show v20.x.x or higher

# Check PostgreSQL (if local)
psql --version  # Should show PostgreSQL version

# Check Git
git --version   # Should show Git version
```

## 🔧 1. Installation Commands

### Install Monorepo Dependencies
```bash
# From project root (blogging-platform/)
npm install
```

**Expected Output:**
```
npm WARN deprecated ...
added 1234 packages, and audited 1235 packages in 45s
found 0 vulnerabilities
```

**Verification:**
- ✅ No errors during installation
- ✅ `node_modules/` created in project root, `apps/`, `packages/`, `services/`, and `libraries/` directories
- ✅ Dependencies installed: Next.js 15, tRPC, Drizzle ORM, shadcn/ui, Zustand, Jest, React Query

### Workspace Structure After Installation
```
blogging-platform/
├── node_modules/           # Root dependencies
├── apps/
│   └── blog/
│       └── node_modules/   # Next.js dependencies
├── packages/
│   ├── db/
│   └── ui/
│       └── node_modules/   # UI components dependencies
├── services/
│   └── trpc/
└── libraries/
    └── hooks/
```

## 🗄️ 2. Database Setup

### Configure Environment Variables
```bash
# Copy environment template
cp .env.example .env.local
```

**Update `.env.local`:**
```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://user:pass@localhost:5432/blogdb"

# tRPC API - Points to Next.js app (port 3000)
NEXT_PUBLIC_TRPC_URL="http://localhost:3000"
```

**Database URL Examples:**
```bash
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/blogdb"

# Docker PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"

# Neon/Supabase (cloud)
DATABASE_URL="postgresql://user:pass@host.neon.tech:5432/neondb?sslmode=require"
```

### Navigate to Database Package
```bash
# Navigate to database package
cd packages/db
```

### Generate Database Schema
```bash
# Generate Drizzle types and migrations
npx drizzle-kit generate:pg
```

**Expected Output:**
```
drizzle-kit: v0.20.x
drizzle-kit: generate
drizzle-kit: [✓] 54 tables found in schema
drizzle-kit: [✓] 3 views found in schema
drizzle-kit: [✓] 12 enums found in schema
drizzle-kit: [✓] Generated migrations in 'src/migrations'
```

### Run Database Migrations
```bash
# Apply schema to database
npx drizzle-kit push:pg
```

**Expected Output:**
```
Connected to database
Applied migrations:
  - posts table created
  - categories table created
  - post_categories junction table created
Migration completed successfully
```

### Seed Database with Sample Data
```bash
# Add sample posts, categories, and relationships
node seed.js
```

**Expected Output:**
```
Seeded database with:
- 5 categories (Technology, Design, Business, Tutorials, News)
- 7 posts (5 published, 2 drafts)
- Category relationships established
Seed completed successfully
```

### Verify Database Setup
```bash
# Connect to PostgreSQL and verify tables
psql $DATABASE_URL -c "\dt"

# Should show:
#            List of relations
#  Schema |     Name      | Type  |  Owner
# --------+---------------+-------+----------
#  public | categories    | table | postgres
#  public | post_categories | table | postgres
#  public | posts         | table | postgres

# Verify sample data
psql $DATABASE_URL -c "SELECT COUNT(*) as posts_count FROM posts;"

# Should show: posts_count = 7

psql $DATABASE_URL -c "SELECT COUNT(*) as categories_count FROM categories;"

# Should show: categories_count = 5
```

## 🚀 3. Starting Development Servers

### Start API Backend Server
```bash
# Terminal 1: Start tRPC API server
cd apps/api
npm run dev
```

**Expected Output:**
```
tRPC server ready on port 4000
✓ Database connected
✓ API routes initialized
✓ Server listening on http://localhost:4000
```

**Note:** If `apps/api` directory doesn't exist, the tRPC API is integrated into the Next.js application. In this case, skip this step and proceed to frontend setup.

### Start Frontend Development Server
```bash
# Terminal 2: Start Next.js frontend (or Terminal 1 if no separate API)
cd apps/blog
npm run dev
```

**Expected Output:**
```
▲ Next.js 15.0.0 (turbopack)
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 1.2s
✓ Compiled successfully
✓ Server listening on http://localhost:3000
```

**Key Points:**
- Frontend runs on **http://localhost:3000**
- Hot reload enabled for file changes
- tRPC API integrated via `/api/trpc/*` routes (if no separate API server)
- React Query devtools available in browser

### Environment Configuration
**Update `.env.local` for frontend:**
```env
# If using separate API server (port 4000)
NEXT_PUBLIC_TRPC_URL="http://localhost:4000/trpc"

# If API is integrated in Next.js app (port 3000)
NEXT_PUBLIC_TRPC_URL="http://localhost:3000"
```

### Full Stack Verification
```bash
# Check both servers are running
curl http://localhost:3000  # Should return HTML
curl http://localhost:4000/trpc/posts.getPosts  # Should return JSON (if separate API)
```

## 🌐 4. Viewing Output in Browser

### Landing Page (`http://localhost:3000`)
**Expected Display:**
- ✅ **5-section layout**: Hero with CTA, features cards, stats section, tech showcase, footer
- ✅ **Interactive elements**: Theme toggle (light/dark/system), navigation menu
- ✅ **Responsive design**: Mobile hamburger menu, responsive cards
- ✅ **No console errors**: Open dev tools and check console

**Test Interactions:**
1. **Theme Toggle**: Click theme switcher in header - should persist across refreshes
2. **Navigation**: Click menu items - smooth scrolling to sections
3. **Mobile View**: Resize browser or use dev tools mobile view - hamburger menu appears
4. **Links**: All internal/external links work correctly

### Dashboard (`/dashboard`)
**Expected Display:**
- ✅ **Stats Cards**: Total posts, published count, drafts count, categories count
- ✅ **Recent Posts Table**: Latest 5 posts with status badges and action buttons
- ✅ **Quick Actions**: "New Post", "New Category" buttons
- ✅ **Responsive Layout**: Cards stack on mobile

**Test Functionality:**
1. **Stats Update**: Values should update after creating/editing posts
2. **Action Buttons**: Click buttons to navigate to creation pages
3. **Post Links**: Click post titles to navigate to individual post pages

### Posts Listing (`/posts`)
**Expected Display:**
- ✅ **Search Bar**: Real-time search functionality
- ✅ **Category Filters**: Badge-style filter buttons
- ✅ **Grid Layout**: 5 published posts in responsive card layout
- ✅ **Pagination**: Navigation controls (when more posts exist)
- ✅ **Post Cards**: Title, excerpt, author, reading time, category badges

**Test Interactions:**
1. **Search**: Type in search bar - filters posts by title/content
2. **Category Filter**: Click category badges - filters by category
3. **Post Cards**: Click cards to navigate to individual post view
4. **Mobile Grid**: Cards stack properly on small screens

### Post Creation (`/posts/new`)
**Expected Display:**
- ✅ **Form Layout**: Two-column layout (editor + preview)
- ✅ **Markdown Editor**: Rich text editor with syntax highlighting
- ✅ **Live Preview**: Toggle between edit and preview modes
- ✅ **Form Fields**: Title, content, excerpt, author, categories, publish toggle
- ✅ **Validation**: Real-time form validation with error messages

**Test Workflow:**
1. **Fill Form**: Enter title, content, author information
2. **Preview Toggle**: Switch between edit and preview modes
3. **Category Selection**: Select multiple categories
4. **Draft vs Publish**: Toggle publish checkbox
5. **Submit**: Click "Save Draft" or "Publish Post" - success toast appears

### Individual Post View (`/posts/[slug]`)
**Expected Display:**
- ✅ **Full Content**: Rendered markdown with proper formatting
- ✅ **Post Metadata**: Title, author, publish date, reading time, word count
- ✅ **Category Badges**: Clickable category links (filters posts)
- ✅ **Responsive Layout**: Proper mobile formatting

**Test Features:**
1. **Category Links**: Click category badges - redirects to filtered listing
2. **Theme Persistence**: Switch themes - should persist across pages
3. **Content Rendering**: All markdown elements render correctly (headers, code blocks, links)

### Mobile Responsiveness Testing
```bash
# Use browser dev tools or actual mobile device
# Expected behavior:
- Navigation collapses to hamburger menu
- Cards stack vertically
- Form layouts adjust for touch interaction
- Text remains readable
- Touch targets are appropriately sized (44px minimum)
```

### Error Simulation
```bash
# Test error handling:

# 1. Database disconnection
# Change DATABASE_URL to invalid connection
# Expected: User-friendly error messages, graceful degradation

# 2. Network issues
# Use browser dev tools Network tab to simulate offline
# Expected: Error boundaries, retry mechanisms

# 3. Form validation
# Submit forms with missing required fields
# Expected: Inline validation errors, prevented submission
```

## 🧪 5. Testing Commands

### Run Complete Test Suite
```bash
# From project root
npm test
```

**Expected Output:**
```
PASS src/__tests__/post-workflow.test.tsx
PASS src/__tests__/integration.test.tsx
PASS src/__tests__/content-utils.test.tsx

Test Suites: 3 passed, 3 total
Tests: 15 passed, 15 total
Snapshots: 0 total
Time: 2.345s
Ran all test suites.

Coverage: 85.6% statements, 82.3% branches, 88.1% functions, 84.2% lines
```

### Individual Test Commands
```bash
# Unit tests only
cd apps/blog
npm run test src/__tests__/content-utils.test.tsx

# Integration tests
npm run test src/__tests__/integration.test.tsx

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Build Verification
```bash
# Test production build
cd apps/blog
npm run build
```

**Expected Output:**
```
▲ Next.js 15.0.0
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (0/3)

Build successful in 15.2s
```

### Lint and Code Quality
```bash
# Run linting across all workspaces
npm run lint

# Format code
npm run format
```

**Expected Output:**
```
✓ No ESLint warnings or errors
✓ All files formatted with Prettier
✓ TypeScript compilation successful
```

## 🔧 6. Troubleshooting

### Port Conflicts
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Alternative: Change port in apps/blog/package.json
"scripts": {
  "dev": "next dev -p 3001"
}

# Update .env.local accordingly
NEXT_PUBLIC_TRPC_URL="http://localhost:3001"
```

### Database Connection Issues
```bash
# Test database connection
npx drizzle-kit introspect:pg

# Check PostgreSQL service
# Windows: Services.msc -> PostgreSQL service running
# macOS: brew services list
# Docker: docker ps | grep postgres

# Reset database
npm run db:migrate  # Re-run migrations
```

### tRPC API Issues
```bash
# Verify tRPC routes
# Check browser console for API errors
# Ensure NEXT_PUBLIC_TRPC_URL matches server URL

# Debug tRPC queries
# Open browser dev tools -> Network tab
# Look for /api/trpc/* requests - should return 200 OK

# Test API directly (if separate server)
curl http://localhost:4000/trpc/posts.getPosts
```

### Monorepo Dependency Issues
```bash
# Clean install all dependencies
rm -rf node_modules
rm -rf **/node_modules
npm install

# Install specific workspace
npm install --workspace=apps/blog

# Check workspace configuration
cat package.json | grep workspaces  # Should show all workspace paths
```

### Module Resolution Issues
```bash
# Clear Next.js cache
cd apps/blog
rm -rf .next
npm run dev

# Clear npm cache
npm cache clean --force
npm install
```

### Performance Issues
```bash
# Bundle analysis
cd apps/blog
ANALYZE=true npm run build

# Check bundle size
# Should open bundle analyzer in browser
# Look for large dependencies or duplicate packages
```

## 🛑 Stopping Development

### Graceful Shutdown
```bash
# Terminal 1: Frontend (Ctrl+C)
# Terminal 2: API (if separate) (Ctrl+C)

# Or kill processes by port
npx kill-port 3000  # Frontend
npx kill-port 4000  # API (if separate)
```

### Clean Restart
```bash
# Clean all caches and reinstall
rm -rf node_modules
rm -rf **/node_modules
rm -rf apps/blog/.next
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## 📊 Expected Full Flow

**Complete Development Workflow:**

1. **Setup**: `npm install` → `npm run db:migrate` → `npm run db:seed`
2. **Development**: `cd apps/blog && npm run dev` (http://localhost:3000)
3. **Landing Page**: 5-section responsive layout with theme toggle
4. **Dashboard**: Real-time stats and recent posts management
5. **Create Post**: Markdown editor → preview → draft/publish workflow
6. **Posts Listing**: Search, filter, responsive grid layout
7. **Post View**: Full content with category filtering and theme persistence
8. **Testing**: `npm test` - 80%+ coverage, all tests passing
9. **Build**: `npm run build` - production build successful
10. **Deployment Ready**: Configured for Vercel with security headers

## ✅ Verification Checklist

- [ ] **Installation**: All dependencies installed without errors
- [ ] **Database**: Tables created and seeded with sample data
- [ ] **Frontend**: Running on localhost:3000 with hot reload
- [ ] **API**: tRPC routes responding correctly (check Network tab)
- [ ] **Features**: All CRUD operations working via UI
- [ ] **Responsive**: Mobile layout functioning properly
- [ ] **Themes**: Dark/light mode switching and persistence
- [ ] **Testing**: All tests passing with good coverage
- [ ] **Build**: Production build completes successfully
- [ ] **No Console Errors**: Clean browser console in all pages
- [ ] **Performance**: Fast loading and smooth interactions

## 🎯 **Success Criteria**

**All Systems Operational:**
- ✅ Database connected and seeded
- ✅ Frontend server running on port 3000
- ✅ tRPC API routes responding (200 OK)
- ✅ All pages loading without errors
- ✅ CRUD operations working end-to-end
- ✅ Theme switching functional
- ✅ Mobile responsive design working
- ✅ Tests passing with 80%+ coverage
- ✅ Production build successful
- ✅ No security vulnerabilities

**🚀 Ready for development and deployment!**

---

**Expected full flow**: Landing → Dashboard → Create draft post → Publish → Filter in listing → View post with dark mode. All type-safe with no console errors.
