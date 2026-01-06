import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, MapPin, Calendar } from 'lucide-react';
import { ServiceProvider } from '../App';

interface CategoryListingProps {
  category: string;
  onBack: () => void;
  onProviderSelect: (provider: ServiceProvider) => void;
}

const categoryData: Record<string, { name: string; color: string; emoji: string }> = {
  kirtankar: { name: 'Kirtankar', color: '#FF9933', emoji: '🕉️' },
  gayak: { name: 'Gayak (Singer)', color: '#00AEEF', emoji: '🎤' },
  achari: { name: 'Achari (Pooja)', color: '#800000', emoji: '🔱' },
  lighting: { name: 'Lighting / Mandap', color: '#FFD700', emoji: '💡' },
  mrudung: { name: 'Mrudung Vadak', color: '#A0522D', emoji: '🥁' },
  harmonium: { name: 'Harmonium Player', color: '#008080', emoji: '🎹' },
  bhajani: { name: 'Bhajani Mandal', color: '#9932CC', emoji: '👥' },
  photographer: { name: 'Photographer', color: '#A9A9A9', emoji: '🎥' },
};

// Mock provider data
const getMockProviders = (category: string): ServiceProvider[] => {
  const categoryInfo = categoryData[category] || categoryData.kirtankar;
  
  return [
    {
      id: '1',
      name: 'Pandit Rajesh Sharma',
      category: categoryInfo.name,
      rating: 4.9,
      location: 'Pune, Maharashtra',
      distance: '2.3 km',
      avatar: 'https://images.unsplash.com/photo-1575669572405-52da19d6a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBraXJ0YW4lMjBzcGlyaXR1YWwlMjBzaW5nZXJ8ZW58MXx8fHwxNzYyMTQ5NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'Experienced professional with 15+ years in devotional performances',
      experience: 15,
      cost: '₹5,000 - ₹8,000',
      availability: 'Available',
      images: [
        'https://images.unsplash.com/photo-1575669572405-52da19d6a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBraXJ0YW4lMjBzcGlyaXR1YWwlMjBzaW5nZXJ8ZW58MXx8fHwxNzYyMTQ5NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1680490958064-14ed3acf3498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb29qYSUyMGNlcmVtb255fGVufDF8fHx8MTc2MjE0OTQyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    {
      id: '2',
      name: 'Guru Anand Kulkarni',
      category: categoryInfo.name,
      rating: 4.8,
      location: 'Mumbai, Maharashtra',
      distance: '5.7 km',
      avatar: 'https://images.unsplash.com/photo-1759674888817-8bbea9f89f1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBkZXZvdGlvbmFsJTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc2MjE0OTQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'Specializing in traditional and contemporary devotional music',
      experience: 12,
      cost: '₹4,500 - ₹7,000',
      availability: 'Available',
      images: [
        'https://images.unsplash.com/photo-1759674888817-8bbea9f89f1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBkZXZvdGlvbmFsJTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc2MjE0OTQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    {
      id: '3',
      name: 'Swami Deepak Patil',
      category: categoryInfo.name,
      rating: 4.7,
      location: 'Nashik, Maharashtra',
      distance: '8.1 km',
      avatar: 'https://images.unsplash.com/photo-1612249075164-f5e6a6181364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtdXNpY2FsJTIwaW5zdHJ1bWVudHMlMjB0YWJsYXxlbnwxfHx8fDE3NjIxNDk0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'Passionate about spreading spiritual wisdom through music',
      experience: 10,
      cost: '₹3,500 - ₹6,000',
      availability: 'Booked until Nov 10',
      images: [
        'https://images.unsplash.com/photo-1612249075164-f5e6a6181364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtdXNpY2FsJTIwaW5zdHJ1bWVudHMlMjB0YWJsYXxlbnwxfHx8fDE3NjIxNDk0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    {
      id: '4',
      name: 'Pandit Avinash Joshi',
      category: categoryInfo.name,
      rating: 5.0,
      location: 'Pune, Maharashtra',
      distance: '3.4 km',
      avatar: 'https://images.unsplash.com/photo-1747041807605-87a31a4b41e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYXAlMjBkZWNvcmF0aW9uJTIwd2VkZGluZ3xlbnwxfHx8fDE3NjIxNDk0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'Award-winning performer known for soulful renditions',
      experience: 20,
      cost: '₹8,000 - ₹12,000',
      availability: 'Available',
      images: [
        'https://images.unsplash.com/photo-1747041807605-87a31a4b41e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYXAlMjBkZWNvcmF0aW9uJTIwd2VkZGluZ3xlbnwxfHx8fDE3NjIxNDk0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
  ];
};

export default function CategoryListing({ category, onBack, onProviderSelect }: CategoryListingProps) {
  const categoryInfo = categoryData[category] || categoryData.kirtankar;
  const providers = getMockProviders(category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div
        className="rounded-b-[2rem] shadow-xl p-6 pb-8"
        style={{
          background: `linear-gradient(135deg, ${categoryInfo.color}, ${categoryInfo.color}dd)`,
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{categoryInfo.emoji}</span>
              <h2 className="text-white">{categoryInfo.name}</h2>
            </div>
            <p className="text-white/90">{providers.length} Professionals Available</p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Nearby', 'Top Rated', 'Available Today'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filter === 'All'
                  ? 'bg-white text-gray-800'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Providers list */}
      <div className="p-4 space-y-4">
        {providers.map((provider, index) => (
          <motion.button
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onProviderSelect(provider)}
            className="w-full text-left"
          >
            <div
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                border: `2px solid ${categoryInfo.color}20`,
              }}
            >
              <div className="flex gap-4 p-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden"
                    style={{
                      border: `3px solid ${categoryInfo.color}`,
                    }}
                  >
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {provider.availability === 'Available' && (
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                      style={{ backgroundColor: '#10B981' }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 mb-1 truncate">{provider.name}</h4>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="text-gray-900">{provider.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{provider.experience} yrs exp</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin size={14} />
                    <span className="truncate">{provider.location}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{provider.distance}</span>
                  </div>

                  {/* Availability and cost */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span
                        className={`${
                          provider.availability === 'Available'
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {provider.availability}
                      </span>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${categoryInfo.color}15`,
                        color: categoryInfo.color,
                      }}
                    >
                      {provider.cost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom badge */}
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${categoryInfo.color}, transparent)`,
                }}
              ></div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
