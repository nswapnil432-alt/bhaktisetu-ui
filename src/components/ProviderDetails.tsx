import React, { useState } from 'react';
import { 
  ArrowLeft, Phone, MessageCircle, Star, MapPin, 
  Clock, Calendar, Video, Image as ImageIcon 
} from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom'; 
import BookingModal from './BookingModal'; 

interface ProviderDetailsProps {
  provider: any; 
  onBack: () => void;
  onBookNow: () => void; 
}

export default function ProviderDetails({ provider, onBack, onBookNow }: ProviderDetailsProps) {
  const navigate = useNavigate(); 
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // 🧠 SMART DATA EXTRACTION
  const profile = provider?.providerProfile || {}; 
  const name = provider?.user?.fullName || provider?.fullName || provider?.name || "Verified Provider";
  const basePrice = profile.basePrice || 0;
  const experience = profile.experience || 0;
  const bio = profile.bio || "Experienced professional with devotional performances.";
  const location = provider?.address || profile.address || "Location not updated";
  const rating = 4.9; 
  
  const galleryImages = profile.galleryImages || []; 
  
  // 🛡️ Extremely Safe Fallback Image
  const defaultImage = "https://images.unsplash.com/photo-1588501131105-006fc4eb4a94?q=80&w=1000&auto=format&fit=crop";
  const heroImage = (profile.profileImage && profile.profileImage.length > 5) ? profile.profileImage : defaultImage;

  const handleBookingConfirm = (date: Date, time: string) => {
    setIsBookingModalOpen(false);
    const params = new URLSearchParams({
        providerId: provider.id || '',
        name: name,
        date: date.toDateString(),
        time: time
    });
    navigate(`/plan-event?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white pb-28 font-sans">
      
      {/* 🖼️ HERO SECTION (Bulletproof Height inline style!) */}
      <div className="relative w-full bg-gray-900" style={{ height: '340px' }}>
         
         <img 
           src={heroImage} 
           alt={name}
           className="absolute inset-0 w-full h-full object-cover"
           style={{ opacity: 0.8 }}
           onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultImage; }}
         />
         
         {/* Dark Gradient Overlay (Inline style so it never fails) */}
         <div 
           className="absolute inset-0" 
           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}
         ></div>
         
         {/* Top Header Controls */}
         <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20">
             <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all">
                 <ArrowLeft size={20} />
             </button>
             <div className="flex gap-3">
                 <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all">
                    <Phone size={18} />
                 </button>
                 <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all">
                    <MessageCircle size={18} />
                 </button>
             </div>
         </div>

         {/* Hero Text Info */}
         <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
            <h1 className="text-[24px] font-bold text-white mb-2 tracking-wide drop-shadow-md">{name}</h1>
            
            <div className="flex items-center gap-3 mb-2">
               <span 
                 className="text-black text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm"
                 style={{ backgroundColor: '#FFD700' }}
               >
                 <Star size={12} className="fill-black"/> {rating}
               </span>
               <span className="text-white/90 text-[14px] font-medium drop-shadow-sm">{experience} years experience</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-white/90 text-[14px] drop-shadow-sm">
               <MapPin size={16} /> {location}
            </div>
         </div>
      </div>

      {/* 📜 SCROLLABLE CONTENT */}
      <div className="px-5 py-6 space-y-7">
         
         {/* About */}
         <div>
            <h3 className="text-[16px] font-bold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed">{bio}</p>
         </div>

         {/* 📊 INFO GRID */}
         <div className="grid grid-cols-2 gap-4">
            {/* Experience Card */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFF8F0', border: '1px solid #FFE4C4' }}>
               <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 text-[#F97316]" style={{ backgroundColor: '#FFEDD5' }}>
                  <Clock size={18} />
               </div>
               <p className="text-gray-500 text-[13px] mb-0.5">Experience</p>
               <p className="text-gray-900 text-[15px] font-bold">{experience} Years</p>
            </div>

            {/* Availability Card */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
               <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 text-[#22C55E]" style={{ backgroundColor: '#DCFCE7' }}>
                  <Calendar size={18} />
               </div>
               <p className="text-gray-500 text-[13px] mb-0.5">Availability</p>
               <p className="text-[#22C55E] text-[15px] font-bold">Available</p>
            </div>
         </div>

         {/* 💰 SERVICE COST CARD (Inline gradient ensures it renders perfectly) */}
         <div 
           className="rounded-2xl p-5 text-white shadow-md"
           style={{ background: 'linear-gradient(135deg, #F97316, #EAB308)' }}
         >
            <p className="text-white/90 text-[13px] font-medium mb-1">Service Cost</p>
            <h2 className="text-[24px] font-bold mb-1 tracking-tight">
               {basePrice > 0 ? `₹${basePrice.toLocaleString()} - ₹${(basePrice + 3000).toLocaleString()}` : "Price on Request"}
            </h2>
            <p className="text-white/90 text-[12px]">
               Per event • Negotiable
            </p>
         </div>

         {/* 🖼️ MEDIA GALLERY */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-[16px] font-bold text-gray-800">Media Gallery</h3>
               <div className="flex gap-2">
                  <span className="border border-gray-200 px-2 py-1 rounded-md text-[12px] text-gray-600 flex items-center gap-1 bg-gray-50"><ImageIcon size={14}/> {galleryImages.length > 0 ? galleryImages.length : 2}</span>
                  <span className="border border-gray-200 px-2 py-1 rounded-md text-[12px] text-gray-600 flex items-center gap-1 bg-gray-50"><Video size={14}/> 3</span>
               </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
               {/* Main Image Block */}
               <div className="w-40 h-28 rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-100">
                  <img src={heroImage} className="w-full h-full object-cover" alt="gallery" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultImage; }}/>
               </div>
               
               {/* View Videos Block */}
               <div 
                 className="w-40 h-28 rounded-xl flex flex-col items-center justify-center shrink-0"
                 style={{ backgroundColor: '#FFF8F0', border: '1px dashed #FDBA74', color: '#F97316' }}
               >
                  <Video size={24} className="mb-2 opacity-80"/>
                  <span className="text-[13px] font-bold">View Videos</span>
               </div>
            </div>
         </div>

         {/* ⭐ RECENT REVIEWS */}
         <div>
            <h3 className="text-[16px] font-bold text-gray-800 mb-3">Recent Reviews</h3>
            <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
               <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[14px] font-bold text-gray-900">Priya Deshmukh</h4>
                  <div className="flex gap-0.5">
                     {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-[#FFBA08] text-[#FFBA08]"/>)}
                  </div>
               </div>
               <p className="text-[13px] text-gray-600 leading-relaxed">Excellent performance! Very professional and spiritual atmosphere created.</p>
            </div>
         </div>
      </div>

      {/* 🦶 FOOTER (Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 z-50 flex items-center justify-between pb-6">
         <div>
            <p className="text-[12px] text-gray-500 mb-0.5 font-medium">Starting from</p>
            <p className="text-[18px] font-bold text-gray-900">{basePrice > 0 ? `₹${basePrice.toLocaleString()}` : "Contact"}</p>
         </div>
         <Button 
            onClick={() => setIsBookingModalOpen(true)}
            className="px-8 py-2.5 h-auto rounded-full font-bold text-white text-[15px] transition-colors shadow-md"
            style={{ backgroundColor: '#FFBA08' }}
         >
            Book Now
         </Button>
      </div>

      {/* 🟢 MODAL */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={name}
        onConfirm={handleBookingConfirm} 
      />

    </div>
  );
}