import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Phone, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Get Logged In User ID
  const userId = localStorage.getItem('userId');

  // 2. Fetch Bookings Function
  const fetchBookings = async () => {
    setLoading(true);
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:3000/bookings/organizer/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchBookings();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')} className="p-2 bg-gray-100 rounded-full">
            <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Seva Bookings</h1>
        </div>
        <button onClick={fetchBookings} className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100">
            <RefreshCw size={20} />
        </button>
      </div>

      {/* Bookings List */}
      <div className="p-5 space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 mt-10 animate-pulse">Checking for updates...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center mt-20 opacity-50">
            <Calendar size={48} className="mx-auto mb-2 text-gray-400"/>
            <p>No bookings yet.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
              
              {/* 🟢 ORANGE 🔴 DYNAMIC STATUS BADGE */}
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider uppercase
                ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                  booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'}
              `}>
                {booking.status}
              </div>

              <div className="flex gap-4">
                {/* Provider Image */}
                <img 
                  src={booking.providerImage} 
                  alt="Provider" 
                  className="w-16 h-16 rounded-xl bg-gray-100 object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{booking.providerName}</h3>
                  <p className="text-sm text-gray-500 font-medium mb-2">{booking.eventName}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                     <span className="flex items-center gap-1">
                       <Calendar size={12}/> {new Date(booking.eventDate).toLocaleDateString()}
                     </span>
                     <span className="flex items-center gap-1">
                       <Clock size={12}/> 10:00 AM
                     </span>
                  </div>

                  {/* 🚀 DYNAMIC ACTION AREA FOR USER */}
                  
                  {/* CASE 1: CONFIRMED */}
                  {booking.status === 'CONFIRMED' && (
                    <div className="space-y-2">
                        <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle size={12} /> Request Accepted!
                        </div>
                        <button className="w-full bg-green-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-green-200 active:scale-95 transition-transform">
                            <Phone size={14} /> Call Maharaj Ji
                        </button>
                    </div>
                  )}

                  {/* CASE 2: PENDING */}
                  {booking.status === 'PENDING' && (
                    <div className="w-full bg-orange-50 text-orange-600 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 border border-orange-100">
                      <AlertCircle size={14} /> Waiting for Approval...
                    </div>
                  )}

                  {/* CASE 3: REJECTED */}
                  {booking.status === 'REJECTED' && (
                     <div className="space-y-1">
                        <div className="w-full bg-red-50 text-red-500 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 border border-red-100">
                            <XCircle size={14} /> Booking Rejected
                        </div>
                        <p className="text-[10px] text-gray-400 text-center">
                            Refund of ₹{booking.paidAmount || 500} initiated.
                        </p>
                    </div>
                  )}

                  {/* CASE 4: COMPLETED */}
                  {booking.status === 'COMPLETED' && (
                    <div className="w-full bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 border border-blue-100">
                      <CheckCircle size={14} /> Seva Completed 🙏
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}