import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Trash2, Clock } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const userId = localStorage.getItem('userId');

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:3000/notifications/${userId}`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        cache: 'no-store' 
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error("🔔 Bell Error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications(); 
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0 && userId) {
      await fetch(`http://localhost:3000/notifications/${userId}/read`, { method: 'PATCH' });
      setUnreadCount(0); 
    }
  };

  const handleDelete = async (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation(); 
    try {
      await fetch(`http://localhost:3000/notifications/${notifId}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <div className="relative z-50"> 
      
      {/* 🔔 Button */}
      <button 
        onClick={handleOpen} 
        className="relative w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/30 transition-all shadow-sm"
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-transparent shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 📜 Dropdown List */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          {/* THE FIX: w-[300px] and origin-top-right makes it drop perfectly without crowding */}
          <div className="absolute right-0 top-full mt-2 w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-800 text-sm pl-2">Notifications</h3>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-700">
                <X size={16} />
              </button>
            </div>
            
            <div 
              className="overflow-y-auto bg-white overscroll-contain"
              style={{ maxHeight: '300px' }} 
            >
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                    <Bell size={28} className="opacity-20 mb-1" />
                    <p className="font-medium text-xs">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-orange-50/30' : ''}`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-full shrink-0
                      ${notif.type === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 
                        notif.type === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {notif.type === 'CONFIRMED' ? <CheckCircle size={14} /> : 
                       notif.type === 'REJECTED' ? <AlertCircle size={14} /> : <Info size={14} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 leading-snug break-words pr-1">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-medium flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {' • '}
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button 
                      onClick={(e) => handleDelete(e, notif.id)} 
                      className="text-gray-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors shrink-0"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}