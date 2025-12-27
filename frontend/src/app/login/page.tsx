'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authAPI.login(formData.username, formData.email);
      if (result.success) {
        // Redirect to home or previous page
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-blue-900 via-fusion-purple-900 to-space-blue-900 flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-electric-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-neon-green-500/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-cyan-500 to-fusion-purple-500 mb-4 shadow-neon-cyan">
            <span className="text-4xl">🔬</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Sign in to continue your science journey</p>
        </div>

        {/* Login Card */}
        <div className="science-card p-8 backdrop-blur-lg bg-white/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-space-blue-900 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-electric-cyan-500 focus:ring-2 focus:ring-electric-cyan-200 outline-none transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-space-blue-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-electric-cyan-500 focus:ring-2 focus:ring-electric-cyan-200 outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Cookie Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <span className="text-xl">🍪</span>
                <div className="text-sm text-gray-700">
                  <strong className="text-space-blue-900">Secure Authentication:</strong> We use HTTP-only cookies to keep your session secure. No passwords required!
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Info Text */}
            <p className="text-center text-sm text-gray-600">
              New here? No worries! Just enter your info and we'll create an account for you.
            </p>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-white/80">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-xs">Secure</div>
          </div>
          <div className="text-white/80">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs">Fast</div>
          </div>
          <div className="text-white/80">
            <div className="text-2xl mb-1">🎓</div>
            <div className="text-xs">Free</div>
          </div>
        </div>
      </div>
    </div>
  );
}
