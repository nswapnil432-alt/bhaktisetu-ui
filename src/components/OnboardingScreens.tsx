import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Music, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingScreensProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Mic,
    title: 'Organize your Bhakti Event effortlessly',
    description: 'Connect with verified Kirtankars, Gayaks, and spiritual performers for your devotional gatherings',
    color: '#FF9933',
    illustration: 'https://images.unsplash.com/photo-1575669572405-52da19d6a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBraXJ0YW4lMjBzcGlyaXR1YWwlMjBzaW5nZXJ8ZW58MXx8fHwxNzYyMTQ5NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Music,
    title: 'Find all services — from singer to sound',
    description: 'Access complete event solutions including musicians, decorators, lighting, and technical support',
    color: '#00AEEF',
    illustration: 'https://images.unsplash.com/photo-1612249075164-f5e6a6181364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtdXNpY2FsJTIwaW5zdHJ1bWVudHMlMjB0YWJsYXxlbnwxfHx8fDE3NjIxNDk0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Lightbulb,
    title: 'Plan, Book, and Celebrate Devotion',
    description: 'Seamlessly organize Kirtans, Pravachans, Poojas, and Bhajani Mandals with just a few taps',
    color: '#FFD700',
    illustration: 'https://images.unsplash.com/photo-1759674888817-8bbea9f89f1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBkZXZvdGlvbmFsJTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc2MjE0OTQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export default function OnboardingScreens({ onComplete }: OnboardingScreensProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Skip button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="text-gray-500 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            {/* Illustration */}
            <div className="relative w-full h-64 mb-8 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={slides[currentSlide].illustration}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-6"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
                  style={{ backgroundColor: `${slides[currentSlide].color}40` }}
                >
                  {React.createElement(slides[currentSlide].icon, {
                    size: 32,
                    color: 'white',
                  })}
                </div>
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-center mb-4 px-4"
              style={{ color: slides[currentSlide].color }}
            >
              {slides[currentSlide].title}
            </h2>

            {/* Description */}
            <p className="text-center text-gray-600 px-6 leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-6 pb-10">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8'
                  : 'w-2'
              }`}
              style={{
                backgroundColor: index === currentSlide ? slides[currentSlide].color : '#E5E7EB',
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          className="w-full rounded-full h-14 text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${slides[currentSlide].color}, ${slides[(currentSlide + 1) % slides.length].color})`,
          }}
        >
          {currentSlide === slides.length - 1 ? "Let's Begin" : 'Continue'}
          <ChevronRight className="ml-2" size={20} />
        </Button>
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-5">
        <div className="w-full h-full border-8 border-[#FF9933] rounded-full"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5">
        <div className="w-full h-full border-8 border-[#FFD700] rounded-full"></div>
      </div>
    </div>
  );
}
