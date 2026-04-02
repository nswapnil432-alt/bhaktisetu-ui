import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check, Calendar, Clock, CreditCard, AlertCircle, Share2, Home,
  MessageCircle
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { useTranslation } from 'react-i18next';
 // 1. Define Props Interface (Fixes the App.tsx error)
interface BookingConfirmationProps {
  onBackToHome?: () => void; // Optional: If passed from App.tsx, we use it
}

// 2. Define Location State Interface (For Type Safety)
interface LocationState {
  bookingId?: string;
  providerName?: string;
  category?: string;
  eventName?: string;
  eventLocation?: string;
  date?: string;
  time?: string;
  totalAmount?: string | number;
  paymentStatus?: string;
  paidAmount?: number;
  transactionId?: string;
}

export default function BookingConfirmation({ onBackToHome }: BookingConfirmationProps) {
  const navigate = useNavigate();
  const location = useLocation();
const {t} = useTranslation();
  console.log("locations", location)
  // 3. GET DATA with Type Safety
  const state = location.state as LocationState || {};

  const {
    bookingId = "BKT" + Math.floor(100000 + Math.random() * 900000),
    providerName = "Provider Name",
    category = "Devotional Service",
    eventName = state.eventName,
    date = "Date",
    time = "Time",
    eventLocation = state.eventLocation,
    totalAmount,
    paidAmount,
    transactionId
  } = state;

  // 4. CALCULATE BALANCE
  const total = Number(totalAmount) || 20000; // Fallback to 20k if lost
  const paid = Number(paidAmount) || 0;
  const balance = total - paid; // 🧮 20000 - 2011 = 17989

  // Determine Badge Status
  const isFullyPaid = balance <= 0;

  // Handle Home Navigation (Use prop if exists, otherwise internal navigate)
  const handleHomeClick = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/home');
    }
  };

  const downloadPatrika = async () => {
    const node = document.getElementById('patrika-template');
    if (!node) return;

    try {
      // 🎯 1. FORCE VISIBILITY
      node.style.display = 'block';

      // 🎯 2. CAPTURE
      const dataUrl = await htmlToImage.toPng(node, {
        pixelRatio: 2,
        backgroundColor: '#FFFBF0', // Force Cream Background
        style: {
          display: 'block', // Ensure it's captured as a block
        }
      });

      // 🎯 3. DOWNLOAD
      const link = document.createElement('a');
      link.download = `BhaktiSetu_Invitation.png`;
      link.href = dataUrl;
      link.click();

      // 🎯 4. HIDE
      node.style.display = 'none';
    } catch (err) {
      console.error('Capture failed:', err);
      node.style.display = 'none';
    }
  };
  const shareOnWhatsApp = () => {
    // 🎯 Use the variables we extracted from state
    const nameOfEvent = eventName || "भक्ती कार्यक्रम";
    const venue = eventLocation || "आमचे निवासस्थान";

    const text = encodeURIComponent(
      `🙏 *${nameOfEvent}* ॥ श्री गणेशाय नम: ॥\n\n` +
      `आपणास कळविण्यास आनंद होत आहे की आम्ही *${nameOfEvent}* आयोजित केले आहे. तरी आपण सर्वांनी उपस्थित राहून दर्शनाचा लाभ घ्यावा.\n\n` +
      `🚩 *महाराज:* ${providerName}\n` +
      `📅 *तारीख:* ${date}\n` +
      `🕒 *वेळ:* ${time}\n` +
      `📍 *ठिकाण:* ${venue}\n\n` +
      `*भक्तीसेतू (BhaktiSetu)* द्वारे निमंत्रण पाठवण्यात आले आहे. 🙏`
    );

    window.open(`https://wa.me/?text=${text}`, '_blank');
  };
  return (
    <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center pb-10">

      {/* 1. Divine Success Header */}
      <div className="pt-12 pb-6 flex flex-col items-center text-center px-6">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_0_8px_rgba(34,197,94,0.2)] mb-4 animate-in zoom-in duration-500">
          <Check className="text-white w-10 h-10" strokeWidth={4} />
        </div>

        <h1 className="text-orange-600 font-bold text-xl mb-1 flex items-center gap-2">
          Request Sent to Maharaj Ji!
        </h1>
        <p className="text-gray-500 text-xs italic">
          Please wait for approval. You will be notified soon.
        </p>
        <p className="text-gray-500 text-xs italic">
          "May your devotional gathering be blessed with divine grace" 🙏
        </p>
        <p className="text-gray-400 text-[10px] mt-2 font-mono">
          ID: <span className="font-bold text-gray-600">{bookingId}</span>
        </p>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-md px-5 space-y-5">

        {/* 2. Provider Card */}
        <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
          <div className="flex gap-4">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(providerName)}`}
              className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-100"
              alt="Provider"
            />
            <div>
              <h3 className="font-bold text-gray-900">{providerName}</h3>
              <p className="text-xs text-orange-500 font-medium mb-1">{category}</p>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">📅 {date}</span>
                <span className="flex items-center gap-1">🕒 {time}</span>
                <span className="flex items-center gap-1">📍 {eventLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 💰 PAYMENT SUMMARY */}
        <div className="bg-white rounded-2xl border border-gray-200 p-0 shadow-sm overflow-hidden">
          <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Breakdown</span>
            {isFullyPaid ? (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check size={10} /> PAID
              </span>
            ) : (
              <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle size={10} /> BALANCE DUE
              </span>
            )}
          </div>

          <div className="p-4 space-y-3">
            {/* Total */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Seva Dakshina</span>
              <span className="font-bold text-gray-900">₹{total.toLocaleString()}</span>              </div>

            {/* Paid */}
            {paid > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1 text-xs">
                  <CreditCard size={12} className="text-green-600" /> Paid Online
                </span>
                <span className="font-bold">- ₹{paid.toLocaleString()}</span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 my-1"></div>

            {/* Balance */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">To Pay at Venue</span>
                <span className="text-[10px] text-gray-400">Cash / Lifafa after event</span>
              </div>
              <span className="text-xl font-extrabold text-orange-600">₹{balance.toLocaleString()}</span>              </div>
          </div>

          {/* TXN ID */}
          {transactionId && (
            <div className="bg-gray-50/50 p-1.5 text-center border-t border-gray-100">
              <p className="text-[9px] text-gray-400 font-mono">TXN: {transactionId}</p>
            </div>
          )}
        </div>

        {/* 4. Action Buttons */}
        <div className="flex gap-3 pt-1">
          {/* 1. Get Patrika Button */}
          <button
            onClick={downloadPatrika}
            className="flex-1 py-3 rounded-xl border border-orange-200 text-orange-600 font-bold hover:bg-orange-50 text-sm flex items-center justify-center gap-2 bg-white shadow-sm"
          >
            <Share2 size={16} /> Get Patrika
          </button>

          {/* 🎯 2. NEW: WhatsApp Share Button (The Green One) */}
          <button
            onClick={shareOnWhatsApp}
            className="flex-1 py-3 rounded-xl bg-[#25D366] text-green font-bold shadow-md text-sm flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all"
          >
            <MessageCircle size={18} /> Share WA
          </button>

          {/* 3. Home Button */}
          <button
            onClick={handleHomeClick}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white font-bold shadow-md text-sm flex items-center justify-center gap-2"
          >
            <Home size={16} /> Home
          </button>
        </div>

        {/* 5. ⏳ "What's Next?" Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-4">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">What's Next?</h3>

          <div className="space-y-5 relative pl-2">
            {/* Vertical Line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

            {/* Step 1 */}
            <div className="flex gap-4 relative z-10">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 border-2 border-white shadow-sm">1</div>
              <div>
                <p className="text-gray-900 font-bold text-xs">Provider Confirmation</p>
                <p className="text-gray-500 text-[10px]">Wait for Maharaj Ji to accept request</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 relative z-10">
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs shrink-0 border-2 border-white shadow-sm">2</div>
              <div>
                <p className="text-gray-900 font-bold text-xs">Event Coordination</p>
                <p className="text-gray-500 text-[10px]">Call will be arranged 2 days prior</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 relative z-10">
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs shrink-0 border-2 border-white shadow-sm">3</div>
              <div>
                <p className="text-gray-900 font-bold text-xs">Final Preparation</p>
                <p className="text-gray-500 text-[10px]">Items list (Samagri) will be shared</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Footer Quote */}
        <div className="text-center pt-4 pb-2 opacity-60">
          <p className="text-gray-500 text-[10px] italic font-medium">
            "Bhakti mein shakti hai" - There is power in devotion 🙏
          </p>
        </div>

      </div>
      {/* 🚩 TRADITIONAL KARYAKRAM PATRIKA (Hidden) */}
      {/* 🚩 THE BULLETPROOF TEMPLATE */}
      <div id="patrika-template" style={{
        display: 'none',
        width: '500px',
        backgroundColor: '#FFFBF0',
        padding: '40px',
        border: '15px solid #FF9933',
        textAlign: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '-999'
      }}>
        {/* Header */}
        <div style={{ color: '#E65100', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          ॥ श्री गणेशाय नम: ॥
        </div>

        <div style={{ color: '#D32F2F', fontSize: '20px', fontStyle: 'italic', marginBottom: '20px' }}>
          "सप्रेम निमंत्रण"
        </div>

        {/* Content */}
        <div style={{ backgroundColor: '#E65100', padding: '15px', borderRadius: '10px', marginBottom: '25px' }}>
          <h1 style={{ color: '#FFFFFF', fontSize: '30px', margin: '0', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {eventName || "Bhakti Karyakram"}
          </h1>
        </div>

        <div style={{ color: '#333333', fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>
          Pandit: {providerName}
        </div>

        <div style={{ color: '#555555', fontSize: '18px', lineHeight: '1.8' }}>
          <p style={{ margin: '5px 0' }}>📅 दिनांक: <strong>{date}</strong></p>
          <p style={{ margin: '5px 0' }}>🕒 वेळ: <strong>{time}</strong></p>
          <p style={{ margin: '5px 0' }}>📍 ठिकाण: <strong>{eventLocation}</strong></p>
        </div>

        {/* Branding */}
        <div style={{ marginTop: '30px', borderTop: '2px solid #FFCC80', paddingTop: '20px' }}>
          <p style={{ color: '#E65100', fontSize: '24px', fontWeight: '900', margin: '0' }}>BhaktiSetu</p>
          <p style={{ color: '#999', fontSize: '10px', margin: '0' }}>DIGITAL INVITATION</p>
        </div>
      </div>
    </div>

  );
}