import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  onConfirm: (date: Date, time: string) => void; // 👈 Just passes data
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  providerName, 
  onConfirm 
}: BookingModalProps) {
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  // Inside BookingModal component
const [month, setMonth] = useState<Date>(new Date()); // 🎯 State to track the visible month

  // 🕒 Time Slots
  const timeSlots = [
    "09:00 AM", "11:00 AM", "02:00 PM",
    "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"
  ];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsSubmitting(true);

      const dateToSend = new Date(selectedDate);
      dateToSend.setHours(12, 0, 0, 0)
      
      // Artificial delay for better UX
      setTimeout(() => {
        onConfirm(dateToSend, selectedTime); // 🚀 Send to Parent
        setIsSubmitting(false); 
      }, 500);
    }
  };

  // Reset state on open
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
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 pb-2 flex justify-between items-center border-b border-gray-50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Book {providerName}</h2>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                 <CalendarIcon size={12} /> Select availability
              </p>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-6 overflow-y-auto">
            {/* Calendar */}
            <div className="flex justify-center w-full">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                // 🎯 Add these two lines to unlock the arrows
                month={month}
                onMonthChange={setMonth}

                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="p-3 bg-white"
                classNames={{
                  // 🏷️ Header & Month Label
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-sm font-bold text-gray-900",

                  // 🏹 The Navigation Arrows (THE CRITICAL FIX)
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 absolute top-0 z-20 transition-all",
                  nav_button_previous: "left-1", // 👈 Moves "Back" arrow to the far left
                  nav_button_next: "right-1",    // 👈 Moves "Next" arrow to the far right

                  // 📅 The Grid Layout (No more squashing)
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between mb-2",
                  head_cell: "text-gray-400 w-9 font-medium text-[0.75rem] text-center",
                  row: "flex w-full mt-2 justify-between",
                  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",

                  // ✨ Selection & Hover Styling
                  day: "h-9 w-9 p-0 font-normal hover:bg-orange-50 rounded-full transition-all flex items-center justify-center cursor-pointer",
                  day_selected: "bg-orange-500 text-white font-bold hover:bg-orange-600 rounded-full",
                  day_today: "bg-gray-100 text-orange-600 font-bold rounded-full",
                  day_outside: "text-gray-200 opacity-30",
                  day_disabled: "text-gray-200 opacity-30 cursor-not-allowed",
                }}
              />
            </div>

            {/* Time Slots */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-gray-400"/> Available Slots
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all
                      ${selectedTime === time 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-md scale-105' 
                        : 'border-gray-200 text-gray-500 bg-white hover:border-gray-300'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              className={`w-full py-6 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2
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