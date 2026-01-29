import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, MapPin, Calendar, Loader2 } from 'lucide-react';
// import { Input } from './ui/input'; // Unused, removed for cleanliness

interface CategoryListingProps {
  category: string;
  onBack: () => void;
  onProviderSelect: (provider: any) => void;
}

export default function CategoryListing({ category, onBack, onProviderSelect }: CategoryListingProps) {
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 🎨 Theme State
  const [themeColor, setThemeColor] = useState('#FF9933');
  const [categoryEmoji, setCategoryEmoji] = useState('🕉️');

  useEffect(() => {
    setIsLoading(true);

    // 1. Fetch Categories (For Styling)
    fetch('http://localhost:3000/users/categories')
      .then(res => res.json())
      .then(cats => {
        const cleanName = category.replace(/s$/, "").toLowerCase();
        const matchedCat = cats.find((c: any) => c.name.toLowerCase().includes(cleanName));
        if (matchedCat) {
          setThemeColor(matchedCat.color || '#FF9933');
          setCategoryEmoji(matchedCat.emoji || '🕉️');
        }
      })
      .catch(err => console.error("Category styling fetch error", err));

    // 2. Fetch Providers
    // 🛑 Optimization: Ideally use /profiles/search?category=... but this works for now
    fetch('http://localhost:3000/users') 
      .then(res => res.json())
      .then(data => {
        // A. Filter only Providers of this Category
        const filtered = data.filter((user: any) => {
          if (user.role !== 'PROVIDER') return false;
          
          // Safety Check: Does profile exist?
          if (!user.providerProfile) return false;

          const userCat = user.category || user.providerProfile.category?.name || "";
          const dbCategory = userCat.toLowerCase().replace(/s$/, "");
          const selectedCategory = category.toLowerCase().replace(/s$/, "");

          return dbCategory.includes(selectedCategory) || selectedCategory.includes(dbCategory);
        });

        // B. 🚨 CRITICAL FIX: Map the ID correctly!
        // We must use providerProfile.id for bookings, NOT user.id
        const mappedProviders = filtered.map((user: any) => ({
          ...user,
          id: user.providerProfile.id, // 👈 THIS FIXES THE "NO RECORD FOUND" ERROR
          userId: user.id, // Keep original user ID just in case
          // Flatten useful profile data for easier display
          experience: user.providerProfile.experience,
          location: user.providerProfile.city || user.location,
          basePrice: user.providerProfile.basePrice,
          rating: 4.8 // Mock rating if DB doesn't have it yet
        }));

        console.log(`✅ Loaded ${mappedProviders.length} providers for ${category}`);
        setProviders(mappedProviders);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load providers", err);
        setIsLoading(false);
      });
  }, [category]);

  // Client Filter (Search)
  const displayedProviders = providers.filter(p => {
    const name = p.fullName || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">

      {/* 🎨 DYNAMIC COLORED HEADER */}
      <div
        className="pt-6 pb-12 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: themeColor }}
      >
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryEmoji}</span>
              <h1 className="text-2xl font-bold text-white capitalize">
                {category.endsWith('s') ? category : `${category}s`}
              </h1>
            </div>
            <p className="text-white/90 text-sm font-medium ml-1">
              {providers.length} Professionals Available
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Nearby', 'Top Rated', 'Available'].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-white text-gray-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 PROVIDER LIST */}
      <div className="p-4 space-y-4 px-5 pt-6 pb-8 -mt-6 relative z-10 flex flex-col gap-5">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm">
            <Loader2 className="animate-spin mb-2" style={{ color: themeColor }} size={32} />
            <p className="text-gray-400 text-sm">Finding Best {category}s...</p>
          </div>
        ) : displayedProviders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
            <p className="text-gray-400">No providers found for {category}.</p>
            <p className="text-xs text-orange-400 mt-2">Try adding one in Admin Panel</p>
          </div>
        ) : (
          displayedProviders.map((provider, index) => (
            <motion.div
              key={provider.id} // This is now the Profile ID
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -6, 
                scale: 1.02,
                boxShadow: `0 10px 25px -5px ${themeColor}40`
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onProviderSelect(provider)}
              className="w-full text-left bg-white rounded-2xl p-4 shadow-md border border-gray-100 cursor-pointer transition-all duration-300 relative overflow-hidden"
              style={{ borderBottom: `4px solid ${themeColor}` }}
            >
              <div className="flex gap-4 p-4 pb-2">
                {/* 🖼️ Avatar */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.fullName}`}
                      alt={provider.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>

                {/* 📝 Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-gray-900 mb-1 truncate font-bold text-lg">{provider.fullName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-700">{provider.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-0.5">
                    <span className="font-medium">{provider.experience || 0} yrs exp</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="truncate max-w-[100px]">{provider.location || 'Pune, MH'}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <MapPin size={12} />
                    <span>{provider.location || "Maharashtra"} • 2.3 km</span>
                  </div>
                </div>
              </div>

              {/* 💰 Price & Avail */}
              <div className="mt-2 px-4 pb-2 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">Available Today</span>
                </div>

                <div
                  className="px-4 py-1.5 rounded-full font-bold text-sm shadow-sm"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor,
                  }}
                >
                  {provider.basePrice
                    ? `₹${provider.basePrice} / event`
                    : '₹Contact'}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}