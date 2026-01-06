import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface NotificationsChatProps {
  onBack: () => void;
}

const notifications = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking with Pandit Rajesh Sharma has been confirmed for Nov 10',
    time: '2 hours ago',
    icon: '✅',
    read: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Guru Anand Kulkarni sent you a message',
    time: '5 hours ago',
    icon: '💬',
    read: false,
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Event Reminder',
    message: 'Your event is scheduled for tomorrow at 6:00 PM',
    time: '1 day ago',
    icon: '🔔',
    read: true,
  },
  {
    id: '4',
    type: 'offer',
    title: 'Special Offer',
    message: 'Get 20% off on your next booking with code BHAKTI20',
    time: '2 days ago',
    icon: '🎉',
    read: true,
  },
];

const chatMessages = [
  {
    id: '1',
    sender: 'provider',
    name: 'Pandit Rajesh Sharma',
    message: 'Namaskar 🙏 Thank you for booking. I look forward to the event.',
    time: '10:30 AM',
    avatar: 'https://images.unsplash.com/photo-1575669572405-52da19d6a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBraXJ0YW4lMjBzcGlyaXR1YWwlMjBzaW5nZXJ8ZW58MXx8fHwxNzYyMTQ5NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    sender: 'user',
    message: 'Namaskar 🙏 We are looking forward to it!',
    time: '10:32 AM',
  },
  {
    id: '3',
    sender: 'provider',
    name: 'Pandit Rajesh Sharma',
    message: 'Could you please share the event location details?',
    time: '10:35 AM',
    avatar: 'https://images.unsplash.com/photo-1575669572405-52da19d6a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBraXJ0YW4lMjBzcGlyaXR1YWwlMjBzaW5nZXJ8ZW58MXx8fHwxNzYyMTQ5NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    sender: 'user',
    message: 'Sure! The event will be at Temple Hall, Pune. I will share the exact address shortly.',
    time: '10:38 AM',
  },
  {
    id: '5',
    sender: 'provider',
    name: 'Pandit Rajesh Sharma',
    message: 'Perfect! I will need approximately 30 minutes for setup before the event.',
    time: '10:40 AM',
    avatar: 'https://images.unsplash.com/photo-1575669572405-52da19d6a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBraXJ0YW4lMjBzcGlyaXR1YWwlMjBzaW5nZXJ8ZW58MXx8fHwxNzYyMTQ5NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export default function NotificationsChat({ onBack }: NotificationsChatProps) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Message sending logic would go here
      setMessage('');
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] p-6 pb-4 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h2 className="text-white">Messages & Notifications</h2>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-white/20 backdrop-blur-md border-0">
            <TabsTrigger
              value="notifications"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#FF9933]"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#FF9933]"
            >
              Chat
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={activeTab} className="flex-1 flex flex-col">
        {/* Notifications tab */}
        <TabsContent value="notifications" className="flex-1 overflow-y-auto m-0">
          <div className="p-4 space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-md p-4 border-2 ${
                  notification.read ? 'border-gray-100' : 'border-[#FF9933]/30 bg-orange-50/50'
                }`}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF9933] to-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                    {notification.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#FF9933] rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Chat tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b-2 border-[#FF9933]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF9933]">
                  <img
                    src={chatMessages[0].avatar}
                    alt="Provider"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h4 className="text-gray-900">{chatMessages[0].name}</h4>
                <p className="text-green-600">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-orange-50/30 to-yellow-50/30">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.sender === 'provider' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#FF9933]">
                      <img
                        src={msg.avatar}
                        alt="Provider"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <div
                      className={`rounded-2xl p-4 shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                      style={{
                        borderBottomLeftRadius: msg.sender === 'provider' ? '4px' : '16px',
                        borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                      }}
                    >
                      <p className={msg.sender === 'user' ? 'text-white' : 'text-gray-900'}>
                        {msg.message}
                      </p>
                    </div>
                    <p className={`text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Paperclip className="text-gray-600" size={20} />
              </button>
              
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Type your message... 🙏"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="rounded-full border-2 border-gray-200 focus:border-[#FF9933] pr-12"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Smile className="text-gray-600" size={20} />
                </button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white shadow-lg disabled:opacity-50 p-0"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
