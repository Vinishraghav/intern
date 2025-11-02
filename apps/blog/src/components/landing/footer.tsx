import Link from 'next/link'
import { Twitter, Github, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const navigation = {
    main: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contact', href: '/contact' },
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
    ],
    social: [
      {
        name: 'Twitter',
        href: 'https://twitter.com',
        icon: Twitter,
      },
      {
        name: 'GitHub',
        href: 'https://github.com',
        icon: Github,
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: Linkedin,
      },
      {
        name: 'Email',
        href: 'mailto:hello@example.com',
        icon: Mail,
      },
    ],
  }

  return (
    <footer className="bg-white">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-900">StoryForge</h3>
            <p className="mt-4 text-sm text-gray-500">
              Empowering writers to share their stories with the world.
            </p>
            <div className="flex mt-6 space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-pink-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/features" className="text-base text-gray-600 hover:text-pink-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-base text-gray-600 hover:text-pink-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-base text-gray-600 hover:text-pink-600">
                  Templates
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-base text-gray-600 hover:text-pink-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base text-gray-600 hover:text-pink-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-base text-gray-600 hover:text-pink-600">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">n              <li>
                <Link href="/help" className="text-base text-gray-600 hover:text-pink-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-base text-gray-600 hover:text-pink-600">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-base text-gray-600 hover:text-pink-600">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-12 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} StoryForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
