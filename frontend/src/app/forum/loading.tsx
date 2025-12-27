export default function ForumLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="space-y-3">
                        <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="h-12 w-40 bg-gray-300 rounded-lg"></div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64"></div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-96"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
