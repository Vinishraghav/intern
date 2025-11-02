'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, BookOpen, Plus, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
}

const mainNavItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: 'Posts',
    href: '/posts',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: 'New Post',
    href: '/posts/new',
    icon: <Plus className="h-4 w-4" />,
  },
  {
    title: 'Categories',
    href: '/categories',
    icon: <Settings className="h-4 w-4" />,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  // Generate breadcrumbs
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .reduce<Array<{ label: string; href: string }>>((acc, curr, index, array) => {
      const href = `/${array.slice(0, index + 1).join('/')}`
      acc.push({
        label: curr.charAt(0).toUpperCase() + curr.slice(1).replace(/-/g, ' '),
        href,
      })
      return acc
    }, [])

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-bold">Blog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-1 md:flex">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
                item.disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          {/* User menu or auth buttons would go here */}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-base font-medium',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
                  item.disabled && 'cursor-not-allowed opacity-50'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="container border-t">
        <nav className="flex overflow-x-auto py-2" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
                <span className="mx-2 text-muted-foreground">/</span>
                <Link
                  href={crumb.href}
                  className={cn(
                    'text-sm font-medium',
                    index === breadcrumbs.length - 1
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
