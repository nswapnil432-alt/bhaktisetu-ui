import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, X, Tag } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';

export default function EventPlanner() {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();

  // 1. Get Data Passed from URL
  const providerName = searchParams.get('name') || "Pandit Rajesh Sharma";
  const date = searchParams.get('date') || "27/01/2026";
  const time = searchParams.get('time') || "11:00 AM";
  const providerId = searchParams.get('providerId');
  const price = 5000;

  // 2. Form State
  const [eventName, setEventName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. The Final Booking Logic
  const handleConfirmBooking = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("Session expired. Please login again.");
      navigate('/login');
      return;
    }
    if (!eventName) {
      alert("Please enter an event name!"); 
      return;
    }

    setIsSubmitting(true);

    try {
      // 🚀 CREATE BOOKING IN BACKEND (Status: PENDING)
      const response = await fetch(`http://localhost:3000/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          organizerId: userId, 
          providerId: providerId,
          eventName: eventName,
          eventDate: new Date().toISOString(), 
          totalAmount: price
        })
      });

      if (response.ok) {
        const responseData = await response.json(); 

        // 🛑 WAS: navigate('/confirmation', ...);
        
        // ✅ NOW: GO TO PAYMENT SCREEN (To select Cash or Online)
        navigate('/payment', {
          state: {
            // Pass the ID we just got from the backend
            bookingId: responseData.bookingReference || responseData.id || "BKT" + Math.floor(1000 + Math.random() * 9000), 
            providerName: providerName, 
            totalAmount: price,
            category: "Kirtankar",
            date: date,
            time: time,
            eventName: eventName 
          }
        });

      } else {
        const errorData = await response.json();
        alert(`Booking Failed: ${errorData.message || "Unknown error"}`);
      }

    } catch (error) {
      console.error(error);
      alert("Network error. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* 🟠 Orange Header */}
      <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-6 pt-12 pb-16 rounded-b-[2.5rem] shadow-lg relative">
        <div className="flex justify-between items-start">
          {/* ✅ Navigate Back */}
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm">
            <ArrowLeft size={24} />
          </button>
          <button className="text-white/80 text-sm font-medium hover:text-white">Clear All</button>
        </div>
        <div className="mt-4 px-1">
          <h1 className="text-2xl font-bold text-white">Plan Your Event</h1>
          <p className="text-orange-100 text-sm mt-1">1 services selected</p>
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-4">

        {/* 📝 Event Details Input */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Event Details</label>
          <input
            type="text"
            placeholder="Enter event name (e.g., Krishna Janmashtami Kirtan)"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
        </div>

        {/* 📇 Provider Card (Selected Service) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
          <button className="absolute right-3 top-3 text-gray-400 hover:text-red-500"><X size={18} /></button>
          <div className="flex gap-4">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${providerName}`} alt="Provider" className="w-16 h-16 rounded-xl object-cover bg-orange-100" />
            <div>
              <h3 className="font-bold text-gray-900">{providerName}</h3>
              <p className="text-xs text-gray-500 mb-2">Kirtankar</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
              </div>
              <p className="text-orange-500 font-bold text-sm mt-1">₹{price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 🏷️ Promo Code */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Promo Code</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full pl-9 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-2.5 outline-none"
              />
            </div>
            <button className="text-orange-500 font-bold text-sm px-4 border border-orange-200 rounded-xl hover:bg-orange-50">
              Apply
            </button>
          </div>
        </div>

        {/* 💰 Price Summary */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Summary</h3>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Subtotal (1 services)</span>
            <span>₹{price.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>Total Amount</span>
            <span className="text-orange-500">₹{price.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* 🟡 Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 flex justify-between items-center z-50">
        <div>
          <p className="text-xs text-gray-500">Total Amount</p>
          <h2 className="text-xl font-bold text-gray-900">₹{price.toLocaleString()}</h2>
        </div>
        <Button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="bg-[#FCD34D] text-black font-bold px-8 py-6 rounded-xl hover:bg-[#fbbf24] shadow-lg shadow-orange-100"
        >
          {isSubmitting ? "Processing..." : "Confirm My Bhakti Event"}
        </Button>
      </div>

    </div>
  );
}