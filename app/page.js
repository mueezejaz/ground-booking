import React from 'react';
// import GroundShowcase from "./components/GroundShowCase";
// import FeedbackForm from "./components/FeedBackForm";
import HeroSection from "./components/newHero.js";
import GroundOverview from "./components/groundOverview.js";
import ClientReviews from "./components/ClintReviews";
// import Recentbookings from "./components/recentBooking.js";
import Footer from "./components/Footer.js";
import Facilities from "./components/facilities.js";
// import CountdownPage from "./components/commingSoon.js";

function Whatsapp() {
  return (
    <>
      <a
        href="https://wa.me/03365699561" // replace with your actual WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="w-6 h-6"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.945 7.945 0 008 .001a7.942 7.942 0 00-6.764 11.91L.15 16l4.206-1.103A7.943 7.943 0 008 16a7.945 7.945 0 005.675-13.674zM8 14.535a6.48 6.48 0 01-3.301-.899l-.237-.14-2.493.654.666-2.43-.155-.25A6.484 6.484 0 018 1.465a6.482 6.482 0 016.475 6.476A6.489 6.489 0 018 14.535zm3.69-4.846c-.201-.1-1.186-.585-1.37-.652-.184-.067-.318-.1-.451.1s-.518.652-.636.787c-.117.134-.234.15-.435.05-.201-.1-.847-.312-1.613-.995-.596-.53-.998-1.184-1.115-1.385-.117-.2-.012-.308.088-.408.09-.09.201-.234.301-.351.1-.117.134-.2.201-.334.067-.134.034-.25-.017-.351-.05-.1-.451-1.085-.618-1.487-.163-.392-.34-.451-.346-.117-.007-.25-.009-.384-.009a.738.738 0 00-.534.25c-.184.2-.701.684-.701 1.669s.718 1.936.818 2.07c.1.134 1.414 2.157 3.427 3.026.479.207.852.33 1.143.423.48.152.917.13 1.263.079.385-.057 1.186-.484 1.353-.951.167-.467.167-.867.117-.951-.05-.084-.184-.134-.384-.234z" />
        </svg>
      </a>
    </>
  );
}

export default function Home() {

  return (
    <>
      <HeroSection />
      <Facilities />
      <GroundOverview />
      {/* <Recentbookings /> */}
      <ClientReviews />
      <Footer />
      <Whatsapp />
    </>
  )
}
