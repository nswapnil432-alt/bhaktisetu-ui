import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Lock, Smartphone, CreditCard, Landmark, 
  Loader2, Wallet, Edit2 
} from 'lucide-react';
import { Button } from './ui/button';

export default function OnlinePaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Get data passed from previous screen
  const { bookingId, providerName, totalAmount, date, time, category } = location.state || {};
  
  // 🟢 STATE FOR PARTIAL PAYMENT
  const originalTotal = parseFloat(totalAmount || "5000");
  const [payAmount, setPayAmount] = useState(originalTotal); // Default to full amount
  const [isEditingAmount, setIsEditingAmount] = useState(false);

  // Calculate Balance
  const balanceAmount = originalTotal - payAmount;

  // Input States
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Handle Amount Change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    
    // Validation: Can't pay more than total, can't pay negative
    if (val > originalTotal) val = originalTotal;
    if (val < 0) val = 0;
    
    setPayAmount(val);
  };

  const handlePayNow = async () => {
    if (payAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        bookingId: bookingId,           
        amount: payAmount, // 👈 SEND THE EDITED AMOUNT 
        method: activeTab.toUpperCase(),
        status: 'COMPLETED',            
        transactionId: "TXN" + Date.now()
      };

      const response = await fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const result = await response.json();
        
        navigate('/confirmation', {
          state: {
            bookingId, 
            providerName, 
            category, 
            date, 
            time,
            // 🟢 Send Payment Status based on amount
            paymentStatus: balanceAmount > 0 ? 'PARTIAL_PAYMENT' : 'PAID_ONLINE',
            paidAmount: payAmount,
            balanceAmount: balanceAmount, // Pass balance to show on receipt
            transactionId: paymentData.transactionId
          }
        });

      } else {
        alert("Payment Failed. Server Error.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Network Error: Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* 🔒 Secure Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
         <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
               <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
               <h1 className="text-lg font-bold text-gray-800 leading-none">Secure Payment</h1>
               <div className="flex items-center gap-1 text-green-600 text-xs font-bold mt-1">
                  <Lock size={10} /> 128-bit SSL Encrypted
               </div>
            </div>
         </div>
         <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Partner" className="h-6 opacity-40 grayscale" />
      </div>

      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
         
         {/* 🧾 EDITABLE Order Summary Card */}
         <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6 transition-all">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Paying To</p>
                  <h2 className="text-lg font-bold text-gray-900">{providerName || "Service Provider"}</h2>
                  <p className="text-xs text-orange-600 font-medium">{category}</p>
               </div>
               
               {/* 🟢 EDITABLE AMOUNT SECTION */}
               <div className="text-right">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Amount to Pay</p>
                  
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-2xl font-extrabold text-gray-900">₹</span>
                    <input 
                      type="number"
                      value={payAmount}
                      onChange={handleAmountChange}
                      className="text-2xl font-extrabold text-gray-900 w-24 text-right border-b-2 border-dashed border-gray-300 focus:border-orange-500 outline-none bg-transparent"
                    />
                    <Edit2 size={14} className="text-gray-400" />
                  </div>
                  
                  {/* Balance Indicator */}
                  {balanceAmount > 0 && (
                    <p className="text-xs text-red-500 font-bold mt-1 bg-red-50 px-2 py-1 rounded-md inline-block">
                      Balance: ₹{balanceAmount} (Pay at Venue)
                    </p>
                  )}
               </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-xs text-gray-500">
               <span>Total Bill: ₹{originalTotal}</span>
               <span>{date} • {time}</span>
            </div>
         </div>

         {/* 💳 Payment Methods Container */}
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex bg-gray-50 border-b border-gray-200">
               <button 
                  onClick={() => setActiveTab('upi')}
                  className={`flex-1 py-4 text-sm font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'upi' ? 'bg-white text-orange-600 border-t-2 border-t-orange-500' : 'text-gray-500 hover:bg-gray-100'}`}
               >
                  <Smartphone size={20} /> UPI
               </button>
               <button 
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 py-4 text-sm font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'card' ? 'bg-white text-blue-600 border-t-2 border-t-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
               >
                  <CreditCard size={20} /> Card
               </button>
               <button 
                  onClick={() => setActiveTab('netbanking')}
                  className={`flex-1 py-4 text-sm font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'netbanking' ? 'bg-white text-purple-600 border-t-2 border-t-purple-500' : 'text-gray-500 hover:bg-gray-100'}`}
               >
                  <Landmark size={20} /> NetBanking
               </button>
            </div>

            {/* Content Area */}
            <div className="p-6 min-h-[300px]">
               
               {/* 🟢 UPI CONTENT */}
               {activeTab === 'upi' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <p className="text-sm text-gray-600 font-medium">Select a UPI App to pay:</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button onClick={handlePayNow} className="p-3 border rounded-xl flex items-center justify-center gap-2 hover:border-orange-500 hover:bg-orange-50 transition-all">
                           <span className="font-bold text-gray-700">GPay</span>
                        </button>
                        <button onClick={handlePayNow} className="p-3 border rounded-xl flex items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-50 transition-all">
                           <span className="font-bold text-gray-700">PhonePe</span>
                        </button>
                     </div>

                     <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or enter UPI ID</span></div>
                     </div>

                     <div>
                        <input 
                           type="text" 
                           placeholder="Ex: mobileNumber@upi" 
                           value={upiId}
                           onChange={(e) => setUpiId(e.target.value)}
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                        />
                        <button 
                           onClick={handlePayNow}
                           disabled={loading || payAmount <= 0}
                           className="w-full mt-4 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {payAmount < originalTotal ? `Pay ₹${payAmount} Advance` : `Pay Full ₹${payAmount}`}
                        </button>
                     </div>
                  </div>
               )}

               {/* 🔵 CARD CONTENT */}
               {activeTab === 'card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                        <div className="relative">
                           <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                           <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000" 
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                           />
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <div className="space-y-2 flex-1">
                           <label className="text-xs font-bold text-gray-500 uppercase">Valid Thru</label>
                           <input 
                              type="text" 
                              placeholder="MM/YY" 
                              maxLength={5}
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-center"
                           />
                        </div>
                        <div className="space-y-2 w-24">
                           <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                           <input 
                              type="password" 
                              placeholder="123" 
                              maxLength={3}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-center"
                           />
                        </div>
                     </div>

                     <button 
                        onClick={handlePayNow}
                        disabled={loading || payAmount <= 0}
                        className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-50"
                     >
                        {payAmount < originalTotal ? `Pay ₹${payAmount} Advance` : `Pay Full ₹${payAmount}`}
                     </button>
                  </div>
               )}

               {/* 🟣 NETBANKING CONTENT */}
               {activeTab === 'netbanking' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <p className="text-sm text-gray-600 font-medium">Popular Banks</p>
                     <div className="grid grid-cols-3 gap-3">
                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'More'].map((bank) => (
                           <button 
                              key={bank}
                              onClick={handlePayNow}
                              disabled={loading || payAmount <= 0}
                              className="p-3 border rounded-lg flex flex-col items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all gap-1"
                           >
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              <span className="text-xs font-bold text-gray-600">{bank}</span>
                           </button>
                        ))}
                     </div>
                  </div>
               )}

            </div>
            
            {/* Footer Trust Bar */}
            <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-center items-center gap-4 text-gray-400 text-xs font-bold uppercase">
               <span>Powered by</span>
               <span className="font-extrabold text-gray-600 tracking-wider">Razorpay</span>
            </div>

         </div>

      </div>

      {/* Loading Overlay */}
      {loading && (
         <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Processing Payment</h2>
            <p className="text-gray-500 text-sm mt-2">Do not close this window...</p>
         </div>
      )}

    </div>
  );
}