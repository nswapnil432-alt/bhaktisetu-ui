import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginSignupProps {
  onLogin: (name: string, type: 'user' | 'provider') => void;
  onProviderSignup: () => void;
}

export default function LoginSignup({ onLogin, onProviderSignup }: LoginSignupProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'provider'>('user');

  const handlePhoneLogin = () => {
    if (phoneNumber.length === 10) {
      setShowOTP(true);
    }
  };

  const handleOTPSubmit = () => {
    const userName = name || 'Devotee';
    onLogin(userName, loginType);
  };

  const handleGoogleLogin = () => {
    onLogin('Guest User', loginType);
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mandala" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FF9933" strokeWidth="2" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#FF9933" strokeWidth="1" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mandala)" />
        </svg>
      </div>

      {/* Saffron border decoration */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FFD700] to-[#FF9933]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FFD700] to-[#FF9933]"></div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        {/* Logo and welcome */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF9933] to-[#FFD700] flex items-center justify-center shadow-xl">
            <span className="text-white text-4xl">🕉️</span>
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-[#FF9933] to-[#FFD700] bg-clip-text text-transparent">
            Welcome to BhaktiSetu
          </h1>
          <p className="text-gray-600">Connect with Divine Services</p>
        </motion.div>

        {/* Login form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* User type toggle */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setLoginType('user')}
              className={`flex-1 py-3 rounded-full transition-all ${
                loginType === 'user'
                  ? 'bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              I'm a User
            </button>
            <button
              onClick={() => setLoginType('provider')}
              className={`flex-1 py-3 rounded-full transition-all ${
                loginType === 'provider'
                  ? 'bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              I'm a Provider
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#FF9933]/20">
            <h2 className="mb-2 text-center text-gray-800">
              {loginType === 'user' ? 'Sign In as User' : 'Provider Login'}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {loginType === 'user' 
                ? 'Book devotional services' 
                : 'Manage your services'}
            </p>

            {!showOTP ? (
              <>
                {/* Name input */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-full border-2 border-gray-200 focus:border-[#FF9933] transition-colors"
                  />
                </div>

                {/* Phone input */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-full pl-12 border-2 border-gray-200 focus:border-[#FF9933] transition-colors"
                    />
                  </div>
                </div>

                {/* Login button */}
                <Button
                  onClick={handlePhoneLogin}
                  disabled={phoneNumber.length !== 10}
                  className="w-full rounded-full h-12 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white shadow-lg disabled:opacity-50"
                >
                  Get OTP
                </Button>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Google login */}
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full rounded-full h-12 border-2 border-gray-200 hover:border-[#FF9933] hover:bg-[#FF9933]/5 transition-colors"
                >
                  <Mail className="mr-2" size={20} />
                  Continue with Google
                </Button>

                {/* Provider signup link */}
                {loginType === 'provider' && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-2">New service provider?</p>
                    <button
                      onClick={onProviderSignup}
                      className="text-[#FF9933] hover:underline"
                    >
                      Register as a Provider →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* OTP input */}
                <div className="mb-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Enter OTP sent to +91 {phoneNumber}
                  </p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center border-2 border-gray-200 rounded-xl focus:border-[#FF9933] outline-none transition-colors"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowOTP(false)}
                    className="text-[#FF9933]"
                  >
                    Change number
                  </button>
                </div>

                {/* Verify button */}
                <Button
                  onClick={handleOTPSubmit}
                  className="w-full rounded-full h-12 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white shadow-lg"
                >
                  Verify & Continue
                </Button>
              </>
            )}
          </div>

          {/* Terms */}
          <p className="text-center text-gray-500 mt-6 px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>

      {/* Bottom diya decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="text-2xl"
            >
              🪔
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
