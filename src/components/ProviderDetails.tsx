import React, { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Star, MapPin, Clock, Calendar, Video, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom'; // 👈 Import Navigation
import BookingModal from './BookingModal'; 

interface ProviderDetailsProps {
  provider: any;
  onBack: () => void;
  onBookNow: () => void; 
}

export default function ProviderDetails({ provider, onBack, onBookNow }: ProviderDetailsProps) {
  const navigate = useNavigate(); // 👈 Init Hook
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Data
  const name = provider.fullName || provider.name;
  const price = provider.cost || provider.providerProfile?.basePrice || 5000;
  const location = provider.location || "Pune";
  const experience = provider.experience || 5;
  const bio = provider.bio || provider.providerProfile?.bio || "Professional service provider.";

  // 🚀 FIXED: Handle Navigation Here
  const handleBookingConfirm = (date: Date, time: string) => {
    console.log("✅ Data Received in Parent:", date, time);
    
    // 1. Close Modal
    setIsBookingModalOpen(false);

    // 2. Prepare URL Params
    const params = new URLSearchParams({
        providerId: provider.id || '',
        name: name,
        date: date.toDateString(),
        time: time
    });

    // 3. Navigate Explicitly
    navigate(`/plan-event?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white pb-28 relative">
      
      {/* ... (Keep your existing Header/Image/Stats UI exactly as is) ... */}
      {/* For brevity, I am showing the Footer and Modal part only */}
      
      {/* 🖼️ HERO HEADER (Keep your code here) */}
      <div className="relative h-[340px] w-full bg-gray-900">
         <img src={`https://picsum.photos/seed/${name}123/800/800`} className="w-full h-full object-cover opacity-90"/>
         <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20">
             <button onClick={onBack} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                 <ArrowLeft size={20} />
             </button>
         </div>
         {/* ... (rest of header) ... */}
      </div>

      {/* 📜 CONTENT (Keep your code here) */}
      <div className="px-5 py-6 space-y-8">
         {/* ... (About, Stats, Reviews) ... */}
         <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">About</h3>
            <p className="text-gray-600 text-sm">{bio}</p>
         </div>
      </div>

      {/* 🦶 FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-30 flex items-center justify-between pb-8 pt-5">
         <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Starting from</p>
            <p className="text-2xl font-extrabold text-gray-900">₹{price}</p>
         </div>
         <Button 
            onClick={() => setIsBookingModalOpen(true)}
            className="px-8 py-6 rounded-xl font-bold text-white text-lg shadow-lg shadow-orange-200 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:scale-105 active:scale-95 transition-all"
         >
            Book Now
         </Button>
      </div>

      {/* 🟢 MODAL */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={name}
        onConfirm={handleBookingConfirm} // 👈 Logic is now in Parent
      />

    </div>
  );
}