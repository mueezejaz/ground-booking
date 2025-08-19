import React from 'react';

const ClientReviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      review:
        'An incredible experience! The range is top-notch, and the atmosphere is perfect for a day out with the family. We all had a blast and will definitely be back soon!',
      avatar: './bg.jpeg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      review:
        'Absolutely loved our time at Family Golf. The Toptracer technology is a game-changer, making it fun for both serious golfers and complete beginners. Highly recommend!',
      avatar: './bg.jpeg',
    },
    {
      id: 3,
      name: 'Peter Jones',
      review:
        'A fantastic venue with great facilities and friendly staff. The food and drinks were excellent too. It’s the perfect spot to practice your swing or just have a good time.',
      avatar: './bg.jpeg',
    },
  ];

  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-secondary">
          Client Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-dark p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <p className="text-white text-sm mb-4">"{review.review}"</p>
              <div className="flex items-center">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-bold text-secondary">{review.name}</p>
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

