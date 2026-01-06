import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Calendar, Heart, Settings, LogOut, Moon, Sun, Bell, Lock, HelpCircle, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

interface UserProfileProps {
  userName: string;
  onBack: () => void;
}

export default function UserProfile({ userName, onBack }: UserProfileProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const bookingHistory = [
    {
      id: 'BKT12345678',
      service: 'Kirtankar + Harmonium Player',
      date: 'Oct 15, 2025',
      status: 'Completed',
      rating: 5,
    },
    {
      id: 'BKT12345679',
      service: 'Bhajani Mandal',
      date: 'Sept 28, 2025',
      status: 'Completed',
      rating: 4,
    },
    {
      id: 'BKT12345680',
      service: 'Achari (Pooja)',
      date: 'Nov 10, 2025',
      status: 'Upcoming',
      rating: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] rounded-b-[2rem] shadow-xl p-6 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h2 className="text-white">My Profile</h2>
        </div>

        {/* Profile info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/40">
            <User className="text-white" size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-1">{userName}</h3>
            <p className="text-white/90">Devotee since 2023</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full">
                <span className="text-white">3 Events Organized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-4 text-center border-2 border-[#FF9933]/40"
          >
            <div className="w-10 h-10 bg-[#FF9933]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="text-[#FF9933]" size={20} />
            </div>
            <p className="text-gray-900">3</p>
            <p className="text-gray-600">Events</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-4 text-center border-2 border-[#FF9933]/40"
          >
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="text-pink-500" size={20} />
            </div>
            <p className="text-gray-900">5</p>
            <p className="text-gray-600">Favorites</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-4 text-center border-2 border-[#FF9933]/40"
          >
            <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="text-yellow-400" size={20} />
            </div>
            <p className="text-gray-900">4.8</p>
            <p className="text-gray-600">Rating</p>
          </motion.div>
        </div>

        {/* Booking history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookingHistory.map((booking, index) => (
              <div
                key={booking.id}
                className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{booking.service}</h4>
                    <p className="text-gray-600">{booking.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      booking.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                
                {booking.status === 'Completed' && booking.rating > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(booking.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={14} />
                    ))}
                  </div>
                )}
                
                <p className="text-gray-500 mt-2">ID: {booking.id}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-gray-900 mb-4">Settings</h3>
          
          <div className="space-y-4">
            {/* Dark mode */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="text-gray-600" size={20} />
                ) : (
                  <Sun className="text-gray-600" size={20} />
                )}
                <div>
                  <p className="text-gray-900">Dark Mode</p>
                  <p className="text-gray-600">Adjust app theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Bell className="text-gray-600" size={20} />
                <div>
                  <p className="text-gray-900">Notifications</p>
                  <p className="text-gray-600">Event updates & reminders</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {/* Account settings */}
            <button className="flex items-center justify-between w-full py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg">
              <div className="flex items-center gap-3">
                <Settings className="text-gray-600" size={20} />
                <div className="text-left">
                  <p className="text-gray-900">Account Settings</p>
                  <p className="text-gray-600">Manage your account</p>
                </div>
              </div>
            </button>

            {/* Privacy */}
            <button className="flex items-center justify-between w-full py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="text-gray-600" size={20} />
                <div className="text-left">
                  <p className="text-gray-900">Privacy & Security</p>
                  <p className="text-gray-600">Control your privacy</p>
                </div>
              </div>
            </button>

            {/* Help */}
            <button className="flex items-center justify-between w-full py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-gray-600" size={20} />
                <div className="text-left">
                  <p className="text-gray-900">Help & Support</p>
                  <p className="text-gray-600">Get assistance</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Logout button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="outline"
            className="w-full rounded-full h-12 border-2 border-red-500 text-red-500 hover:bg-red-50"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </Button>
        </motion.div>

        {/* App info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-500"
        >
          <p>BhaktiSetu v1.0.0</p>
          <p className="mt-1">Made with devotion 🙏</p>
        </motion.div>
      </div>
    </div>
  );
}
