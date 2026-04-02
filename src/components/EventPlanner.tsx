import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, X, Tag, MapPin } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { profile } from 'console';
import { useTranslation } from 'react-i18next';

export default function EventPlanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const {t} = useTranslation();
  // 1. Get Data Passed from URL
  const providerName = searchParams.get('name') || "Pandit Rajesh Sharma";
  const date = searchParams.get('date') || "27/01/2026";
  const time = searchParams.get('time') || "11:00 AM";
  const location = searchParams.get('eventLocation');
  const providerId = searchParams.get('providerId');
  const category = searchParams.get('category');
  const price = Number(searchParams.get('price')) || 5000

  // 2. Form State
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. The Final Booking Logic
  // Inside your EventPlanner.tsx

  const handleConfirmBooking = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId || !eventName || !eventLocation) {
      alert("Please enter all details! 🙏");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ FIX 1: THE DATE BUG
      // Instead of .toISOString(), we send the raw 'date' string to prevent UTC shifting
      const cleanDate = new Date(date);
      cleanDate.setHours(12, 0, 0, 0); // Set to noon so it stays on the same day in any timezone

      // ✅ FIX 2: THE PRICE SYNC
      // Ensure 'price' is converted to a Number. Sometimes '5000' is treated as a string.
      const finalAmount = Number(price);

      const response = await fetch(`http://localhost:3000/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId: userId,
          providerId: providerId,
          eventName: eventName,
          eventLocation: eventLocation,
          eventDate: cleanDate.toISOString(), // ✅ Sent as a clean object
          eventTime: time,
          totalAmount: finalAmount, // ✅ Sent as a clean number
          
        })
      });

      if (response.ok) {
        const result = await response.json();

        navigate('/payment', {
          state: {
            bookingId: result.id,
            providerName: providerName,
            totalAmount: finalAmount, // Passing the correct number
            date: date,
            time: time,
            eventName: eventName,
            eventLocation: eventLocation
          }
        });
      } else {
        const err = await response.json();
        alert(err.message || "Booking failed");
      }
    } catch (error) {
      console.error(error);
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
          <button className="text-red/80 text-sm font-medium hover:text-white" onClick={() => {
            setEventName('');
            setEventLocation('');
          }}>
            {t('Clear All')}
          </button>
        </div>
        <div className="mt-4 px-1">
          <h1 className="text-2xl font-bold text-orange">{t('Plan Your Event')}</h1>
          {/* <p className="text-orange-100 text-sm mt-1"></p> */}
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-4">

        {/* 📝 Event Details Input */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('Event Name')}</label>
          <input
            type="text"
            placeholder={t('Event Name')}
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
              <p className="text-xs text-gray-500 mb-2">{category}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
              </div>
              <p className="text-orange-500 font-bold text-sm mt-1">₹{price.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* 📍 NEW: Event Venue Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            {t('Event Location')}
          </label>
          <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2 focus-within:border-orange-500 transition-all">
            <MapPin size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Shaniwar Wada, Pune or Full Address"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="flex-1 outline-none text-sm font-medium bg-transparent"
            />
          </div>
        </div>
        

        {/* 💰 Price Summary */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('Price Summary')}</h3>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{t('Subtotal')}</span>
            <span>₹{(price.toLocaleString())}</span>
          </div>
          <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>{t('Total Amount')}</span>
            <span className="text-orange-500">₹{price.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* 🟡 Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 flex justify-between items-center z-50">
        <div>
          <p className="text-xs text-gray-500">{t('Total Amount')}</p>
          <h2 className="text-xl font-bold text-gray-900">₹{price.toLocaleString()}</h2>
        </div>
        <Button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="bg-[#FCD34D] text-black font-bold px-8 py-6 rounded-xl hover:bg-[#fbbf24] shadow-lg shadow-orange-100"
        >
          {isSubmitting ? "Processing..." : t('Confirm My Event')}
        </Button>
      </div>

    </div>
  );
}