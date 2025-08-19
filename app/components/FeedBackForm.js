import React from 'react';

const FeedbackForm = () => {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary inline-block">
            Grounds Showcase
          </h2>
          <div className="mt-2 w-29 h-1 bg-secondary mx-auto rounded"></div>
        </div>
        <div className="max-w-xl mx-auto">
          <form className="bg-dark p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-secondary font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border rounded-lg bg-primary text-white border-secondary placeholder-white focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-secondary font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border rounded-lg bg-primary text-white border-secondary placeholder-white focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-secondary font-bold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full px-3 py-2 border rounded-lg bg-primary text-white border-secondary placeholder-white focus:outline-none"
                placeholder="Your message..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;


