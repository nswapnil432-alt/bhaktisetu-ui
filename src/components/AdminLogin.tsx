import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [phone, setPhone] = useState(''); // Backend expects phone
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. CALL THE API
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // 2. CHECK IF ADMIN
      if (data.user.role !== 'ADMIN') {
        throw new Error('Access Denied: You do not have Admin permissions.');
      }

      // 3. SUCCESS
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userType', 'admin');
      onLogin(); // Go to Dashboard

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] p-4 shadow-lg">
        <button
          onClick={onBack}
          className="text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo/Icon */}
          <motion.div
            className="flex justify-center mb-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] p-6 rounded-full shadow-xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">BhaktiSetu Administration</p>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username/Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-[#FF9933]" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter admin phone"
                  className="border-2 border-orange-200 focus:border-[#FF9933] rounded-xl"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                  <Lock className="w-4 h-4 text-[#FF9933]" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="border-2 border-orange-200 focus:border-[#FF9933] rounded-xl"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
                {isLoading ? "Verifying..." : "Login to Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
               <p className="text-xs text-gray-500">Secure Access Only</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}