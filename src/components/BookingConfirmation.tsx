import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Share2, Calendar, Clock, MapPin, Download } from 'lucide-react';
import { CartItem } from '../App';
import { Button } from './ui/button';

interface BookingConfirmationProps {
  cartItems: CartItem[];
  onBackToHome: () => void;
}

export default function BookingConfirmation({ cartItems, onBackToHome }: BookingConfirmationProps) {
  const [confetti, setConfetti] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const bookingId = `BKT${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white relative overflow-hidden">
      {/* Animated confetti background */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
              }}
            >
              {['🎉', '✨', '🪔', '🙏', '🕉️'][i % 5]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 pt-12">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="text-white" size={64} />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full bg-green-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="mb-2 bg-gradient-to-r from-[#FF9933] to-[#FFD700] bg-clip-text text-transparent">
            🙏 Your Bhakti Event is Confirmed! 🙏
          </h1>
          <p className="text-gray-600">
            May your devotional gathering be blessed with divine grace
          </p>
        </motion.div>

        {/* Booking details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90">Booking ID</p>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Download size={18} />
              </button>
            </div>
            <h2 className="text-white">{bookingId}</h2>
          </div>

          {/* Services booked */}
          <div className="p-6 space-y-4">
            <h3 className="text-gray-900 mb-4">Booked Services</h3>
            
            {cartItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border-2 border-[#FF9933]/20"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#FF9933]">
                    <img
                      src={item.provider.avatar}
                      alt={item.provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{item.provider.name}</h4>
                    <p className="text-gray-600 mb-3">{item.provider.category}</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={14} />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Event location placeholder */}
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border-2 border-[#FF9933]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#FF9933] to-[#FFD700] rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-900">Event Location</p>
                  <p className="text-gray-600">To be confirmed with providers</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Button
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: 'BhaktiSetu Booking',
                    text: `My devotional event booking ${bookingId} is confirmed!`,
                  });
                } catch (error) {
                  // User cancelled or share not supported in this context
                  console.log('Share cancelled or not supported');
                }
              }
            }}
            variant="outline"
            className="w-full rounded-full h-12 border-2 border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933]/10"
          >
            <Share2 className="mr-2" size={20} />
            Share Booking Details
          </Button>

          <Button
            onClick={onBackToHome}
            className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white rounded-full h-12"
          >
            Back to Home
          </Button>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#FF9933]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#FF9933]">1</span>
              </div>
              <div>
                <p className="text-gray-900">Provider Confirmation</p>
                <p className="text-gray-600">All providers will confirm within 24 hours</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#FF9933]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#FF9933]">2</span>
              </div>
              <div>
                <p className="text-gray-900">Event Coordination</p>
                <p className="text-gray-600">You'll receive a dedicated event coordinator</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#FF9933]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#FF9933]">3</span>
              </div>
              <div>
                <p className="text-gray-900">Final Preparation</p>
                <p className="text-gray-600">Pre-event checklist will be shared</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blessing message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600 italic">
            "Bhakti mein shakti hai" - There is power in devotion 🙏
          </p>
        </motion.div>
      </div>
    </div>
  );
}