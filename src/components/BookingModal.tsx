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

  // 🕒 Time Slots
  const timeSlots = [
    "09:00 AM", "11:00 AM", "02:00 PM",
    "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"
  ];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsSubmitting(true);
      
      // Artificial delay for better UX
      setTimeout(() => {
        onConfirm(selectedDate, selectedTime); // 🚀 Send to Parent
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
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-xl border shadow-sm p-3" 
                  classNames={{
                    day_selected: "!bg-black !text-white hover:!bg-gray-800 rounded-full",
                    day_today: "bg-gray-100 text-gray-900 font-bold rounded-full",
                    day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-full cursor-pointer",
                    cell: "p-0 text-center text-sm relative [&:has([aria-selected])]:bg-transparent",
                    head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2 justify-between gap-1",
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