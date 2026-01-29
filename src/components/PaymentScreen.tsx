import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, ChevronRight, Loader2 } from 'lucide-react'; 

export default function PaymentScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [processingMode, setProcessingMode] = useState<'cash' | 'online' | null>(null);

  // Get Data passed from Event Planner
  const { bookingId, providerName, totalAmount, date, time, category } = location.state || {};
  const safeAmount = totalAmount || "5000";

  // 🥥 FLOW 1: CASH / DAKSHINA (Immediate Booking)
  const handleCashSelection = async () => {
    setProcessingMode('cash');

    // Simulate API Call delay
    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          bookingId, providerName, category, date, time,
          paymentStatus: 'PAY_AT_VENUE' 
        }
      });
    }, 1500); 
  };

  // 💳 FLOW 2: ONLINE (Go to Gateway Page)
  const handleOnlineSelection = () => {
    setProcessingMode('online');
    
    // Navigate to the NEW Payment Gateway Page
    // We pass all the data forward so the next page knows what to charge
    setTimeout(() => {
      navigate('/online-gateway', {
        state: { bookingId, providerName, totalAmount: safeAmount, category, date, time }
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Payment Method</h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        
        {/* Amount Summary */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Payable</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2">₹{safeAmount}</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-500 ml-1">Select an option to proceed:</p>
          
          {/* 🥥 OPTION 1: CASH (Direct Action) */}
          <button 
            onClick={handleCashSelection}
            disabled={processingMode !== null}
            className="w-full relative p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-orange-400 hover:shadow-md transition-all text-left group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                {processingMode === 'cash' ? <Loader2 className="animate-spin" /> : <Banknote size={24} />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">Pay Cash / Dakshina</h4>
                <p className="text-xs text-gray-500 mt-1">Pay after event completion</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-orange-500" />
            </div>
          </button>

          {/* 💳 OPTION 2: ONLINE (Redirects to Gateway) */}
          <button 
            onClick={handleOnlineSelection}
            disabled={processingMode !== null}
            className="w-full relative p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all text-left group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 {processingMode === 'online' ? <Loader2 className="animate-spin" /> : <CreditCard size={24} />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">Pay Online Now</h4>
                <p className="text-xs text-gray-500 mt-1">UPI, Card, Netbanking</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
            </div>
          </button>

        </div>
      </div>
      
      {/* Footer Note */}
      <div className="fixed bottom-6 left-0 right-0 text-center px-6">
         <p className="text-xs text-gray-400">
           By proceeding, you agree to the booking terms & conditions.
         </p>
      </div>

    </div>
  );
}