"use client"
import React, { useState } from 'react';

const groundPictures = [
    { id: 1, src: './bg.jpeg', alt: 'Ground picture 1' },
    { id: 2, src: './bg.jpeg', alt: 'Ground picture 2' },
    { id: 3, src: './bg.jpeg', alt: 'Ground picture 3' },
    { id: 4, src: './bg.jpeg', alt: 'Ground picture 4' },
];

const GroundShowcase = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === groundPictures.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? groundPictures.length - 1 : prevIndex - 1
        );
    };

    return (
        <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Grounds Showcase</h2>

                <div className="relative w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
                    {/* Main Image with Fade Transition */}
                    {groundPictures.map((pic, index) => (
                        <img
                            key={pic.id}
                            src={pic.src}
                            alt={pic.alt}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    ))}

                    {/* Navigation Buttons */}
                    <button
                        onClick={goToPrev}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                    >
                        &#10095;
                    </button>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex justify-center space-x-4 mt-8">
                    {groundPictures.map((pic, index) => (
                        <div
                            key={pic.id}
                            className={`w-20 h-20 overflow-hidden rounded-md cursor-pointer transition-all duration-300 ${index === currentImageIndex ? 'ring-4 ring-blue-500' : 'opacity-70 hover:opacity-100'
                                }`}
                            onClick={() => setCurrentImageIndex(index)}
                        >
                            <img src={pic.src} alt={pic.alt} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GroundShowcase;
