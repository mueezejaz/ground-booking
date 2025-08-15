export default function Loading() {
    return (
        <div className="bg-primary text-secondary flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-secondary border-t-accent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-accent text-lg font-semibold">Loading...</p>
            </div>
        </div>

    )
}