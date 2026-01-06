import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, Calendar as CalendarIcon, Video, Image as ImageIcon } from 'lucide-react';
import { ServiceProvider } from '../App';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ServiceProviderProfileProps {
  provider: ServiceProvider;
  onBack: () => void;
  onBook: (provider: ServiceProvider, date: string, time: string) => void;
}

export default function ServiceProviderProfile({ provider, onBack, onBook }: ServiceProviderProfileProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const timeSlots = [
    '09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'
  ];

  const handleBookNow = () => {
    setShowBookingDialog(true);
  };

  const confirmBooking = () => {
    if (selectedDate && selectedTime) {
      onBook(provider, selectedDate.toLocaleDateString(), selectedTime);
      setShowBookingDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header image */}
      <div className="relative h-64">
        <img
          src={provider.avatar}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>

        {/* Quick actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Phone className="text-white" size={18} />
          </button>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <MessageCircle className="text-white" size={18} />
          </button>
        </div>

        {/* Provider info overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white mb-2">{provider.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-yellow-400 px-2 py-1 rounded-full">
                  <Star className="text-white fill-white" size={14} />
                  <span className="text-white">{provider.rating}</span>
                </div>
                <span className="text-white/90">{provider.experience} years experience</span>
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin size={16} />
                <span>{provider.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* About section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-gray-900 mb-3">About</h3>
          <p className="text-gray-600 leading-relaxed">
            {provider.bio}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border-2 border-[#FF9933]/30">
              <Clock className="text-[#FF9933] mb-2" size={24} />
              <p className="text-gray-600">Experience</p>
              <p className="text-gray-900">{provider.experience} Years</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
              <CalendarIcon className="text-green-600 mb-2" size={24} />
              <p className="text-gray-600">Availability</p>
              <p className="text-green-600">{provider.availability}</p>
            </div>
          </div>
        </motion.div>

        {/* Service cost */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] rounded-2xl p-6 text-white"
        >
          <p className="text-white/90 mb-1">Service Cost</p>
          <h3 className="text-white">{provider.cost}</h3>
          <p className="text-white/80 mt-2">Per event • Negotiable</p>
        </motion.div>

        {/* Media gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Media Gallery</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                <ImageIcon size={16} className="text-gray-600" />
                <span className="text-gray-700">{provider.images.length}</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                <Video size={16} className="text-gray-600" />
                <span className="text-gray-700">3</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {provider.images.map((image, index) => (
              <div
                key={index}
                className="aspect-video rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
            <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#FF9933]/20 to-[#FFD700]/20 flex items-center justify-center border-2 border-dashed border-[#FF9933]/30">
              <div className="text-center">
                <Video className="text-[#FF9933] mx-auto mb-2" size={32} />
                <p className="text-gray-600">View Videos</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-gray-900 mb-3">Recent Reviews</h3>
          <div className="space-y-3">
            {[
              { name: 'Priya Deshmukh', rating: 5, comment: 'Excellent performance! Very professional and spiritual.' },
              { name: 'Amit Patil', rating: 5, comment: 'Highly recommended for any devotional event.' },
            ].map((review, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50/50 to-yellow-50/50 rounded-xl p-4 border-2 border-[#FF9933]/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900">{review.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={14} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom booking bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-gray-600">Starting from</p>
            <p className="text-gray-900">{provider.cost.split(' - ')[0]}</p>
          </div>
          <Button
            onClick={handleBookNow}
            className="flex-1 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white rounded-full h-12"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Booking dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book {provider.name}</DialogTitle>
            <DialogDescription>Select a date and time for your booking.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Date picker */}
            <div>
              <label className="block text-gray-700 mb-2">Select Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl border"
                disabled={(date) => date < new Date()}
              />
            </div>

            {/* Time slots */}
            <div>
              <label className="block text-gray-700 mb-2">Select Time</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                      selectedTime === time
                        ? 'border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm button */}
            <Button
              onClick={confirmBooking}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white rounded-full h-12 disabled:opacity-50"
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}