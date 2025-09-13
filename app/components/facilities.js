import React from 'react';
import { Trophy, Gamepad, Armchair, Dumbbell, Clock, ShieldCheck, Car, Goal, Medal } from 'lucide-react';

const Facilities = () => {
  return (
    <div className="bg-[#080229] min-h-screen font-inter text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background shapes - Responsive with Tailwind CSS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 md:w-12 md:h-12 bg-purple-500 rounded-lg animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-10 h-10 md:w-16 md:h-16 bg-orange-500 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-6 h-6 md:w-10 md:h-10 bg-red-500 rotate-45 animate-pulse opacity-40"></div>
        <div className="absolute top-2/3 left-1/2 w-12 h-12 md:w-20 md:h-20 bg-green-500 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/4 w-8 h-8 md:w-12 md:h-12 bg-yellow-500 rounded-sm animate-pulse opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
          Facilities We Offer
        </h1>
        <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto text-gray-300 leading-relaxed">
          Book your football and cricket ground easily. We provide top-notch facilities and all the necessary gear for a perfect match.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Football Ground */}
          <div className="bg-[#0e053a] p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center items-center mb-6">
              <Goal className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Football Ground Booking</h3>
            <p className="text-sm text-gray-300 mb-4">
              Reserve our state-of-the-art football pitches for your team's training or a friendly match.
            </p>
            <a href="#" className="text-[#665EFF] hover:underline text-sm font-semibold">
              Book Now
            </a>
          </div>

          {/* Card 2: Cricket Ground */}
          <div className="bg-[#0e053a] p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center items-center mb-6">
              <Medal className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Cricket Ground Booking</h3>
            <p className="text-sm text-gray-300 mb-4">
              Book our lush cricket grounds, perfect for tournaments and casual games with friends.
            </p>
            <a href="#" className="text-[#665EFF] hover:underline text-sm font-semibold">
              Book Now
            </a>
          </div>

          {/* Card 3: Gear & Equipment */}
          <div className="bg-[#0e053a] p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center items-center mb-6">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gear & Equipment</h3>
            <p className="text-sm text-gray-300 mb-4">
              Access high-quality sports gear, including balls, bats, and other necessary equipment for your game.
            </p>
            <a href="#" className="text-[#665EFF] hover:underline text-sm font-semibold">
              View Gear
            </a>
          </div>

          {/* Card 4: 24/7 Service */}
          <div className="bg-[#0e053a] p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center items-center mb-6">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">24/7 Service</h3>
            <p className="text-sm text-gray-300 mb-4">
              Our support staff and facilities are available around the clock to assist you with any needs.
            </p>
            <a href="#" className="text-[#665EFF] hover:underline text-sm font-semibold">
              Contact Us
            </a>
          </div>

          {/* Card 5: Security */}
          <div className="bg-[#0e053a] p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center items-center mb-6">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Security</h3>
            <p className="text-sm text-gray-300 mb-4">
              We provide professional security and surveillance to ensure your safety and peace of mind.
            </p>
            <a href="#" className="text-[#665EFF] hover:underline text-sm font-semibold">
              Learn More
            </a>
          </div>

          {/* Card 6: Parking */}
          <div className="bg-[#0e053a] p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center items-center mb-6">
              <Car className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Parking</h3>
            <p className="text-sm text-gray-300 mb-4">
              Ample and secure parking spaces are available for all our visitors right on site.
            </p>
            <a href="#" className="text-[#665EFF] hover:underline text-sm font-semibold">
              View Map
            </a>
          </div>

        </div>

        <div className="mt-12">
          <button className="bg-[#665EFF] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
