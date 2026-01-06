import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, DollarSign, TrendingUp, Star, MapPin, Phone, MessageCircle, Settings, BarChart3, Users, CheckCircle, XCircle, Mic, Music, Droplet, Lightbulb, Drum, Piano, Users as UsersIcon, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface ProviderDashboardProps {
  providerName: string;
  providerCategory: string;
  onBack: () => void;
}

const categoryData: Record<string, { name: string; color: string; emoji: string; icon: any }> = {
  kirtankar: { name: 'Kirtankar', color: '#FF9933', emoji: '🕉️', icon: Mic },
  gayak: { name: 'Gayak (Singer)', color: '#00AEEF', emoji: '🎤', icon: Music },
  achari: { name: 'Achari (Pooja)', color: '#800000', emoji: '🔱', icon: Droplet },
  lighting: { name: 'Lighting / Mandap', color: '#FFD700', emoji: '💡', icon: Lightbulb },
  mrudung: { name: 'Mrudung Vadak', color: '#A0522D', emoji: '🥁', icon: Drum },
  harmonium: { name: 'Harmonium Player', color: '#008080', emoji: '🎹', icon: Piano },
  bhajani: { name: 'Bhajani Mandal', color: '#9932CC', emoji: '👥', icon: UsersIcon },
  photographer: { name: 'Photographer', color: '#A9A9A9', emoji: '🎥', icon: Camera },
};

const mockBookings = [
  {
    id: '1',
    clientName: 'Priya Deshmukh',
    event: 'Krishna Janmashtami Kirtan',
    date: 'Nov 10, 2025',
    time: '6:00 PM',
    location: 'Temple Hall, Pune',
    amount: '₹6,000',
    status: 'confirmed',
  },
  {
    id: '2',
    clientName: 'Amit Patil',
    event: 'Ganesh Pooja',
    date: 'Nov 15, 2025',
    time: '10:00 AM',
    location: 'Community Center, Mumbai',
    amount: '₹5,500',
    status: 'pending',
  },
  {
    id: '3',
    clientName: 'Sunita Joshi',
    event: 'Bhajani Mandal Evening',
    date: 'Oct 28, 2025',
    time: '5:00 PM',
    location: 'Garden Hall, Nashik',
    amount: '₹7,000',
    status: 'completed',
  },
];

export default function ProviderDashboard({ providerName, providerCategory, onBack }: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const category = categoryData[providerCategory] || categoryData.kirtankar;
  const CategoryIcon = category.icon;

  const stats = {
    totalBookings: 15,
    thisMonth: 8,
    earnings: '₹85,000',
    rating: 4.8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-8">
      {/* Header */}
      <div 
        className="rounded-b-[2rem] shadow-xl p-6 pb-8"
        style={{
          background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Provider Dashboard</h2>
            <p className="text-white/90">Welcome back, {providerName}! 🙏</p>
          </div>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Settings className="text-white" size={20} />
          </button>
        </div>

        {/* Provider category badge */}
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl p-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'white' }}
          >
            <span className="text-2xl">{category.emoji}</span>
          </div>
          <div className="flex-1">
            <p className="text-white/90">Service Category</p>
            <h3 className="text-white">{category.name}</h3>
          </div>
          <Badge className="bg-green-500 text-white border-0">Active</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-white border-2 shadow-lg" style={{ borderColor: `${category.color}40` }}>
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Calendar size={20} style={{ color: category.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600">Bookings</p>
                  <h3 className="text-gray-900">{stats.totalBookings}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp size={14} />
                <span>+3 this week</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-white border-2 border-[#FF9933]/40 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FF9933]/20">
                  <DollarSign size={20} className="text-[#FF9933]" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600">Earnings</p>
                  <h3 className="text-gray-900">{stats.earnings}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp size={14} />
                <span>+12% growth</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-white border-2 border-yellow-400/40 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-400/20">
                  <Star size={20} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600">Rating</p>
                  <h3 className="text-gray-900">{stats.rating}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(stats.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-white border-2 border-blue-400/40 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-400/20">
                  <Users size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600">This Month</p>
                  <h3 className="text-gray-900">{stats.thisMonth}</h3>
                </div>
              </div>
              <p className="text-gray-600">events booked</p>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-white shadow-lg">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9933] data-[state=active]:to-[#FFD700] data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="bookings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9933] data-[state=active]:to-[#FFD700] data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9933] data-[state=active]:to-[#FFD700] data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6 bg-white shadow-lg border-2 border-[#FF9933]/20">
              <h3 className="text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { text: 'New booking request from Priya Deshmukh', time: '2 hours ago', icon: Calendar, color: '#FF9933' },
                  { text: 'Payment received: ₹7,000', time: '1 day ago', icon: DollarSign, color: '#10B981' },
                  { text: 'New 5-star review received', time: '2 days ago', icon: Star, color: '#FFD700' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${activity.color}20` }}
                    >
                      <activity.icon size={20} style={{ color: activity.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.text}</p>
                      <p className="text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-[#FF9933]/10 to-[#FFD700]/10 shadow-lg border-2 border-[#FF9933]/20">
              <h3 className="text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600 mb-4">80% completed - Add photos and videos to attract more clients</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-[#FF9933] to-[#FFD700]" style={{ width: '80%' }} />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white rounded-full"
              >
                Complete Profile
              </Button>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {mockBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 bg-white shadow-lg border-2" style={{ borderColor: `${category.color}40` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-gray-900 mb-1">{booking.event}</h4>
                      <p className="text-gray-600">{booking.clientName}</p>
                    </div>
                    <Badge
                      className={`${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {booking.status === 'confirmed' && <CheckCircle size={14} className="mr-1" />}
                      {booking.status === 'pending' && <Clock size={14} className="mr-1" />}
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                      <MapPin size={14} />
                      <span>{booking.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span 
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      {booking.amount}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Phone size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MessageCircle size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full"
                      >
                        <CheckCircle size={18} className="mr-1" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <XCircle size={18} className="mr-1" />
                        Decline
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-6 bg-white shadow-lg border-2 border-[#FF9933]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FF9933]/20 rounded-xl flex items-center justify-center">
                  <BarChart3 size={24} className="text-[#FF9933]" />
                </div>
                <div>
                  <h3 className="text-gray-900">Performance Overview</h3>
                  <p className="text-gray-600">Last 30 days</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Profile Views</span>
                    <span className="text-gray-900">156</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF9933] to-[#FFD700]" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Booking Conversion</span>
                    <span className="text-gray-900">65%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF9933] to-[#FFD700]" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Response Rate</span>
                    <span className="text-gray-900">92%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF9933] to-[#FFD700]" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg border-2 border-green-200">
              <h3 className="text-gray-900 mb-3">Top Performing Months</h3>
              <div className="space-y-2">
                {[
                  { month: 'September', bookings: 12, amount: '₹84,000' },
                  { month: 'August', bookings: 10, amount: '₹70,000' },
                  { month: 'July', bookings: 9, amount: '₹63,000' },
                ].map((data) => (
                  <div key={data.month} className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div>
                      <p className="text-gray-900">{data.month}</p>
                      <p className="text-gray-600">{data.bookings} bookings</p>
                    </div>
                    <span className="text-green-600">{data.amount}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
