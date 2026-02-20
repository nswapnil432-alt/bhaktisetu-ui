import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, Settings, LogOut, ChevronRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  userName: string;
  onBack: () => void;
}

export default function UserProfile({ userName, onBack }: UserProfileProps) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  // 🚀 LOAD REAL PHONE NUMBER
  useEffect(() => {
    const savedPhone = localStorage.getItem('userPhone');
    setPhone(savedPhone || "+91 XXXXX XXXXX"); // Fallback if missing
  }, []);

  // Logout Logic
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="p-5 space-y-6">
        
        {/* 👤 Profile Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-md">
            <User size={40} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{userName }</h2>
          
          {/* ✅ REAL PHONE NUMBER DISPLAYED HERE */}
          <p className="text-sm text-gray-500 font-medium">{phone}</p>
        </div>

        {/* 📋 Menu Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Menu</h3>

          {/* MY BOOKINGS */}
          <button 
            onClick={() => navigate('/my-bookings')} 
            className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Calendar size={20} />
              </div>
              <span className="font-bold text-gray-700">My Seva Bookings</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          {/* Help & Support */}
          <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Phone size={20} />
              </div>
              <span className="font-bold text-gray-700">Help & Support</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          {/* Settings */}
          <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                <Settings size={20} />
              </div>
              <span className="font-bold text-gray-700">Settings</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        </div>

        {/* 🚪 Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full mt-4 p-4 rounded-2xl flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>
    </div>
  );
}