import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  providerId?: string;
  onConfirm: (date: Date, time: string) => void;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  providerName, 
  providerId,
  onConfirm 
}: BookingModalProps) {
  
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🕒 Time Slots
  const timeSlots = [
    "09:00 AM", "11:00 AM", "02:00 PM",
    "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"
  ];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsSubmitting(true);
      
      // ✅ FIX: Use toDateString() for a cleaner URL format (e.g., "Mon Feb 15 2026")
      // This avoids issues with slashes in URLs
      const dateStr = selectedDate.toDateString(); 

      setTimeout(() => {
        // Trigger parent callback
        onConfirm(selectedDate, selectedTime);
        setIsSubmitting(false);
        onClose(); 

        // 🚀 NAVIGATE TO EVENT PLANNER
        navigate(`/plan-event?providerId=${providerId || 'PROVIDER_123'}&name=${encodeURIComponent(providerName)}&date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(selectedTime)}`);
      }, 500);
    }
  };

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(undefined);
      setSelectedTime(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* 🌑 DARK OVERLAY */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* ⬜ MODAL CARD */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 pb-2 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Book {providerName}</h2>
              <p className="text-xs text-gray-500 mt-1">Select date & time</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-6 overflow-y-auto">
            
            {/* 🗓️ CALENDAR SECTION */}
            <div className="flex justify-center w-full">
               <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // ✅ Disable past dates
                  className="rounded-xl border shadow-sm p-3 w-fit" 
                  classNames={{
                    day_selected: "!bg-black !text-white hover:!bg-gray-800 rounded-full",
                    day_today: "bg-gray-100 text-gray-900 font-bold rounded-full",
                    day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-full cursor-pointer",
                    // 🚨 Force Separation to fix jumbled numbers
                    cell: "p-0 text-center text-sm relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                    head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2 justify-between gap-1",
                    table: "w-full border-collapse space-y-1",
                  }}
               />
            </div>

            {/* ⏰ TIME SLOTS */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Available Slots</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all duration-200
                      ${selectedTime === time 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-md transform scale-105' 
                        : 'border-gray-200 text-gray-500 bg-white hover:border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* 🟡 CONFIRM BUTTON */}
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              className={`w-full py-6 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2
                 ${(!selectedDate || !selectedTime) 
                   ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                   : 'bg-[#FCD34D] text-black hover:bg-[#FBBF24] active:scale-[0.98]'}
              `}
            >
              {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </Button>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}