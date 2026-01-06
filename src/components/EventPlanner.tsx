import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, X, Calendar, Clock, Tag, Sparkles } from 'lucide-react';
import { CartItem } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EventPlannerProps {
  cartItems: CartItem[];
  onBack: () => void;
  onConfirm: () => void;
  onClearCart: () => void;
}

export default function EventPlanner({ cartItems, onBack, onConfirm, onClearCart }: EventPlannerProps) {
  const [eventName, setEventName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const cost = parseInt(item.provider.cost.split('₹')[1].split(' - ')[0].replace(',', ''));
      return total + cost;
    }, 0);
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'BHAKTI20') {
      setDiscount(20);
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * discount) / 100;
  const packageDiscount = cartItems.length > 2 ? subtotal * 0.1 : 0;
  const total = subtotal - discountAmount - packageDiscount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] rounded-b-[2rem] shadow-xl p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Plan Your Event</h2>
            <p className="text-white/90">{cartItems.length} services selected</p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-white/90 hover:text-white"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Event details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#FF9933]/20"
        >
          <h3 className="text-gray-900 mb-4">Event Details</h3>
          <Input
            type="text"
            placeholder="Enter event name (e.g., Krishna Janmashtami Kirtan)"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="rounded-xl border-2 border-gray-200 focus:border-[#FF9933]"
          />
        </motion.div>

        {/* Cart items */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-gray-400" size={32} />
            </div>
            <h3 className="text-gray-900 mb-2">No Services Added</h3>
            <p className="text-gray-600 mb-6">
              Start adding services to plan your devotional event
            </p>
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white rounded-full"
            >
              Browse Services
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-[#FF9933]/30 transition-colors"
              >
                <div className="flex gap-4 p-4">
                  {/* Provider image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#FF9933]">
                    <img
                      src={item.provider.avatar}
                      alt={item.provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-1 truncate">{item.provider.name}</h4>
                    <p className="text-gray-600 mb-2">{item.provider.category}</p>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={14} />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    <p className="text-[#FF9933]">
                      {item.provider.cost.split(' - ')[0]}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button className="self-start p-2 hover:bg-red-50 rounded-full transition-colors group">
                    <X className="text-gray-400 group-hover:text-red-500" size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Package discount banner */}
        {cartItems.length > 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-1">Package Discount Applied!</h4>
                <p className="text-white/90">You're saving 10% on multiple services</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Promo code */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-gray-900 mb-4">Promo Code</h3>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="pl-10 rounded-xl border-2 border-gray-200 focus:border-[#FF9933]"
                />
              </div>
              <Button
                onClick={applyPromoCode}
                variant="outline"
                className="rounded-xl border-2 border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933]/10"
              >
                Apply
              </Button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 mt-2">✓ {discount}% discount applied</p>
            )}
          </motion.div>
        )}

        {/* Price summary */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-gray-900 mb-4">Price Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} services)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              {packageDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Package Discount (10%)</span>
                  <span>-₹{packageDiscount.toLocaleString()}</span>
                </div>
              )}
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Code Discount ({discount}%)</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="h-px bg-gray-200"></div>
              
              <div className="flex justify-between">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-[#FF9933]">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom confirm bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-gray-600">Total Amount</p>
              <p className="text-gray-900">₹{total.toLocaleString()}</p>
            </div>
            <Button
              onClick={onConfirm}
              disabled={!eventName}
              className="flex-1 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white rounded-full h-12 disabled:opacity-50"
            >
              Confirm My Bhakti Event
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
