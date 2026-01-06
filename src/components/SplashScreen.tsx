import React from 'react';
import { motion } from 'motion/react';

export default function SplashScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#FF9933] via-[#FFD700] to-[#FF9933] relative overflow-hidden">
      {/* Animated mandala pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-4 border-white rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center z-10">
        {/* Animated bell/aura */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 8C28 8 24 10 24 14V18C18 20 14 26 14 32C14 40 18 46 24 48V52C24 54 26 56 28 56H36C38 56 40 54 40 52V48C46 46 50 40 50 32C50 26 46 20 40 18V14C40 10 36 8 32 8Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="32" cy="54" r="2" fill="white" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* App name in Devanagari */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-2"
        >
          <h1 className="text-white text-5xl tracking-wider">भक्तिसेतु</h1>
        </motion.div>

        {/* App name in English */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-white text-3xl tracking-widest">BhaktiSetu</h2>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-4"
        >
          <p className="text-white/90 tracking-wide">Connect with Devotion</p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>
  );
}
