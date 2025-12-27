'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Frontend Error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3 lowercase">
                    experiment failed
                </h1>

                <p className="text-gray-600 mb-8">
                    an unexpected anomaly occurred in the laboratory. we've logged the error and are investigating the catalyst.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => reset()}
                        className="btn-primary w-full lowercase"
                    >
                        try the experiment again
                    </button>

                    <Link
                        href="/"
                        className="block text-gray-500 hover:text-gray-700 text-sm lowercase"
                    >
                        abort and return home
                    </Link>
                </div>
            </div>
        </div>
    )
}
