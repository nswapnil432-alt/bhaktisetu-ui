import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
});

export default function NotificationToast() {
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

  useEffect(() => {
    socket.on('booking_status', (data) => {
      console.log("🔥 NOTIFICATION RECEIVED:", data);
      setNotification({ message: data.message, type: data.status });
      setTimeout(() => setNotification(null), 6000); // Hide after 6s
    });

    return () => {
      socket.off('booking_status');
    };
  }, []);

  if (!notification) return null;

  return (
    // 🛑 FORCE VISIBILITY with Inline Styles (Bypasses all CSS issues)
    <div style={{
      position: 'fixed',
      top: '100px',        // Moved down to avoid Header
      right: '20px',       // Right side
      zIndex: 9999999,     // Extreme Z-Index to be on top of EVERYTHING
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0px 10px 30px rgba(0,0,0,0.3)', // Strong shadow
      borderLeft: `8px solid ${
        notification.type === 'CONFIRMED' ? '#22c55e' : 
        notification.type === 'REJECTED' ? '#ef4444' : '#3b82f6'
      }`,
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      minWidth: '320px',
      animation: 'slideIn 0.5s ease-out'
    }}>
      
      {/* Icon */}
      <div className={`p-3 rounded-full ${
        notification.type === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 
        notification.type === 'REJECTED' ? 'bg-red-100 text-red-600' : 
        'bg-blue-100 text-blue-600'
      }`}>
        {notification.type === 'CONFIRMED' ? <CheckCircle size={28} /> : 
         notification.type === 'REJECTED' ? <AlertCircle size={28} /> : 
         <Bell size={28} />}
      </div>

      {/* Text */}
      <div style={{flex: 1}}>
        <h4 style={{fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', marginBottom: '4px'}}>
          {notification.type}
        </h4>
        <p style={{fontSize: '14px', color: '#4b5563', fontWeight: '600'}}>
          {notification.message}
        </p>
      </div>

      {/* Close Button */}
      <button onClick={() => setNotification(null)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
        <X size={20} color="#9ca3af" />
      </button>

      {/* Simple Animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}