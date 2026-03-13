import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, ArrowLeft, CheckCheck } from 'lucide-react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
export default function ChatRoom() {
const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
   const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
const bookingIdFromUrl = searchParams.get('bookingId');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [provider, setProvider] = useState<any>(null);

  const API_URL =  "http://localhost:3001";

  // ✅ 1. Load old messages

  // ✅ 2. Setup Socket
// ✅ Stabilized Socket Setup
useEffect(() => {
  if (!conversationId || !token) return;

  // 1. Initialize socket ONLY if it doesn't exist
  if (!socket.current) {
    socket.current = io(API_URL, {
      auth: { token },
      transports: ['websocket'] // 🚀 Force websocket to prevent polling loops
    });

    socket.current.on("connect", () => {
      console.log("✅ Connected to Socket Server:", socket.current?.id);
      socket.current?.emit("join_room", conversationId);
    });

    socket.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }

  // 2. CLEANUP: This is critical to stop the "repeating" hits
  return () => {
    if (socket.current) {
      console.log("🔌 Disconnecting Socket...");
      socket.current.off("receive_message");
      socket.current.disconnect();
      socket.current = null; // Reset the ref
    }
  };
}, [conversationId]); // 🚨 ONLY re-run if the chat person changes

  
  // ✅ 3. Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
  fetch(`http://localhost:3000/chat/history/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setMessages(data))
    .catch(err => console.error(err));
}, [conversationId]);
// Inside ChatRoom.tsx
const sendMessage = async () => {
   // This will be the Booking ID
  if (!newMessage.trim()) return;

 const messageData = {
      senderId: currentUser.id,
      receiverId: conversationId, // This comes from the top-level useParams
      content: newMessage,
      bookingId: bookingIdFromUrl || null // ✅ Now this is a simple variable, not a hook call
    };

  console.log("SENDING TO BACKEND:", messageData);
console.log("FINAL DYNAMIC PAYLOAD:", messageData);
  try {
    const res = await fetch("http://localhost:3000/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(messageData)
    });

    const data = await res.json();
    if (res.ok) {
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
      // Note: socket listener handles adding message to state
    }
  } catch (error) {
    console.error("Send error:", error);
  }
};

  return (
    <div className="flex flex-col h-screen bg-[#F7F7F7]">
      
      {/* HEADER */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm border-b sticky top-0 z-10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-bold text-gray-800">Support Chat</h2>
          <p className="text-[10px] text-green-500 font-medium">Online</p>
        </div>
      </div>

      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id || i}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                  isMe
                    ? 'bg-[#FF9933] text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="text-[14px] leading-relaxed">{msg.content}</p>

                <div
                  className={`flex items-center justify-end gap-1 mt-1 ${
                    isMe ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  <span className="text-[10px]">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>

                  {isMe && <CheckCheck size={12} />}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-100 p-3 rounded-full text-[14px] outline-none focus:ring-1 focus:ring-[#FF9933]"
        />

        <button
          onClick={sendMessage}
          className="w-11 h-11 bg-[#FF9933] text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}