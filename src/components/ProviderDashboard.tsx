import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, CheckCircle, XCircle, 
  AlertCircle, ChevronRight, DollarSign, Wallet 
} from 'lucide-react';
import { Button } from './ui/button';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Bookings for this Provider
 useEffect(() => {
    const fetchRequests = async () => {
      try {
        // 🔴 CHANGE THIS LINE: Paste the ID you copied from Prisma Studio
        // Example: const providerId = "b123-456-789"; 
        const fallbackId = "79eb77dd-2d8d-4eeb-abe8-3ca9c9c9ebd9"; 

const providerId = localStorage.getItem('providerId') || fallbackId;
        console.log("🔍 Fetching bookings for Provider:", providerId); // Check Console

        const response = await fetch(`http://localhost:3000/bookings/provider/${providerId}`);
        const data = await response.json();
        
        console.log("📦 Data received from Backend:", data); // Check if data arrives

        if (response.ok && Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error("Backend returned error or empty:", data);
        }
      } catch (error) {
        console.error("Network Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // 2. Handle Actions
  const handleAction = async (bookingId: string, action: 'CONFIRMED' | 'CANCELLED') => {
    try {
      const response = await fetch(`http://localhost:3000/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        // Remove the item from list or update status locally
        setRequests(prev => prev.map(req => 
          req.id === bookingId ? { ...req, status: action } : req
        ));
        alert(action === 'CONFIRMED' ? "Booking Accepted! Jai Hari! 🚩" : "Booking Rejected.");
      }
    } catch (error) {
      alert("Action failed. Check backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-white p-5 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Provider Dashboard</h1>
        <p className="text-xs text-gray-500">Manage your Seva requests</p>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
           <p className="text-center text-gray-400 mt-10">Loading requests...</p>
        ) : requests.length === 0 ? (
           <div className="text-center mt-10 p-6 bg-white rounded-xl border border-dashed">
             <p className="text-gray-500">No new booking requests.</p>
           </div>
        ) : (
          requests.map((req) => {
            const isPending = req.status === 'PENDING';
            const balance = (req.totalAmount || 0) - (req.paidAmount || 0);

            return (
              <div key={req.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${
                  req.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  req.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {req.status}
                </div>

                {/* Event Details */}
                <h3 className="font-bold text-lg text-gray-900 mb-1">{req.eventName}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-orange-500"/>
                    <span>{new Date(req.eventDate).toDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Clock size={14} className="text-orange-500"/>
                     <span>10:00 AM (Check backend time)</span> 
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                     <MapPin size={14} className="text-orange-500"/>
                     <span>Pune (Organizer Location)</span>
                  </div>
                </div>

                {/* 💰 Money Breakdown for Provider */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
                   <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Total Dakshina</span>
                      <span className="font-bold">₹{req.totalAmount}</span>
                   </div>
                   <div className="flex justify-between text-xs text-green-600 mb-1">
                      <span>Received Online</span>
                      <span className="font-bold">+ ₹{req.paidAmount || 0}</span>
                   </div>
                   <div className="border-t border-gray-200 my-1"></div>
                   <div className="flex justify-between text-sm font-bold text-orange-600">
                      <span>Collect at Venue</span>
                      <span>₹{balance}</span>
                   </div>
                </div>

                {/* Action Buttons (Only if Pending) */}
                {isPending && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(req.id, 'CANCELLED')}
                      className="flex-1 py-3 rounded-xl border border-red-100 text-red-600 font-bold bg-red-50 hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'CONFIRMED')}
                      className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold shadow-md hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Accept
                    </button>
                  </div>
                )}
                
                {req.status === 'CONFIRMED' && (
                   <button className="w-full py-3 rounded-xl border border-green-200 text-green-700 font-bold bg-green-50 flex items-center justify-center gap-2 cursor-default">
                      <CheckCircle size={18} /> Booking Accepted
                   </button>
                )}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}