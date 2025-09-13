import React from 'react';

const Icon = ({ pathData, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d={pathData} />
  </svg>
);

export default async function RecentBookings() {
  const res = await fetch("https://www.idealarena.com/api/user/getbookings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const { bookings } = await res.json();
  if (bookings.length < 1) {
    return
  }
  return (
    <div className="bg-[#080229]  font-inter text-white relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
          Recent Bookings
        </h1>
        <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto text-gray-300 leading-relaxed">
          Here are some of our most recent confirmed bookings.
        </p>

        <div className="mt-8 flex flex-col items-center">
          {bookings.map((booking, index) => {
            const startDate = new Date(booking.startDateTime);
            const endDate = new Date(booking.endDateTime);
            const formattedStartTime = startDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Karachi'
            });
            const formattedEndTime = endDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Karachi'
            });

            return (
              <div
                key={booking._id}
                className="bg-[#0e053a] p-6 rounded-xl shadow-lg w-full max-w-4xl transition-transform duration-300 transform hover:scale-105 mb-4 border border-[#665EFF]/20"
              >
                {/* Parent container: vertical on small, horizontal + spaced on larger screens */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-6">
                  {/* Left section: Booking details */}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-lg font-bold text-[#665EFF] uppercase tracking-wider">
                      {booking.contactName}
                    </span>
                    <span className="text-sm text-gray-400">
                      {startDate.toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {`Booked from ${formattedStartTime} to ${formattedEndTime}`}
                    </span>
                  </div>

                  {/* Right section: Price */}
                  <div className="flex flex-col items-end text-right">
                    <span className="text-lg font-bold text-gray-300">Price:</span>
                    <span className="text-2xl font-bold text-[#665EFF]">
                      {booking.price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
