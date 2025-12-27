import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8 relative flex justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-electric-cyan-500 to-fusion-purple-500 rounded-full flex items-center justify-center shadow-neon-cyan animate-pulse">
                        <span className="text-white text-5xl font-bold">?</span>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-space-blue-900 mb-4 lowercase">
                    hypothesis not found
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    it seems this coordinate in the scientific cosmos doesn't exist.
                    the data you're looking for might have collapsed into a singularity.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="btn-primary block w-full text-center"
                    >
                        return to base station
                    </Link>

                    <div className="pt-4">
                        <Link
                            href="/forum"
                            className="text-fusion-purple-600 hover:text-fusion-purple-700 font-medium lowercase"
                        >
                            ask the community for help
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
