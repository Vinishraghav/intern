import { Users, BookOpen, MessageSquare, Clock } from 'lucide-react'

export function Stats() {
  const stats = [
    { id: 1, name: 'Active Writers', value: '10,000+', icon: Users },
    { id: 2, name: 'Stories Published', value: '50,000+', icon: BookOpen },
    { id: 3, name: 'Community Comments', value: '1M+', icon: MessageSquare },
    { id: 4, name: 'Avg. Read Time', value: '5 min', icon: Clock },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-pink-50">
      <div className="container px-4 mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-pink-50 text-pink-600">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-pink-700 bg-pink-100 rounded-full">
            <span className="relative flex w-2 h-2 mr-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-pink-400"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-pink-500"></span>
            </span>
            Trusted by creators worldwide
          </div>
          
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Content Creator', avatar: '👩‍💻' },
                { name: 'Michael Chen', role: 'Tech Writer', avatar: '👨‍💻' },
                { name: 'Emily Wilson', role: 'Travel Blogger', avatar: '👩‍🎤' },
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="relative p-6 text-left bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="absolute -top-5 -left-5 flex items-center justify-center w-12 h-12 text-2xl bg-white rounded-full shadow-md">
                    {testimonial.avatar}
                  </div>
                  <blockquote className="mt-4">
                    <p className="text-gray-700">
                      "This platform has completely transformed how I share my stories. The community is amazing and the tools are top-notch."
                    </p>
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-pink-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
