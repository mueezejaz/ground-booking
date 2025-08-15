import { Button } from "@/components/ui/button"
export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden text-[var(--color-secondary)]">
      <video
        className="absolute inset-0 object-cover w-full h-full"
        src="./bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-wider text-[var(--color-secondary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-tight"
        >
          EAT. <span className="text-[var(--color-primary)]">DRINK.</span> PLAY.
        </h1>

        <h2
          className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-primary)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] leading-tight"
        >
          WELCOME TO FAMILY GOLF!
        </h2>
        <p
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-xs sm:max-w-lg md:max-w-2xl text-[var(--color-muted)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] leading-relaxed"
        >
          A world-class Toptracer driving range and golf venue. Perfect for families, friends, and fanatics alike. Swing, relax, and have fun!
        </p>
      </div>
    </section>
  );
}


