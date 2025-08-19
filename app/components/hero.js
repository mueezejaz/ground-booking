"use client"
import  { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative h-screen w-full overflow-hidden text-primary">
      <img
        className="absolute inset-0 object-cover w-full h-full"
        src="./bg.jpeg"
      />
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-wider text-secondary drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-tight"
        > THE IDEAL ARENA</h1>
        <p
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-xs sm:max-w-lg md:max-w-2xl text-[var(--color-muted)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] leading-relaxed"
        >
          Shaheed Hussain Ideal City, Korangi Link Rd, Bagh e Ibrahim
          Society Shah Faisal Colony, Shah Faisal Town, 40977
        </p>
b       <button onClick={() => { router.push("/user") }} className="bg-accent text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full font-semibold hover:opacity-90 transition text-sm sm:text-base">
          BOOK NOW
        </button>
      </div>
    </section>
  );
}


