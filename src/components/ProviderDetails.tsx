import React, { useState } from 'react';
import { 
  ArrowLeft, Phone, MessageCircle, Star, MapPin, 
  Clock, Calendar, Video, Image as ImageIcon 
} from 'lucide-react';
import { Button } from './ui/button';
// 👇 Import the new Booking Modal
import BookingModal from './BookingModal'; 

interface ProviderDetailsProps {
  provider: any;
  onBack: () => void;
  onBookNow: () => void; // This prop might be redundant now if handled internally, but keeping for compatibility
}

export default function ProviderDetails({ provider, onBack, onBookNow }: ProviderDetailsProps) {
  
  // 🟢 State to control the Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Safe Data Fallbacks
  const name = provider.fullName || provider.name;
  const category = provider.category;
  const price = provider.cost || provider.providerProfile?.basePrice;
  const location = provider.location;
  const experience = provider.experience || 5;
  const bio = provider.bio || provider.providerProfile?.bio;

  // 🟢 Handle Booking Confirmation from the Modal
  const handleBookingConfirm = (date: Date, time: string) => {
    console.log("🔥 BOOKING CONFIRMED!");
    console.log("Provider:", name);
    console.log("Date:", date.toDateString());
    console.log("Time:", time);
    
    // Close modal
    setIsBookingModalOpen(false);
    
    // You can add further logic here (e.g., API call, navigation)
    alert(`Booking Request Sent to ${name} for ${date.toDateString()} at ${time}`);
    onBack(); // Optional: Go back to home after booking
  };

  return (
    <div className="min-h-screen bg-white pb-28 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* 🖼️ HERO HEADER */}
      <div className="relative h-[340px] w-full bg-gray-900">
        <img 
          src={`https://picsum.photos/seed/${name}123/800/800`} 
          alt="Cover"
          className="w-full h-full object-cover opacity-90"
        />
        
        {/* Dark Gradient Overlay - Crucial for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Top Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3">
             <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all active:scale-95">
                <Phone size={18} />
             </button>
             <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all active:scale-95">
                <MessageCircle size={18} />
             </button>
          </div>
        </div>

        {/* Bottom Text Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
           <h1 className="text-3xl font-bold mb-2 tracking-wide">{name}</h1>
           
           <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1 bg-[#FFD700] text-black px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                 <Star size={12} fill="currentColor" />
                 <span>4.9</span>
              </div>
              <span className="text-white/90 text-sm font-medium">
                {experience} years experience
              </span>
           </div>
           
           <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin size={14} />
              <span>{location}</span>
           </div>
        </div>
      </div>

      {/* 📜 SCROLLABLE CONTENT */}
      <div className="px-5 py-6 space-y-8">
        
        {/* About Section */}
        <div>
           <h3 className="font-bold text-gray-900 mb-2 text-lg">About</h3>
           <p className="text-gray-600 text-sm leading-7">
             {bio}
           </p>
        </div>

        {/* 📊 Stats Cards (Matches Image 2 exactly) */}
        <div className="grid grid-cols-2 gap-4">
           {/* Experience Card - Cream */}
           <div className="p-5 rounded-2xl bg-[#FFF9C4] border border-orange-100 flex flex-col justify-center shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                 <Clock size={16} className="text-orange-600" />
                 <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Experience</p>
              </div>
              <p className="text-gray-900 font-bold text-xl">{experience} Years</p>
           </div>

           {/* Availability Card - Mint Green */}
           <div className="p-5 rounded-2xl bg-[#DCFCE7] border border-green-100 flex flex-col justify-center shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                 <Calendar size={16} className="text-green-600" />
                 <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Availability</p>
              </div>
              <p className="text-green-700 font-bold text-xl">Available</p>
           </div>
        </div>

        {/* 💰 Service Cost Card (Vibrant Orange/Yellow Gradient) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md relative overflow-hidden">
           {/* Glow Effect */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
           
           <p className="text-white/90 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Service Cost</p>
           <h2 className="text-3xl font-extrabold mb-1 relative z-10">
             ₹{price}
           </h2>
           <p className="text-white/90 text-xs font-medium relative z-10">Per event • Negotiable</p>
        </div>

        {/* 📷 Media Gallery */}
        <div>
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Media Gallery</h3>
              <div className="flex gap-2">
                 <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 flex items-center gap-1 font-medium"><ImageIcon size={12} /> 2</span>
                 <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 flex items-center gap-1 font-medium"><Video size={12} /> 3</span>
              </div>
           </div>
           
           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <div className="w-44 h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                 <img src="https://picsum.photos/seed/puja/400/300" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="w-44 h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                 <img src="https://picsum.photos/seed/aarti/400/300" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="w-44 h-32 shrink-0 rounded-2xl border-2 border-dashed border-orange-200 bg-[#FFF8E1] flex flex-col items-center justify-center text-orange-400 gap-2 cursor-pointer">
                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Video size={20} className="text-orange-500" />
                 </div>
                 <span className="text-xs font-bold text-orange-600">View Videos</span>
              </div>
           </div>
        </div>

        {/* ⭐ Reviews */}
        <div>
           <h3 className="font-bold text-gray-900 mb-4 text-lg">Recent Reviews</h3>
           <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                 <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-sm text-gray-900">Priya Deshmukh</h4>
                    <div className="flex text-yellow-400 gap-0.5"><Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /></div>
                 </div>
                 <p className="text-xs text-gray-600 leading-relaxed font-medium">"Excellent performance! Very professional and spiritual experience. Came on time and managed everything perfectly."</p>
              </div>
              
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                 <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-sm text-gray-900">Amit Patil</h4>
                    <div className="flex text-yellow-400 gap-0.5"><Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /></div>
                 </div>
                 <p className="text-xs text-gray-600 leading-relaxed font-medium">"Highly recommended for any devotional event. The voice quality was amazing."</p>
              </div>
           </div>
        </div>

      </div>

      {/* 🦶 STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-30 flex items-center justify-between pb-8 pt-5">
         <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Starting from</p>
            <p className="text-2xl font-extrabold text-gray-900">₹{price}</p>
         </div>
         <Button 
            // 🟢 UPDATE: Open the Modal on Click
            onClick={() => setIsBookingModalOpen(true)}
            className="px-8 py-6 rounded-xl font-bold text-white text-lg shadow-lg shadow-orange-200 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:scale-105 active:scale-95 transition-all"
         >
            Book Now
         </Button>
      </div>

      {/* 🟢 MODAL COMPONENT */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={name}
        providerId={provider.id}
        onConfirm={handleBookingConfirm}
      />

    </div>
  );
}