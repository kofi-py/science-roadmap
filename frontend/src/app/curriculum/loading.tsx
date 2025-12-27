export default function CurriculumLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <div className="h-10 w-96 bg-gray-200 rounded-lg mx-auto"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded-lg mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-48"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
