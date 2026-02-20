import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // 👈 Fixed import (changed from motion/react)
import { Search, User, Sparkles, Loader2, ImageOff } from 'lucide-react'; 
import { Button } from './ui/button';
import { Input } from './ui/input';
import NotificationBell from './NotificationBell';

interface HomeScreenProps {
  userName: string;
  onCategorySelect: (category: string) => void;
  onPlanEvent: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
}

export default function HomeScreen({
  userName,
  onCategorySelect,
  onPlanEvent,
  onProfileClick,
}: HomeScreenProps) { // Removed onNotificationsClick from props since the Bell handles it now
  
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🚀 Fetch Real Data
    fetch('http://localhost:3000/users/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Backend did not return an array!", data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load categories", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white pb-24">
      
      {/* 🟢 FIXED HEADER */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] rounded-b-[2rem] shadow-xl p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          
          {/* Greeting Section */}
          <div>
            <p className="text-white/90">Namaskar 🙏</p>
            <h2 className="text-white font-bold text-2xl">{userName}</h2>
          </div>
          
          {/* Action Buttons Section */}
          <div className="flex items-center gap-4"> {/* Increased gap for better spacing */}
            
            {/* 🔔 The Clean Notification Bell */}
            {/* Removed the extra <button> wrapper and the Hello User text */}
            <div className="text-white"> 
               {/* Wrapped in a div with text-white so the Bell icon inherits the color if needed, 
                   though we styled the Bell icon as gray-700 inside its own component. 
                   If you want it white, update the Bell icon color inside NotificationBell.tsx */}
               <NotificationBell />
            </div>

            {/* Profile Button */}
            <button 
              onClick={onProfileClick} 
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-sm"
            >
              <User className="text-white" size={20} />
            </button>
            
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search for Kirtankar, Gayak, or Service"
            className="w-full pl-12 pr-4 py-6 rounded-2xl border-0 shadow-lg bg-white placeholder-gray-400 text-gray-800"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-6 shadow-lg cursor-pointer"
          onClick={onPlanEvent}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white mb-1 font-bold">Plan Your Event</h3>
              <p className="text-white/90">Book multiple services together</p>
            </div>
            <Sparkles className="text-white" size={32} />
          </div>
        </motion.div>

        <div className="mb-4">
          <h3 className="text-gray-800 font-bold text-lg">Browse Services</h3>
          <p className="text-gray-500 text-sm">Find the perfect match for your devotional event</p>
        </div>

        {/* 🎨 CATEGORIES GRID */}
        {isLoading ? (
           <div className="flex justify-center p-10"><Loader2 className="animate-spin text-orange-500" /></div>
        ) : categories.length === 0 ? (
           <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
             <ImageOff className="w-10 h-10 text-gray-300 mx-auto mb-2" />
             <p className="text-gray-500">No categories found.</p>
             <p className="text-xs text-orange-500 mt-1">Please add them in Admin Panel</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const safeColor = category.color || "#FF9933"; 
              
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onCategorySelect(category.name)}
                  className="relative group h-full"
                >
                  <div
                    className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center text-center justify-between bg-white"
                    style={{
                      background: `linear-gradient(135deg, ${safeColor}15, ${safeColor}05)`,
                      border: `1px solid ${safeColor}20`,
                    }}
                  >
                    <div className="flex flex-col items-center w-full">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md overflow-hidden"
                        style={{ backgroundColor: safeColor }}
                      >
                         {category.icon || category.imageUrl ? (
                            <img 
                              src={category.icon || category.imageUrl} 
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                         ) : (
                            <span className="text-2xl text-white">
                               {category.emoji || "🕉️"}
                            </span>
                         )}
                      </div>

                      <h4 className="text-gray-900 font-bold mb-1 leading-tight text-md">
                        {category.name}
                      </h4>
                    </div>
                    
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-sm mt-3 border border-gray-100">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: safeColor }}
                      ></div>
                      <span className="text-gray-600 text-xs font-bold">Available</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-gray-800 font-bold text-lg mb-4">Featured This Week</h3>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1680505303171-992ef799db43?w=1080&q=80"
              alt="Featured event"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-gray-900 font-bold mb-2">Special Kirtan Event Package</h4>
              <p className="text-gray-600 mb-3 text-sm">
                Complete package with Kirtankar, Musicians, and Decoration - Save 20%
              </p>
              <Button className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white rounded-full font-bold">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={onPlanEvent}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#FF9933] to-[#FFD700] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Sparkles className="text-white" size={28} />
      </motion.button>
    </div>
  );
}