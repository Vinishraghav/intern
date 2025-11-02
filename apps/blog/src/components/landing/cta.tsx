'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { gradients } from '@/styles/theme'

export function CTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-pink-50">
      <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="container relative px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Ready to start your writing journey?
          </h2>
          <p className="mx-auto mt-4 text-xl text-gray-600">
            Join our community of passionate writers and share your unique voice with the world.
          </p>
          
          <div className="flex flex-col justify-center gap-4 mt-10 sm:flex-row">
            <Button 
              asChild 
              size="lg" 
              className={`text-white ${gradients.pink} hover:opacity-90`}
            >
              <a href="/signup">
                Get Started for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              <a href="/explore">
                Read Stories
              </a>
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
