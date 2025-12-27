'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authAPI, cookieUtils } from '@/lib/api';

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in from cookie
    const userInfo = cookieUtils.getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/curriculum', label: 'Curriculum', icon: '📚' },
    { href: '/diagnostic', label: 'Diagnostic', icon: '📋' },
    { href: '/forum', label: 'Forum', icon: '💬' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-science border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-cyan-500 to-fusion-purple-500 flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              🔬
            </div>
            <span className="text-xl font-bold gradient-text-science hidden sm:inline">
              Science Roadmap
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-electric-cyan-100 text-electric-cyan-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}

            {/* User Menu */}
            {mounted && (
              <div className="ml-4 pl-4 border-l border-gray-300">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                      <div className="text-sm font-semibold text-space-blue-900">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-gradient-to-r from-electric-cyan-500 to-fusion-purple-500 text-white rounded-lg hover:shadow-neon-cyan transition-all font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
