"use client"

import { useState, useEffect } from "react";
const CountdownPage = () => {
  const launchDate = new Date('2025-09-14T18:00:00+05:00'); // Tomorrow at 6 PM PKT

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#080229] text-white overflow-hidden font-inter">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/df0nclqqi/video/upload/v1757770106/DJI_0276_1_hrgasb.mp4" // Replace with your video file path
          autoPlay
          loop
          muted
        ></video>
        <div className="bg-black opacity-50 absolute inset-0"></div>
      </div>

      {/* Pattern Shapes */}
      <div className="absolute inset-0 z-10 opacity-20" style={{ backgroundImage: "url(https://www.transparenttextures.com/patterns/cubes.png)" }}></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center p-4">
        {/* Logo Placeholder */}
        <img
          src="/nav.webp"
          alt="Company Logo"
          className="w-32 h-32 md:w-40 md:h-40 mb-6 animate-pulse"
        />

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#665EFF] uppercase tracking-wide mb-4">
          The IDEAL ARENA
        </h1>
        <p className="text-lg sm:text-xl text-white mb-8 max-w-lg">
          Our website is launching soon. Get ready to play.
        </p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center bg-[#0e053a] p-4 sm:p-6 rounded-lg shadow-lg border border-[#665EFF]/20 min-w-[90px] md:min-w-[120px]"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-sm sm:text-base text-gray-400 mt-1 uppercase">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownPage;
