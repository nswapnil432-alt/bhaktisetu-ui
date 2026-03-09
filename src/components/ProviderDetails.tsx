import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Phone, MessageCircle, Star, MapPin,
  Clock, Calendar, Video, Image as ImageIcon, Play, X, Share2
} from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import BookingModal from './BookingModal';

interface ProviderDetailsProps {
  provider?: any; // Made optional to handle direct URL loads
  onBack: () => void;
}

export default function ProviderDetails({ provider: initialProvider, onBack }: ProviderDetailsProps) {
  const navigate = useNavigate();
  const { id } = useParams(); // 🆔 Get ID from URL (/provider/:id)

  // 1. STATE MANAGEMENT
  const [provider, setProvider] = useState(initialProvider);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [viewingMedia, setViewingMedia] = useState<string | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // 2. REFRESH-PROOF LOGIC: Fetch data if prop is missing
  useEffect(() => {
    if (!provider && id) {
      fetch(`http://localhost:3000/providers/${id}`)
        .then(res => res.json())
        .then(data => setProvider(data))
        .catch(err => console.error("Error fetching provider details:", err));
    }
  }, [id, provider]);

  // 3. SAFETY CHECK: Show loading if data isn't ready
  if (!provider) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-orange-600 font-bold">
        Loading Maharaj Details... 🙏
      </div>
    );
  }

  // 4. DATA EXTRACTION
  const profile = provider?.providerProfile || {};
  const name = provider?.user?.fullName || provider?.fullName || provider?.name || "Verified Provider";
  const basePrice = profile.basePrice || 0;
  const experience = profile.experience || 0;
  const bio = profile.bio || "Experienced professional with devotional performances.";
  const location = provider?.address || profile.address || "Location not updated";
  const galleryImages = profile.galleryImages || [];
  const galleryVideos = profile.galleryVideos || [];
  const isOwner = currentUser.id === provider.userId;

  const defaultImage = "https://images.unsplash.com/photo-1588501131105-006fc4eb4a94?q=80&w=1000&auto=format&fit=crop";
  const heroImage = (profile.profileImage && profile.profileImage.length > 5) ? profile.profileImage : defaultImage;

  // 5. HANDLERS
  const handleShare = () => {
    const message = `Check out the profile of ${name} on BhaktiSetu! 🙏\nLocation: ${location}\nView more details here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleBookingConfirm = (date: Date, time: string) => {
    setIsBookingModalOpen(false);
    // 📅 Formatting date for the URL
    const formattedDate = date.toLocaleDateString('en-GB');
    // 🚀 Navigation to EventPlanner with URL params
    navigate(`/event-planner?providerId=${provider.id}&name=${encodeURIComponent(name)}&date=${formattedDate}&time=${time}`);
  };

  return (
    <div className="min-h-screen bg-white pb-28 font-sans">
      {/* HERO SECTION */}
      <div className="relative w-full bg-gray-900" style={{ height: '340px' }}>
        <img src={heroImage} className="absolute inset-0 w-full h-full object-cover opacity-80" alt={name} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}></div>
        <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20">
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3">
            <button onClick={handleShare} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg border border-white/20"><Share2 size={18} /></button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"><Phone size={18} /></button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white">
          <h1 className="text-[24px] font-bold mb-2">{name}</h1>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-black text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1 bg-[#FFD700]"><Star size={12} className="fill-black" /> 4.9</span>
            <span className="text-white/90 text-[14px]">{experience} years experience</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/90 text-[14px]"><MapPin size={16} /> {location}</div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-7">
        {/* ABOUT */}
        <div>
          <h3 className="text-[16px] font-bold text-gray-800 mb-2">About</h3>
          <p className="text-gray-600 text-[14px] leading-relaxed">{bio}</p>
        </div>

        {/* PRICE CARD */}
        <div className="rounded-2xl p-5 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #F97316, #EAB308)' }}>
          <p className="text-white/90 text-[13px] font-medium mb-1">Service Cost</p>
          <h2 className="text-[24px] font-bold mb-1 tracking-tight">₹{basePrice.toLocaleString()} - ₹{(basePrice + 3000).toLocaleString()}</h2>
          <p className="text-white/90 text-[12px]">Per event • Negotiable</p>
        </div>

        {/* MEDIA GALLERY */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[16px] font-bold text-gray-800">Media Gallery</h3>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('photos')} className={`px-3 py-1.5 rounded-full text-[13px] flex items-center gap-2 transition-all ${activeTab === 'photos' ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold' : 'bg-gray-50 text-gray-500'}`}><ImageIcon size={16} /> {galleryImages.length}</button>
              <button onClick={() => setActiveTab('videos')} className={`px-3 py-1.5 rounded-full text-[13px] flex items-center gap-2 transition-all ${activeTab === 'videos' ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold' : 'bg-gray-50 text-gray-500'}`}><Video size={16} /> {galleryVideos.length}</button>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {activeTab === 'photos' ? (
              galleryImages.map((img: string, idx: number) => (
                <div key={idx} onClick={() => setViewingMedia(img)} className="w-52 h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100 cursor-pointer shadow-sm border border-gray-50">
                  <img src={img} className="w-full h-full object-cover" alt="gallery" />
                </div>
              ))
            ) : (
              galleryVideos.map((vid: string, idx: number) => (
                <div key={idx} onClick={() => setViewingMedia(vid)} className="w-52 h-32 rounded-2xl shrink-0 bg-black relative flex items-center justify-center cursor-pointer overflow-hidden">
                  <video src={vid} className="w-full h-full object-cover opacity-60" />
                  <Play size={20} className="text-white fill-white absolute" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 z-50 flex items-center justify-between pb-6">
        <div>
          <p className="text-[12px] text-gray-500 mb-0.5 font-medium">Starting from</p>
          <p className="text-[18px] font-bold text-gray-900">₹{basePrice.toLocaleString()}</p>
        </div>
        {!isOwner && (
          <Button onClick={() => setIsBookingModalOpen(true)} className="px-18 py-3 h-auto rounded-full font-bold text-white text-[15px] C] transition-all shadow-md active:scale-95" style={{ background: 'linear-gradient(135deg, #F97316, #EAB308)' }}>
            Book Now
          </Button>
        )}
      </div>

      {/* MEDIA VIEWER */}
      {viewingMedia && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4" onClick={() => setViewingMedia(null)}>
          <button className="absolute top-8 right-8 text-white"><X size={32} /></button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            {viewingMedia.toLowerCase().endsWith('.mp4') ? (
              <video src={viewingMedia} controls autoPlay className="w-full max-h-[80vh] rounded-xl" />
            ) : (
              <img src={viewingMedia} className="w-full max-h-[80vh] object-contain rounded-xl" alt="Preview" />
            )}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={name}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
}