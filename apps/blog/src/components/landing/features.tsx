import { PenTool, Heart, Sparkles, Zap } from 'lucide-react'
import { gradients } from '@/styles/theme'

const features = [
  {
    name: 'Beautiful Editor',
    description: 'Write and format your posts with our intuitive, distraction-free editor that supports markdown and rich text.',
    icon: PenTool,
  },
  {
    name: 'Engage Readers',
    description: 'Build a loyal following with built-in engagement features like reactions, comments, and sharing options.',
    icon: Heart,
  },
  {
    name: 'Smart Recommendations',
    description: 'Get personalized content recommendations based on your reading habits and interests.',
    icon: Sparkles,
  },
  {
    name: 'Lightning Fast',
    description: 'Experience blazing fast performance with our optimized platform that loads in the blink of an eye.',
    icon: Zap,
  },
]

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-2 text-sm font-medium text-pink-600 bg-pink-100 rounded-full">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Everything you need to share your story
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Our platform is packed with powerful features to help you create, publish, and grow your audience.
          </p>
        </div>

        <div className="grid gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div 
              key={feature.name}
              className="p-6 transition-all duration-300 bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${gradients.pink} text-white`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500">
          <div className="absolute -top-24 -right-20 w-64 h-64 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-20 w-64 h-64 bg-rose-400 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative px-6 py-16 sm:p-16">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to start writing?
              </h3>
              <p className="mt-4 text-pink-100">
                Join thousands of writers who are already sharing their stories with the world.
              </p>
              <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-pink-600 bg-white rounded-md hover:bg-gray-50"
                >
                  Get Started
                </a>
                <a
                  href="/explore"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-transparent border border-white border-solid rounded-md hover:bg-white/10"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
