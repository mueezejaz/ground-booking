export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden text-[var(--color-secondary)]">
      {/* Background Video */}
      <video
        className="absolute inset-0 object-cover w-full h-full"
        src="./bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Stronger Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-smj"></div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1
          className="text-6xl md:text-8xl font-extrabold tracking-wider text-[var(--color-secondary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
        >
          EAT. <span className="text-[var(--color-primary)]">DRINK.</span> PLAY.
        </h1>

        <h2
          className="mt-6 text-2xl md:text-4xl font-bold text-[var(--color-primary)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        >
          WELCOME TO FAMILY GOLF!
        </h2>

        <p
          className="mt-6 text-lg md:text-xl max-w-2xl text-[var(--color-muted)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
        >
          A world-class Toptracer driving range and golf venue. Perfect for families, friends, and fanatics alike. Swing, relax, and have fun!
        </p>
      </div>
    </section>
  );
}


