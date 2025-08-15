"use client"
import  { useRouter } from "next/navigation";
export default function Navbar() {
  const router = useRouter()
  return (
    <nav className="w-full px-4 sm:px-6 py-4 flex justify-between items-center absolute top-0 z-50">
      <h1 className="text-[var(--color-primary)] font-extrabold text-lg sm:text-xl md:text-2xl">
        FAMILY <span className="text-[var(--color-secondary)]">GOLF</span>
      </h1>

      <div className="flex">
        <button onClick={()=>{router.push("/user")}} className="bg-[var(--color-primary)] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full font-semibold hover:opacity-90 transition text-sm sm:text-base">
          BOOK NOW
        </button>
      </div>
    </nav>
  );
}

