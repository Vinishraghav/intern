import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Glow Effect */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/30 rounded-full bg-cyan-500/5 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-cyan-400 text-sm font-medium">Next-Gen Blogging Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                BlogSpace
              </span>
              <br />
              <span className="text-white">Reimagined</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              A futuristic platform where ideas come alive. Share your stories in a sleek, cutting-edge environment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/posts" 
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Explore Stories
              </Link>
              
              <Link 
                href="/register" 
                className="px-8 py-4 border-2 border-cyan-500/50 text-cyan-400 font-bold text-lg rounded-lg hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
              >
                Start Writing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Power Features
              </span>
            </h2>
            <p className="text-xl text-gray-400">Built for the modern content creator</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-cyan-500/50 transition-all duration-300">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Lightning Fast</h3>
              <p className="text-gray-400">Experience blazing-fast performance with our optimized infrastructure</p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-purple-500/50 transition-all duration-300">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Beautiful Editor</h3>
              <p className="text-gray-400">Create stunning content with our distraction-free writing experience</p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-pink-500/50 transition-all duration-300">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Global Reach</h3>
              <p className="text-gray-400">Share your ideas with readers from around the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/30 rounded-3xl backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Get Started?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of writers already using BlogSpace
            </p>
            <Link 
              href="/register" 
              className="inline-block px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
