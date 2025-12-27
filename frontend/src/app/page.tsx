'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 circuit-pattern">
      {/* Animated Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-electric-cyan-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-fusion-purple-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-green-500/5 rounded-full blur-3xl animate-float pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center page-transition">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-electric-cyan-200">
              <span className="text-2xl">🔬</span>
              <span className="text-sm font-semibold text-space-blue-900 uppercase tracking-wide">
                90 Free Courses • K-12 to College
              </span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text-science">Master Science</span>
            <br />
            <span className="text-space-blue-900">From Curiosity to Discovery</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            A comprehensive journey through biology, chemistry, physics, and earth science—
            curated from world-class institutions, completely free.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/curriculum" className="btn-primary group">
              <span>Explore Curriculum</span>
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/diagnostic" className="btn-secondary">
              Take Diagnostic Test
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-neon-green-500 rounded-full animate-pulse"></span>
            <span>Free forever • Start learning now</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {[
            { number: '90+', label: 'Free Courses', icon: '📚' },
            { number: '20', label: 'Learning Levels', icon: '📊' },
            { number: '100%', label: 'Free Content', icon: '🎓' },
            { number: '∞', label: 'Possibilities', icon: '🚀' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="science-card p-6 text-center transform hover:scale-105 transition-all"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-electric-cyan-600 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-space-blue-900 mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Making world-class science education accessible to everyone, everywhere
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-cyan-400 to-electric-cyan-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  🧪
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-space-blue-900 mb-2">Hands-On Learning</h3>
                  <p className="text-gray-600">Interactive simulations, virtual labs, and real experiments from PhET, NASA, and more.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green-400 to-neon-green-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  🌍
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-space-blue-900 mb-2">World-Class Resources</h3>
                  <p className="text-gray-600">Curated content from MIT, Khan Academy, NASA, NOAA, and leading universities.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fusion-purple-400 to-fusion-purple-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-space-blue-900 mb-2">Structured Path</h3>
                  <p className="text-gray-600">Clear progression from kindergarten basics to college-level mastery in all sciences.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-space-blue-400 to-space-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-space-blue-900 mb-2">Community Support</h3>
                  <p className="text-gray-600">Join discussions, get homework help, and connect with fellow science enthusiasts.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="science-card p-8 bg-gradient-to-br from-space-blue-900 to-fusion-purple-900 text-white">
                <div className="text-6xl mb-6">🔭</div>
                <blockquote className="text-2xl font-light italic mb-4 leading-relaxed">
                  "Science is not only a disciple of reason but also one of romance and passion."
                </blockquote>
                <cite className="text-electric-cyan-300 font-semibold">— Stephen Hawking</cite>
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="text-sm text-white/80 mb-2">Start your journey today</div>
                  <Link href="/curriculum" className="inline-flex items-center gap-2 text-neon-green-400 font-semibold hover:gap-3 transition-all">
                    Browse All Courses
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-space-blue-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Three simple steps to master science</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Find Your Level',
                description: 'Take our diagnostic test to discover your current knowledge level across all science disciplines.',
                icon: '📋',
                color: 'from-electric-cyan-400 to-electric-cyan-600'
              },
              {
                step: '2',
                title: 'Follow the Path',
                description: 'Progress through structured levels from basic concepts to advanced research topics.',
                icon: '🛤️',
                color: 'from-neon-green-400 to-neon-green-600'
              },
              {
                step: '3',
                title: 'Join Community',
                description: 'Engage with fellow learners, share discoveries, and get help when you need it.',
                icon: '👥',
                color: 'from-fusion-purple-400 to-fusion-purple-600'
              }
            ].map((item, idx) => (
              <div key={idx} className="science-card p-8 hover:shadow-2xl transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl mb-6 shadow-lg`}>
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-electric-cyan-600 mb-2">STEP {item.step}</div>
                <h3 className="text-2xl font-bold text-space-blue-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-space-blue-900 via-fusion-purple-900 to-space-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Every Branch of Science
            </h2>
            <p className="text-xl text-white/80">From atoms to galaxies, cells to ecosystems</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🧬', title: 'Biology', courses: '22 courses', desc: 'Life sciences, genetics, ecology' },
              { icon: '⚗️', title: 'Chemistry', courses: '20 courses', desc: 'Atoms, reactions, materials' },
              { icon: '⚛️', title: 'Physics', courses: '24 courses', desc: 'Forces, energy, quantum' },
              { icon: '🌍', title: 'Earth Science', courses: '24 courses', desc: 'Geology, atmosphere, space' }
            ].map((subject, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/10">
                <div className="text-5xl mb-4">{subject.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{subject.title}</h3>
                <div className="text-neon-green-400 text-sm font-semibold mb-2">{subject.courses}</div>
                <p className="text-white/70 text-sm">{subject.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-space-blue-900 mb-6">
            Ready to Begin Your Scientific Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of learners exploring the wonders of science
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/curriculum" className="btn-primary text-lg px-8 py-4">
              Start Learning Now
            </Link>
            <Link href="/forum" className="btn-secondary text-lg px-8 py-4">
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
