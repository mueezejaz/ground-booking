export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center absolute top-0 z-50">
      <h1 className="text-[var(--color-primary)] font-extrabold text-xl md:text-2xl">
        FAMILY <span className="text-[var(--color-secondary)]">GOLF</span>
      </h1>


      <div className="hidden md:flex space-x-2">
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition">
          BOOK RANGE
        </button>
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition">
          BOOK GOLF
        </button>
      </div>
    </nav>
  );
}

