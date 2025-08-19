"use client"
import  { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="w-full px-4 sm:px-6 py-4 flex justify-between items-center absolute top-0 z-50  ">
      <img
        src="./nav.webp"
        alt="Logo"
        className="h-12 sm:h-13 md:h-15 object-contain"
      />

      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/user")}
          className="bg-accent text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition text-sm sm:text-base"
        >
          BOOK NOW
        </button>
      </div>
    </nav>
  );
}


