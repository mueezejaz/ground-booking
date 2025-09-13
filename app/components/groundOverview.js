export default function GroundOverview() {
  return (
    <div className="relative min-h-screen bg-[#080229] text-white overflow-hidden font-sans">
      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="/bg.jpeg" // Replace with your image file path
        alt="Background"
      />

      {/* Color Overlay (bluish filter) */}
      <div className="absolute inset-0 bg-[#080229]/60 mix-blend-multiply"></div>

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left section with text and stats */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight">
              The Heart of the Neighborhood Pitch
            </h1>
            <p className="text-gray-300 max-w-lg mx-auto lg:mx-0">
              This is more than just a ground; it's where legends are born. With dust underfoot and passion in the air, our simple pitch is the truest test of skill. It's a place built by the community, for the community, where every match is a story waiting to be told.
            </p>
          </div>

          {/* Stats section */}
          <div className="flex justify-center lg:justify-start gap-8 md:gap-16">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">800</div>
              <div className="text-sm uppercase tracking-wide text-gray-300">Win Matches</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">935</div>
              <div className="text-sm uppercase tracking-wide text-gray-300">Matches Played</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">24</div>
              <div className="text-sm uppercase tracking-wide text-gray-300">Tournament Won</div>
            </div>
          </div>

          <button className="px-8 py-3 mt-8 font-semibold rounded-full text-white bg-transparent border-2 border-white hover:bg-white hover:text-[#080229] transition-colors duration-300">
            Contact Us
          </button>
        </div>

        {/* Right section with images and text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end relative">
          <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-9xl font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 opacity-20">
            Test Your Limits
          </h2>
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden -rotate-6 transform shadow-2xl">
            <img
              src="/bg.jpeg"
              alt="Gaming scene"
              className="absolute inset-0 w-full h-full object-cover rounded-lg transform rotate-6 scale-125 transition-transform duration-500 ease-in-out hover:scale-100"
            />
          </div>
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mt-6 rotate-3 transform shadow-2xl">
            <img
              src="/bg.jpeg"
              alt="Gaming scene"
              className="absolute inset-0 w-full h-full object-cover rounded-lg transform -rotate-3 scale-125 transition-transform duration-500 ease-in-out hover:scale-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
