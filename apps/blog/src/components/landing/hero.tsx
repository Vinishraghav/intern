import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { gradients, shadows } from '@/styles/theme'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-white -z-10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container px-4 py-24 mx-auto text-center sm:py-32 lg:py-40">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          <span className="block">Create, Share, and</span>
          <span className={`block bg-clip-text text-transparent ${gradients.pink.replace('bg-', 'bg-gradient-to-r ')}`}>
            Inspire with Words
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-600">
          A beautiful platform for writers and readers to connect through the power of storytelling. 
          Share your thoughts, read amazing content, and join our growing community.
        </p>
        
        <div className="flex flex-col justify-center gap-4 mt-10 sm:flex-row sm:gap-6">
          <Button 
            asChild 
            size="lg" 
            className={`text-white ${gradients.pink} ${shadows.pink} hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1`}
          >
            <Link href="/signup">
              Get Started for Free
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400"
          >
            <Link href="/explore">
              Explore Stories
            </Link>
          </Button>
        </div>
        
        <div className="mt-16">
          <div className="relative inline-flex items-center justify-center w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-pink-600 bg-white">Trusted by thousands of writers</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
            {['Forbes', 'TechCrunch', 'Wired', 'The Verge', 'Medium'].map((company) => (
              <div key={company} className="text-xl font-medium text-gray-500 hover:text-pink-500 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -right-32 top-1/4 -z-10 h-64 w-64 rounded-full bg-pink-100 opacity-50 blur-3xl" />
      <div className="absolute -left-32 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-rose-100 opacity-50 blur-3xl" />
    </section>
  )
}
