export default function Loading() {
    return (
        <div className=" flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-secondary border-t-accent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-accent text-lg font-semibold">Loading...</p>
            </div>
        </div>

    )
}