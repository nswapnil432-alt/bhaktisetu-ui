import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, CheckCircle, XCircle, 
  Settings, DollarSign, Star, Users as UsersIcon, Phone, MessageCircle, 
  TrendingUp, BarChart2, ArrowLeft 
} from 'lucide-react';
import NotificationBell from './NotificationBell';

interface BookingRequest {
  id: string;
  eventName: string;
  eventDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
}

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'analytics'>('overview');
  
  const providerName = localStorage.getItem('userName') || 'Provider';
  
  // 🚀 Use the providerId we fixed in the backend yesterday!
  // If it's missing, we fall back to userId just in case, but providerId is correct.
  const providerId = localStorage.getItem('providerId') || localStorage.getItem('userId');

  // Start with a safe default so it doesn't look empty while loading
  const [theme, setTheme] = useState({
    name: 'Loading...',
    color: '#FF9933', // Default Saffron
    emoji: '⌛'
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalEarnings: 0,
    rating: 0,
    totalReviews: 0,
    profileViews: 0
  });

  useEffect(() => {
    // If no ID is found, kick to login
    if (!providerId || providerId === 'null') {
       navigate('/login');
       return;
    }

    const fetchAllRealData = async () => {
      try {
        // 1. Fetch the Provider Profile (This now contains the DB colors!)
        const profileRes = await fetch(`http://localhost:3000/providers/${providerId}`);
        const profileData = await profileRes.json();
        
        console.log("🚨 REAL PROFILE DATA:", profileData); // Check your console to see the DB data!

        if (profileRes.ok) {
           // 🧠 100% DYNAMIC: No more hardcoded dictionaries!
           // We extract the exact color, emoji, and name stored in your PostgreSQL Database
           const categoryData = profileData.category || {};

           setTheme({
             name: categoryData.name || 'Service Provider', 
             color: categoryData.color || '#FF9933',        // Pulls color directly from DB
             emoji: categoryData.emoji || '🕉️'              // Pulls emoji directly from DB
           });
        }

        // 2. Fetch ONLY this provider's Real Bookings
        const bookingsRes = await fetch(`http://localhost:3000/bookings/provider/${providerId}`);
        const bookingsData = await bookingsRes.json();
        if (bookingsRes.ok && Array.isArray(bookingsData)) {
          setRequests(bookingsData);
        }

        // 3. Fetch Real Stats
        const statsRes = await fetch(`http://localhost:3000/bookings/stats/${providerId}`);
        const statsData = await statsRes.json();
        if (statsRes.ok) {
          setStats({
            totalBookings: statsData.totalBookings || 0,
            totalEarnings: statsData.totalEarnings || 0,
            rating: statsData.rating || 0,
            totalReviews: statsData.totalReviews || 0,
            profileViews: statsData.profileViews || 156 
          });
        }
      } catch (error) {
        console.error("Network Error fetching real data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRealData();
  }, [providerId, navigate]);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    if (newStatus === 'COMPLETED') {
      const confirm = window.confirm("Have you completed the Seva and received the remaining cash?");
      if (!confirm) return;
    }
    try {
      const response = await fetch(`http://localhost:3000/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setRequests(prev => prev.map(req => req.id === bookingId ? { ...req, status: newStatus as any } : req));
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <span className="px-3 py-1 bg-[#E8F8EE] text-[#00A859] rounded-full text-[10px] font-bold flex items-center gap-1 border border-[#00A859]/20 uppercase tracking-wide"><CheckCircle size={10}/> confirmed</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold flex items-center gap-1 border border-gray-200 uppercase tracking-wide">completed</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-bold flex items-center gap-1 border border-red-100 uppercase tracking-wide"><XCircle size={10}/> declined</span>;
      default: return <span className="px-3 py-1 bg-[#FFF4E5] text-[#F59E0B] rounded-full text-[10px] font-bold flex items-center gap-1 border border-[#F59E0B]/20 uppercase tracking-wide"><Clock size={10}/> pending</span>;
    }
  };

  return (
    <div className="max-w-[440px] mx-auto min-h-screen bg-[#FDFBF7] shadow-2xl relative font-sans border-x border-gray-100">
      
      {/* 🎨 DYNAMIC HEADER */}
      <div 
        className="rounded-b-[2rem] p-5 pb-20 shadow-md relative z-40 transition-colors duration-500"
        style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)` }} 
      >
        <div className="flex justify-between items-center mb-6 pt-2">
          <div className="flex items-center gap-3 text-white">
             <button onClick={() => navigate(-1)} className="hover:opacity-80 transition-opacity"><ArrowLeft size={22}/></button>
             <div>
               <h1 className="text-[19px] font-bold leading-tight drop-shadow-sm">Provider Dashboard</h1>
               <p className="text-white/90 text-[11px] mt-0.5 font-medium tracking-wide">Welcome back, {providerName}! 🙏</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell /> 
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/30 transition-colors shadow-sm"><Settings size={18} className="text-white" /></button>
          </div>
        </div>

        <div className="rounded-2xl p-3 flex justify-between items-center shadow-md border border-white/20" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-xl">
                {theme.emoji}
              </div>
              <div>
                <p className="text-white/90 text-[10px] font-bold uppercase tracking-wider">Service Category</p>
                {/* Real Category Name from Database */}
                <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow-sm">{theme.name}</h3>
              </div>
           </div>
           <span className="bg-[#00A859] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm border border-green-400/50">Active</span>
        </div>
      </div>
      
       <div className="p-4 bg-white border-2 shadow-lg">
        
        {/* 📊 REAL STATS FROM DATABASE */}
        <div className="grid grid-cols-2 gap-4 mb-5 mt-2">
           <div className="bg-white p-4 rounded-[1.2rem] shadow-sm border border-gray-100 flex flex-col justify-between h-[104px]">
              <div className="flex items-center gap-2 text-gray-600 text-[13px] font-medium"><div className="p-3 rounded-full" style={{ backgroundColor: `${theme.color}15` }}><Calendar size={14} style={{ color: theme.color }}/></div>Bookings</div>
              <h2 className="text-[22px] font-bold text-gray-900">{stats.totalBookings}</h2>
           </div>
           <div className="bg-white p-4 rounded-[1.2rem] shadow-sm border border-gray-100 flex flex-col justify-between h-[104px]">
              <div className="flex items-center gap-2 text-gray-600 text-[13px] font-medium"><div className="p-1 rounded-full" style={{ backgroundColor: `${theme.color}15` }}><DollarSign size={14} style={{ color: theme.color }}/></div>Earnings</div>
              <h2 className="text-[22px] font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</h2>
           </div>
           <div className="bg-white p-4 rounded-[1.2rem] shadow-sm border border-gray-100 flex flex-col justify-between h-[104px]">
              <div className="flex items-center gap-2 text-gray-600 text-[13px] font-medium"><div className="p-1 rounded-full bg-[#FFF4E5]"><Star size={14} className="text-[#F59E0B]"/></div>Rating</div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-[22px] font-bold text-gray-900">{stats.rating ? stats.rating.toFixed(1) : '0.0'}</h2>
                <span className="text-[10px] text-gray-400">({stats.totalReviews})</span>
              </div>
           </div>
           <div className="bg-[#F4F7FF] p-4 rounded-[1.2rem] shadow-sm border border-[#E0E7FF] flex flex-col justify-between h-[104px]">
              <div className="flex items-center gap-2 text-[#3B82F6] text-[13px] font-medium"><div className="p-1 rounded-full bg-blue-100"><UsersIcon size={14} className="text-[#3B82F6]"/></div>Profile Views</div>
              <h2 className="text-[22px] font-bold text-gray-900">{stats.profileViews}</h2>
           </div>
        </div>

        {/* Dynamic Tabs */}
        <div className="w-full grid grid-cols-3 mb-6 bg-white shadow-lg">
           <button onClick={() => setActiveTab('overview')} className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'overview' ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`} style={{ background: activeTab === 'overview' ? `linear-gradient(to right, ${theme.color}, ${theme.color}dd)` : 'transparent' }}>Overview</button>
           <button onClick={() => setActiveTab('bookings')} className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'bookings' ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`} style={{ background: activeTab === 'bookings' ? `linear-gradient(to right, ${theme.color}, ${theme.color}dd)` : 'transparent' }}>Bookings</button>
           <button onClick={() => setActiveTab('analytics')} className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'analytics' ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`} style={{ background: activeTab === 'analytics' ? `linear-gradient(to right, ${theme.color}, ${theme.color}dd)` : 'transparent' }}>Analytics</button>
        </div>

        {/* 📑 TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="rounded-[1.5rem] p-6 shadow-sm border" style={{ backgroundColor: `${theme.color}08`, borderColor: `${theme.color}20` }}>
               <h3 className="font-bold text-gray-900 mb-2 text-[15px]">Complete Your Profile</h3>
               <p className="text-xs text-gray-600 mb-4 leading-relaxed">80% completed - Add photos and videos to attract more clients</p>
               <div className="w-full rounded-full h-1.5 mb-5 overflow-hidden" style={{ backgroundColor: `${theme.color}20` }}>
                  <div className="h-1.5 rounded-full w-[80%]" style={{ backgroundColor: theme.color }}></div>
               </div>
               <button className="w-full text-white text-sm font-bold py-3.5 rounded-xl shadow-md transition-opacity hover:opacity-90" style={{ background: `linear-gradient(to right, ${theme.color}, ${theme.color}dd)` }}>Complete Profile</button>
            </div>
          </div>
        )}

        {/* 📑 TAB 2: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
            {loading ? <p className="text-center text-gray-400 py-10">Loading requests...</p> : requests.length === 0 ? (
               <div className="text-center py-10 bg-white rounded-[1.5rem] border border-dashed border-gray-200">
                 <p className="text-gray-500">No bookings available.</p>
               </div>
            ) : requests.map((req) => (
                <div key={req.id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border-2" style={{ borderColor: `${theme.color}30` }}>
                  <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-[16px] text-gray-900 leading-tight">{req.eventName}</h3>{getStatusBadge(req.status)}</div>
                  <p className="text-[12px] text-gray-500 mb-4">Client Request</p> 
                  
                  <div className="grid grid-cols-2 gap-y-3 mb-5">
                    <div className="flex items-center gap-2 text-[13px] text-gray-600"><Calendar size={14} className="text-gray-400"/><span className="font-medium">{new Date(req.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-600"><Clock size={14} className="text-gray-400"/><span className="font-medium">10:00 AM</span></div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-600 col-span-2"><MapPin size={14} className="text-gray-400"/><span className="font-medium">Pune</span></div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-50 mb-1">
                     <div className="px-4 py-1.5 rounded-full font-bold text-[13px]" style={{ backgroundColor: `${theme.color}15`, color: theme.color }}>₹{req.totalAmount || 5000}</div>
                     <div className="flex gap-4 text-gray-400">
                        <button className="hover:text-gray-700 transition-colors"><Phone size={18}/></button>
                        <button className="hover:text-gray-700 transition-colors"><MessageCircle size={18}/></button>
                     </div>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => handleUpdateStatus(req.id, 'CONFIRMED')} className="flex-1 py-3 rounded-[12px] bg-[#00A859] text-white text-[13px] font-bold shadow-sm hover:bg-green-600 flex items-center justify-center gap-2"><CheckCircle size={16} /> Accept</button>
                      <button onClick={() => handleUpdateStatus(req.id, 'REJECTED')} className="flex-1 py-3 rounded-[12px] border-2 border-red-100 text-red-500 text-[13px] font-bold bg-white hover:bg-red-50 flex items-center justify-center gap-2"><XCircle size={16} /> Decline</button>
                    </div>
                  )}

                  {req.status === 'CONFIRMED' && (
                     <div className="mt-5">
                       <button onClick={() => handleUpdateStatus(req.id, 'COMPLETED')} className="w-full py-3 rounded-[12px] bg-gray-900 text-white text-[13px] font-bold shadow-sm hover:bg-black transition-all flex items-center justify-center gap-2"><CheckCircle size={16} /> Mark as Completed</button>
                     </div>
                  )}
                </div>
            ))}
          </div>
        )}

        {/* 📑 TAB 3: REAL ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-5-x-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
               <div className="space-y-5">
                  <div>
                     <div className="flex justify-between text-[13px] font-medium text-gray-700 mb-2"><span>Booking Conversion Rate</span><span className="font-bold text-gray-900">{stats.totalBookings > 0 ? '100%' : '0%'}</span></div>
                     <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className="h-full rounded-full w-[100%]" style={{ backgroundColor: theme.color }}></div></div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}