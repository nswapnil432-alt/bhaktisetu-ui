import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
// 🎯 1. Define the Interface (This fixes your error)
interface RateMaharajProps {
  providerName: string;
  onSave: (rating: number, comment: string) => void;
  onClose: () => void; // Added this so you can close the modal
}

// 🎯 2. Apply the Interface to the component
export default function RateMaharajModal({ providerName, onSave, onClose }: RateMaharajProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* 🏛️ Main Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {/* Header Image/Icon */}
        <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] h-32 flex items-center justify-center relative">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg text-4xl">
            🙏
          </div>
          <button onClick={onClose} className="absolute top-4 right-6 text-white font-bold text-lg">✕</button>
        </div>

        <div className="p-8 pt-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 leading-tight">
            How was your Seva with <br/> <span className="text-[#FF9933]">{providerName}</span>?
          </h3>
          
          {/* ⭐ STAR PICKER */}
          <div className="flex justify-center gap-3 my-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                type="button" // 👈 Added to prevent form submission issues
                onClick={(e) => {
                  e.stopPropagation(); // 👈 Prevents the modal from closing if background click logic exists
                  setRating(star);
                }}
                className="transform transition-transform active:scale-75"
              >
                <Star 
                  size={42} 
                  className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
                />
              </button>
            ))}
          </div>

          <div className="text-left space-y-2 mb-8">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Experience</label>
            <textarea 
              value={comment}
              placeholder="Ex: The Kirtan was very spiritual and peaceful..."
              className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-orange-200 outline-none min-h-[100px] resize-none"
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

        {/* 🚀 THE FIXED BUTTON */}
                  <button
                      type="button" // 👈 Prevents default form behavior
                      onClick={(e) => {
                          e.stopPropagation(); // 👈 Prevents click from bubbling up
                          console.log("Submit clicked in Modal!");
                          onSave(rating, comment); // 👈 THIS MUST MATCH THE PROP NAME
                      }}
                      className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition-all cursor-pointer z-[110]"
                  >
                      Submit Review & Blessings
                  </button>
        </div>
      </motion.div>
    </div>
  );
}