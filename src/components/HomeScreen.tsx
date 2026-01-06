import React from 'react';
import { motion } from 'motion/react';
import { Search, Bell, User, Mic, Music, Droplet, Lightbulb, Drum, Piano, Users, Camera, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HomeScreenProps {
  userName: string;
  onCategorySelect: (category: string) => void;
  onPlanEvent: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
}

const categories = [
  {
    id: 'kirtankar',
    name: 'Kirtankar',
    icon: Mic,
    color: '#FF9933',
    bgColor: 'bg-[#FF9933]',
    emoji: '🕉️',
  },
  {
    id: 'gayak',
    name: 'Gayak (Singer)',
    icon: Music,
    color: '#00AEEF',
    bgColor: 'bg-[#00AEEF]',
    emoji: '🎤',
  },
  {
    id: 'achari',
    name: 'Achari (Pooja)',
    icon: Droplet,
    color: '#800000',
    bgColor: 'bg-[#800000]',
    emoji: '🔱',
  },
  {
    id: 'lighting',
    name: 'Lighting / Mandap',
    icon: Lightbulb,
    color: '#FFD700',
    bgColor: 'bg-[#FFD700]',
    emoji: '💡',
  },
  {
    id: 'mrudung',
    name: 'Mrudung Vadak',
    icon: Drum,
    color: '#A0522D',
    bgColor: 'bg-[#A0522D]',
    emoji: '🥁',
  },
  {
    id: 'harmonium',
    name: 'Harmonium Player',
    icon: Piano,
    color: '#008080',
    bgColor: 'bg-[#008080]',
    emoji: '🎹',
  },
  {
    id: 'bhajani',
    name: 'Bhajani Mandal',
    icon: Users,
    color: '#9932CC',
    bgColor: 'bg-[#9932CC]',
    emoji: '👥',
  },
  {
    id: 'photographer',
    name: 'Photographer',
    icon: Camera,
    color: '#A9A9A9',
    bgColor: 'bg-[#A9A9A9]',
    emoji: '🎥',
  },
];

export default function HomeScreen({
  userName,
  onCategorySelect,
  onPlanEvent,
  onProfileClick,
  onNotificationsClick,
}: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white pb-24">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] rounded-b-[2rem] shadow-xl p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-white/90">Namaskar 🙏</p>
            <h2 className="text-white">{userName}</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onNotificationsClick}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Bell className="text-white" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={onProfileClick}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <User className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search for Kirtankar, Gayak, or Service"
            className="w-full pl-12 pr-4 py-6 rounded-2xl border-0 shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Quick actions banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white mb-1">Plan Your Event</h3>
              <p className="text-white/90">Book multiple services together</p>
            </div>
            <Sparkles className="text-white" size={32} />
          </div>
        </motion.div>

        {/* Section title */}
        <div className="mb-4">
          <h3 className="text-gray-800">Browse Services</h3>
          <p className="text-gray-500">Find the perfect match for your devotional event</p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onCategorySelect(category.id)}
              className="relative group"
            >
              <div
                className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)`,
                  border: `2px solid ${category.color}40`,
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="text-2xl">{category.emoji}</span>
                </div>

                {/* Category name */}
                <h4 className="text-gray-800 mb-1">{category.name}</h4>
                
                {/* Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 mt-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-gray-600">Available</span>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Featured section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-gray-800 mb-4">Featured This Week</h3>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1680505303171-992ef799db43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBiZWxscyUyMHNwaXJpdHVhbHxlbnwxfHx8fDE3NjIxNDk0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Featured event"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-gray-800 mb-2">Special Kirtan Event Package</h4>
              <p className="text-gray-600 mb-3">
                Complete package with Kirtankar, Musicians, and Decoration - Save 20%
              </p>
              <Button className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white rounded-full">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating action button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={onPlanEvent}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#FF9933] to-[#FFD700] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="text-white" size={28} />
        
        {/* Pulsing ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#FF9933]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.button>
    </div>
  );
}
