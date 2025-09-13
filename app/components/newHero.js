"use client"
import React from "react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-white pt-20 sm:pt-24">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/df0nclqqi/video/upload/v1757770106/DJI_0276_1_hrgasb.mp4" // Replace with your video file path
        autoPlay
        loop
        muted
      ></video>

      {/* Color Overlay (bluish filter) */}
      <div className="absolute inset-0 bg-[#080229]/60 mix-blend-multiply"></div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full flex flex-wrap items-center justify-between px-4 sm:px-6 py-4 z-20 bg-transparent">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/nav.webp" alt="Arena Lads" className="h-14 sm:h-15" />
          <span className="text-lg sm:text-xl font-bold">Idealarena</span>
        </div>

        {/* Nav Links */}
        <nav className="mt-2 sm:mt-0">
          <button onClick={() => { router.push("/user") }} className="border border-green-400 px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-green-500 hover:text-black transition text-sm sm:text-base">
            Book Now
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-full overflow-x-auto">
        <h1 className="whitespace-nowrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight inline-block">
          GAME ON! YOUR GATEWAY TO <br /> INFINITE ADVENTURES
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-200 font-medium">
          UNLEASH YOUR INNER CHAMPION
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => { router.push("/user") }} className="bg-[#080229] hover:bg-[#0c0340] px-5 py-2 sm:px-6 sm:py-3 rounded font-semibold transition text-sm sm:text-base">
            Book Now
          </button>
          <a href="https://wa.me/03365699561">
            <button className="border border-white hover:bg-white hover:text-black px-5 py-2 sm:px-6 sm:py-3 rounded font-semibold transition text-sm sm:text-base">
              Contact Us
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
