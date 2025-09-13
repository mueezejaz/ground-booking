import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <>
      <div className="w-full h-[0.5px] bg-white opacity-20"></div>
      <footer className="bg-[#080229] text-white font-inter py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/nav.webp" alt="Arena Lads Logo" className="w-10 h-10" />
              <span className="text-xl font-bold">The idealarena</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-wide mb-4">
              STRATEGIZE. PLAY. CONQUER.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/profile.php?id=61580104964180" aria-label="Twitter">
                <Twitter className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
              </a>
              <a href="http://instagram.com/theidealarena/" aria-label="Instagram">
                <Instagram className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61580104964180" aria-label="Facebook">
                <Facebook className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Games Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-bold mb-4">Games</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">FootBall</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Cricket</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Hockey</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Badminton</a></li>
            </ul>
          </div>

          {/* Pages Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-bold mb-4">Pages</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Testimonials</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Faq</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Subscribe Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-bold mb-4">Join our Whatsapp Channel for Discount and offers</h4>
            <a href="https://whatsapp.com/channel/0029Vb6cRCFGU3BEUCAQOy1s">
              <button
                type="submit"
                className="w-full bg-[#665EFF] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
              >
                join
              </button>
            </a>
            <p className='mt-5'> Our whats app number : </p>
            <a className='mt-2' href="https://wa.me/03365699561">
              <p>03365699561</p>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          Copyright © 2024 Arena Lads By Eyonicmedia. All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
