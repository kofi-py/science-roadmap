import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-space-blue-900 via-space-blue-800 to-fusion-purple-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔬</span>
              Science Roadmap
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Making world-class science education accessible to everyone, everywhere. Free forever.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/curriculum" className="text-white/70 hover:text-electric-cyan-400 transition-colors text-sm">
                  Browse Curriculum
                </Link>
              </li>
              <li>
                <Link href="/diagnostic" className="text-white/70 hover:text-electric-cyan-400 transition-colors text-sm">
                  Take Diagnostic
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-white/70 hover:text-electric-cyan-400 transition-colors text-sm">
                  Join Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.khanacademy.org/science" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-electric-cyan-400 transition-colors text-sm">
                  Khan Academy
                </a>
              </li>
              <li>
                <a href="https://ocw.mit.edu/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-electric-cyan-400 transition-colors text-sm">
                  MIT OpenCourseWare
                </a>
              </li>
              <li>
                <a href="https://phet.colorado.edu/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-electric-cyan-400 transition-colors text-sm">
                  PhET Simulations
                </a>
              </li>
              <li>
                <a href="https://www.nasa.gov/stem" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-electric-cyan-400 transition-colors text-sm">
                  NASA Education
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <div className="text-white/70 text-sm">
                📧 hello@scienceroadmap.org
              </div>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xl">📸</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              © 2025 Science Roadmap. All rights reserved. Made with 💚 for curious minds.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
