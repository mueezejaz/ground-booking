import React from 'react';

const ClientReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Ali Ahmed",
      review:
        "The football pitch is in amazing condition! We had a tournament here and everything from the grass to the lighting was perfect. Definitely the best ground in the city.",
      avatar: "https://placehold.co/100x100/0e053a/ffffff?text=AA",
    },
    {
      id: 2,
      name: "Usman Tariq",
      review:
        "Fantastic place for a friendly match with my colleagues. The facilities are clean, the booking process was smooth, and the availability of gear made it super convenient. A great spot all around.",
      avatar: "https://placehold.co/100x100/0e053a/ffffff?text=UT",
    },
    {
      id: 3,
      name: "Bilal Hussain",
      review:
        "Excellent ground with great lighting for evening matches. The parking area is spacious, and the staff is always friendly and cooperative. Highly recommend it for weekend games.",
      avatar: "https://placehold.co/100x100/0e053a/ffffff?text=BH",
    },
    {
      id: 4,
      name: "Hamza Iqbal",
      review:
        "The turf quality is unmatched, and the environment is very professional. Booking was quick and easy, and everything was ready when we arrived. I’ll definitely return for more matches!",
      avatar: "https://placehold.co/100x100/0e053a/ffffff?text=HI",
    },
    {
      id: 5,
      name: "Zain Malik",
      review:
        "A fantastic place to play with friends! The amenities are well-maintained, and the security measures made everyone feel safe. One of the best sports grounds I’ve been to.",
      avatar: "https://placehold.co/100x100/0e053a/ffffff?text=ZM",
    },
    {
      id: 6,
      name: "Omar Farooq",
      review:
        "Loved the experience here! The booking system is simple, the facilities are top-notch, and the atmosphere is very welcoming. Great for both casual games and serious matches.",
      avatar: "https://placehold.co/100x100/0e053a/ffffff?text=OF",
    },
  ];

  return (
    <section className="bg-[#080229] min-h-[100vh] flex flex-col items-center justify-center font-inter text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rectangles */}
          <rect x="100" y="50" width="20" height="20" rx="4" fill="#665EFF" opacity="0.4" className="animate-pulse" />
          <rect x="250" y="150" width="30" height="30" rx="6" fill="#665EFF" opacity="0.4" className="animate-pulse" />
          <rect x="400" y="250" width="25" height="25" rx="5" fill="#665EFF" opacity="0.4" className="animate-pulse" />
          <rect x="550" y="350" width="35" height="35" rx="7" fill="#665EFF" opacity="0.4" className="animate-pulse" />
          {/* Triangles */}
          <polygon points="600,10 620,50 580,50" fill="#E67E22" opacity="0.4" className="animate-pulse" />
          <polygon points="800,200 830,260 770,260" fill="#E67E22" opacity="0.4" className="animate-pulse" />
          {/* Circles */}
          <circle cx="1000" cy="50" r="15" fill="#C0392B" opacity="0.4" className="animate-pulse" />
          <circle cx="1200" cy="200" r="20" fill="#C0392B" opacity="0.4" className="animate-pulse" />
          {/* Ovals */}
          <ellipse cx="100" cy="300" rx="15" ry="30" fill="#2ECC71" opacity="0.4" className="animate-pulse" />
          <ellipse cx="300" cy="500" rx="20" ry="40" fill="#2ECC71" opacity="0.4" className="animate-pulse" />
          {/* Plus signs */}
          <text x="50" y="500" fontFamily="Arial" fontSize="30" fill="#F1C40F" opacity="0.4" className="animate-pulse">+</text>
          <text x="200" y="700" fontFamily="Arial" fontSize="40" fill="#F1C40F" opacity="0.4" className="animate-pulse">+</text>
          {/* O's */}
          <text x="1300" y="600" fontFamily="Arial" fontSize="50" fill="#8E44AD" opacity="0.4" className="animate-pulse">O</text>
          <text x="1100" y="750" fontFamily="Arial" fontSize="60" fill="#8E44AD" opacity="0.4" className="animate-pulse">O</text>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide uppercase inline-block">
          Client Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#0e053a] p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              <p className="text-gray-300 text-sm mb-4">"{review.review}"</p>
              <div className="flex items-center">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-bold text-[#665EFF]">{review.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
