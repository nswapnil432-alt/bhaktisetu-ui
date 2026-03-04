import React, { useState } from 'react';
import { 
  ArrowLeft, Phone, MessageCircle, Star, MapPin, 
  Clock, Calendar, Video, Image as ImageIcon, Play, X, Share2
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
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [viewingMedia, setViewingMedia] = useState<string | null>(null);
// Get the current logged-in user's info from your auth state or localStorage
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isOwner = currentUser.id === provider.userId; // Check if the viewer is the provider
  // 🧠 SMART DATA EXTRACTION
  const profile = provider?.providerProfile || {}; 
  const name = provider?.user?.fullName || provider?.fullName || provider?.name || "Verified Provider";
  const basePrice = profile.basePrice || 0;
  const experience = profile.experience || 0;
  const bio = profile.bio || "Experienced professional with devotional performances.";
  const location = provider?.address || profile.address || "Location not updated";
  
  const galleryImages = profile.galleryImages || []; 
  const galleryVideos = profile.galleryVideos || [];
  
  const defaultImage = "https://images.unsplash.com/photo-1588501131105-006fc4eb4a94?q=80&w=1000&auto=format&fit=crop";
  const heroImage = (profile.profileImage && profile.profileImage.length > 5) ? profile.profileImage : defaultImage;

   const handleShare = () => {
    const message = `Check out the profile of ${name} on BhaktiSetu! 🙏\nExperience: ${experience} years\nLocation: ${location}\nView more details here: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

   function handleBookingConfirm(date: Date, time: string): void {
      throw new Error('Function not implemented.');
   }
   const handleDeleteMedia = async (url: string) => {
  if (!window.confirm("Are you sure you want to delete this media?")) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/providers/${provider.id}/gallery/delete`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ imageUrl: url }), // This matches your backend @Body('imageUrl')
    });

    if (response.ok) {
      alert("Media deleted successfully! 🙏");
      onBack();  
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};

  return (
    <div className="min-h-screen bg-white pb-28 font-sans">
      
       <div className="relative w-full bg-gray-900" style={{ height: '340px' }}>
         <img src={heroImage} className="absolute inset-0 w-full h-full object-cover opacity-80" alt={name}/>
         <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}></div>
         
         <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20">
             <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20">
                 <ArrowLeft size={20} />
             </button>
             <div className="flex gap-3">
                 {/* WhatsApp Share Button */}
                 <button onClick={handleShare} className="w-10 h-10 bg-green-500 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 hover:bg-green-600 transition-all">
                    <Share2 size={18} />
                 </button>
                 <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"><Phone size={18} /></button>
             </div>
         </div>

         <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
            <h1 className="text-[24px] font-bold text-white mb-2">{name}</h1>
            <div className="flex items-center gap-3 mb-2">
               <span className="text-black text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: '#FFD700' }}><Star size={12} className="fill-black"/> 4.9</span>
               <span className="text-white/90 text-[14px]">{experience} years experience</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90 text-[14px]"><MapPin size={16} /> {location}</div>
         </div>
      </div>

      <div className="px-5 py-6 space-y-7">
         {/* About */}
         <div>
            <h3 className="text-[16px] font-bold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed">{bio}</p>
         </div>

         {/* 💰 SERVICE COST */}
         <div className="rounded-2xl p-5 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #F97316, #EAB308)' }}>
            <p className="text-white/90 text-[13px] font-medium mb-1">Service Cost</p>
            <h2 className="text-[24px] font-bold mb-1 tracking-tight">₹{basePrice.toLocaleString()} - ₹{(basePrice + 3000).toLocaleString()}</h2>
            <p className="text-white/90 text-[12px]">Per event • Negotiable</p>
         </div>

         
{/* 🖼️ HIGH CLARITY MEDIA GALLERY */}
<div>
   <div className="flex justify-between items-center mb-4">
      <h3 className="text-[16px] font-bold text-gray-800">Media Gallery</h3>
      
      {/* 🔄 SHARP TAB BUTTONS WITH COUNTS */}
      <div className="flex gap-2">
         <button 
           onClick={() => setActiveTab('photos')}
           className={`px-3 py-1.5 rounded-full text-[13px] flex items-center gap-2 transition-all ${activeTab === 'photos' ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
         >
            
           <ImageIcon size={16}/> {galleryImages.length}
         </button>
         
         <button 
           onClick={() => setActiveTab('videos')}
           className={`px-3 py-1.5 rounded-full text-[13px] flex items-center gap-2 transition-all ${activeTab === 'videos' ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
         >
           <Video size={16}/> {galleryVideos.length}
         </button>
      </div>
   </div>
   
   {/* 📏 LANDSCAPE ASPECT RATIO (Fixed Clarity) */}
   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {activeTab === 'photos' ? (
        galleryImages.length > 0 ? (
          galleryImages.map((img: string, idx: number) => (
            <div 
              key={idx} 
              onClick={() => setViewingMedia(img)} 
              className="w-52 h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100 cursor-pointer shadow-sm border border-gray-50 active:scale-95 transition-all"
            >
               <img 
                 src={img} 
                 className="w-full h-full object-cover" // 🔥 This ensures clarity without stretching
                 alt="gallery" 
               />
            </div>
          ))
        ) : <p className="text-gray-400 text-[13px] py-6 w-full text-center">No photos found</p>
      ) : (
        galleryVideos.length > 0 ? (
          galleryVideos.map((vid: string, idx: number) => (
            <div 
              key={idx} 
              onClick={() => setViewingMedia(vid)} 
              className="w-52 h-32 rounded-2xl shrink-0 bg-black relative flex items-center justify-center cursor-pointer overflow-hidden active:scale-95 transition-all"
            >
   
               <video src={vid} className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                    <Play size={20} className="text-white fill-white ml-0.5" />
                  </div>
               </div>
            </div>
          ))
        ) : <p className="text-gray-400 text-[13px] py-6 w-full text-center">No videos found</p>
      )}
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
               <p className="text-[13px] text-gray-600 leading-relaxed">Excellent performance! Spiritual atmosphere created.</p>
            </div>
         </div>
      </div>

      {/* 🦶 FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 z-50 flex items-center justify-between pb-6">
         <div>
            <p className="text-[12px] text-gray-500 mb-0.5 font-medium">Starting from</p>
            <p className="text-[18px] font-bold text-gray-900">₹{basePrice.toLocaleString()}</p>
         </div>
         <Button onClick={() => setIsBookingModalOpen(true)} className="px-8 py-2.5 h-auto rounded-full font-bold text-white text-[15px]" style={{ backgroundColor: '#FFBA08' }}>
            Book Now
         </Button>
      </div>

      {/* 🎥 THE VIEWER MODAL */}
      {viewingMedia && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewingMedia(null)}>
          <button className="absolute top-8 right-8 text-white z-[10000]"><X size={32}/></button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            {viewingMedia.toLowerCase().endsWith('.mp4') ? (
              <video src={viewingMedia} controls autoPlay className="w-full max-h-[80vh] rounded-xl" />
            ) : (
              <img src={viewingMedia} className="w-full max-h-[80vh] object-contain rounded-xl" alt="Preview"/>
            )}
          </div>
        </div>
      )}

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} providerName={name} onConfirm={handleBookingConfirm} />
    </div>
  );
}