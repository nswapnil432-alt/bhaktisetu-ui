import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Phone, MessageCircle, Star, MapPin, 
  Clock, Calendar, Video, Image as ImageIcon, Play, X, Share2
} from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom'; 
import BookingModal from './BookingModal'; 
import { motion } from 'framer-motion';
import { myFetch } from '../api/apiClient';
import { uiLabels } from '../utils/langStore';

interface ProviderDetailsProps {
  provider: any; 
  onBack: () => void;
}

export default function ProviderDetails({ provider:initialProvider, onBack }: ProviderDetailsProps) {
  const navigate = useNavigate(); 
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [viewingMedia, setViewingMedia] = useState<string | null>(null);
const [provider, setProvider] = useState(initialProvider);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = currentUser.id === provider.userId; 

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
const hasRecordedView = useRef(false);
  useEffect(() => {
    const fetchFreshProviderData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/providers/${initialProvider.id}`);
        if (response.ok) {
          const freshData = await response.json();
          
          // 🎯 THE FIX: Smart Merge
          // We keep all the old data and only update/add the fresh stuff (like reviews)
          setProvider((prev: any) => ({
            ...prev,          // Keep existing name, image, location
            ...freshData,     // Overwrite with fresh data if it exists
            reviews: freshData.reviews // Specifically ensure reviews are updated
          }));
        }
      } catch (error) {
        console.error("Error fetching fresh reviews:", error);
      }
    };

    fetchFreshProviderData();
   
  }, [initialProvider.id]);
  // 2️⃣ EFFECT: Record View Count (Only Once)
useEffect(() => {
  const recordView = async () => {
    // 🛡️ THE LOCK: If we already recorded, STOP HERE.
    if (hasRecordedView.current) return;

    if (initialProvider.id && !isOwner) {
      try {
        hasRecordedView.current = true; // 🔐 Set the lock to TRUE immediately
        
        await fetch(`http://localhost:3000/providers/${initialProvider.id}/view`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("🚩 Seva View Recorded ONLY ONCE (Guaranteed)!");
      } catch (error) {
        hasRecordedView.current = false; // Unlock if it failed
        console.log("View count update failed", error);
      }
    }
  };

  recordView();
}, [initialProvider.id, isOwner]);

  const handleStartChat = () => {
    if (isOwner) return;
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const providerUserId = provider.userId || provider.user?.id;
    const currentProfileId = provider.id; 
    if (!providerUserId || !currentProfileId) return;
    navigate(`/chat/${providerUserId}?bookingId=${currentProfileId}`);
  };

  const handleShare = () => {
    const message = `Check out the profile of ${name} on BhaktiSetu! 🙏\nExperience: ${experience} years\nLocation: ${location}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleBookingConfirm = (date: Date, time: string) => {
    setIsBookingModalOpen(false);
    const dateStr = date.toISOString().split('T')[0];
    navigate(`/event-planner?providerId=${provider.id}&name=${encodeURIComponent(name)}&date=${dateStr}&time=${time}&price=${basePrice}`);
  };

  const handleDeleteMedia = async (url: string) => {
    if (!window.confirm("Delete media?")) return;
    try {
      const response = await fetch(`http://localhost:3000/providers/${provider.id}/gallery/delete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ imageUrl: url }),
      });
      if (response.ok) onBack();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-white pb-28 font-sans">
      {/* 🟢 HERO SECTION */}
      <div className="relative w-full bg-gray-900" style={{ height: '340px' }}>
        <img src={heroImage} className="absolute inset-0 w-full h-full object-cover opacity-80" alt={name}/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}></div>
        <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"><ArrowLeft size={20} /></button>
          <div className="flex gap-3">
            <button onClick={handleShare} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg"><Share2 size={18} /></button>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"><Phone size={18} /></button>
            {!isOwner && <button onClick={handleStartChat} className="w-10 h-10 bg-[#FF9933] rounded-full flex items-center justify-center text-white shadow-lg"><MessageCircle size={18} /></button>}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <h1 className="text-[24px] font-bold text-white mb-2">{name}</h1>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-black text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: '#FFD700' }}>
              <Star size={12} className="fill-black"/> {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
            </span>
            <span className="text-white/90 text-[14px]">{experience} years experience</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/90 text-[14px]"><MapPin size={16} /> {location}</div>
        </div>
      </div>

      {/* 🟠 MAIN CONTENT */}
      <div className="px-5 py-6 space-y-7">
        <div>
          <h3 className="text-[16px] font-bold text-gray-800 mb-2">About</h3>
          <p className="text-gray-600 text-[14px] leading-relaxed">{bio}</p>
        </div>

        {/* 🟠 Improved Service Cost Card */}
<div className="mx-5 p-5 bg-orange-50/50 rounded-3xl border border-orange-100 shadow-sm">
  <div className="flex justify-between items-start">
    <div>
      <p className="text-[11px] text-orange-600 font-bold uppercase tracking-wider mb-1">Dakshina (Starting)</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-black text-gray-900">₹{basePrice.toLocaleString()}</h2>
        <span className="text-gray-400 text-xs strike-through">₹{(basePrice + 3000).toLocaleString()}</span>
      </div>
    </div>
    <span className="bg-white text-orange-600 text-[10px] px-3 py-1 rounded-full font-bold border border-orange-200 shadow-sm">
      Negotiable
    </span>
  </div>
  <p className="text-[10px] text-gray-400 mt-2 italic">Prices may vary based on Seva duration</p>
</div>

        {/* 📸 GALLERY SECTION */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[16px] font-bold text-gray-800">Media Gallery</h3>
            <div className="flex gap-2">
               <button onClick={() => setActiveTab('photos')} className={`px-3 py-1.5 rounded-full text-[13px] flex items-center gap-2 ${activeTab === 'photos' ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold' : 'bg-gray-50 text-gray-500'}`}><ImageIcon size={16}/> {galleryImages.length}</button>
               <button onClick={() => setActiveTab('videos')} className={`px-3 py-1.5 rounded-full text-[13px] flex items-center gap-2 ${activeTab === 'videos' ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold' : 'bg-gray-50 text-gray-500'}`}><Video size={16}/> {galleryVideos.length}</button>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {activeTab === 'photos' ? (
              galleryImages.map((img: string, idx: number) => (
                <div key={idx} onClick={() => setViewingMedia(img)} className="w-52 h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100 cursor-pointer shadow-sm border border-gray-50"><img src={img} className="w-full h-full object-cover" /></div>
              ))
            ) : (
              galleryVideos.map((vid: string, idx: number) => (
                <div key={idx} onClick={() => setViewingMedia(vid)} className="w-52 h-32 rounded-2xl shrink-0 bg-black relative flex items-center justify-center cursor-pointer overflow-hidden">
                  <video src={vid} className="w-full h-full object-cover opacity-60" />
                  <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm"><Play size={20} className="text-white fill-white ml-0.5" /></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ⭐ DYNAMIC REVIEWS SECTION */}
        <div className="mt-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-gray-800">Bhaktas Feedback</h3>
              <p className="text-[11px] text-gray-400">Real experiences from recent Sevas</p>
            </div>
            <span className="text-orange-600 font-bold text-xs">View All</span>
          </div>

          <div className="space-y-4">
            {provider.reviews && provider.reviews.length > 0 ? (
              provider.reviews.map((review: any) => (
<motion.div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm mb-4">
  <div className="flex justify-between items-start mb-3">
    <div className="flex items-center gap-3">
      {/* 🟠 Stronger Avatar */}
      <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600 border-2 border-white shadow-sm">
        {review.reviewer?.fullName?.charAt(0) || "B"}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 leading-tight">{review.reviewer?.fullName}</h4>
        <p className="text-[10px] text-gray-400 font-medium">Verified Seva • 21 Mar</p>
      </div>
    </div>
    {/* 🌟 Filled Stars */}
    <div className="flex gap-0.5 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
      ))}
    </div>
  </div>
  <p className="text-gray-600 text-xs italic leading-relaxed pl-2 border-l-2 border-orange-100 ml-1">
    "{review.comment}"
  </p>
</motion.div>
              ))
            ) : (
              <div className="py-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to seek blessings! 🙏</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💳 STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 z-50 flex items-center justify-between pb-6">
        <div>
           <p className="text-[12px] text-gray-500 mb-0.5 font-medium">Starting from</p>
           <p className="text-[18px] font-bold text-gray-900">₹{basePrice.toLocaleString()}</p>
        </div>
        {!isOwner && (
          <Button onClick={() => setIsBookingModalOpen(true)} className="px-12 py-3 h-auto rounded-full font-bold text-white text-[15px] transition-all shadow-md active:scale-95" style={{ background: 'linear-gradient(135deg, #F97316, #EAB308)' }}>
            {uiLabels['Book Now'] || 'Book Now'}
          </Button>
        )}
      </div>

      {/* MEDIA VIEWER */}
      {viewingMedia && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewingMedia(null)}>
          <div className="absolute top-8 right-8 flex gap-4">
            {isOwner && <button onClick={(e) => { e.stopPropagation(); handleDeleteMedia(viewingMedia); }} className="bg-red-500 text-white p-2 rounded-full"><X size={20}/></button>}
            <button className="text-white"><X size={32}/></button>
          </div>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            {viewingMedia.toLowerCase().endsWith('.mp4') ? <video src={viewingMedia} controls autoPlay className="w-full max-h-[80vh] rounded-xl" /> : <img src={viewingMedia} className="w-full max-h-[80vh] object-contain rounded-xl" />}
          </div>
        </div>
      )}

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} providerName={name} onConfirm={handleBookingConfirm} />
    </div>
  );
}