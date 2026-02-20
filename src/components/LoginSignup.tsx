import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
import { Phone, Mail, Lock, Loader2, Shield } from 'lucide-react'; 
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginSignupProps {
  onLogin: (name: string, type: 'user' | 'provider') => void;
  onProviderSignup: () => void;
  onAdminAccess?: () => void;
}

export default function LoginSignup({ onLogin, onProviderSignup, onAdminAccess }: LoginSignupProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loginType, setLoginType] = useState<'user' | 'provider'>('user');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneLogin = () => {
    if (phoneNumber.length === 10) {
      setShowPassword(true);
      setError('');
    }
  };

  const handleLoginSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ SUCCESS
        localStorage.setItem('token', data.access_token);
        
        // 1. Save Base User ID
        if (data.user && data.user.id) {
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userName', data.user.fullName || 'User');
        }

        // 🚀 2. THE FIX: The Smart Provider ID Hunter
        // We check every possible way your backend might send the Provider Profile
        if (loginType === 'provider') {
            let foundProviderId = null;

            if (data.user?.providerProfile?.id) {
                foundProviderId = data.user.providerProfile.id; 
            } else if (data.user?.provider?.id) {
                foundProviderId = data.user.provider.id; 
            } else if (data.providerProfile?.id) {
                foundProviderId = data.providerProfile.id;
            } else if (data.providerId) {
                foundProviderId = data.providerId;
            }

            if (foundProviderId) {
                localStorage.setItem('providerId', foundProviderId);
            } else {
                // If this triggers, your backend is NOT sending the provider ID during login!
                console.error("🚨 CRITICAL: Logged in as Provider, but Backend didn't send a Provider ID! Full response:", data);
            }
        }

        // 3. Save Phone Number
        localStorage.setItem('userPhone', data.user?.phone || phoneNumber); 

        // Trigger App Navigation
        onLogin(data.user?.fullName || 'User', loginType);
      } else {
        // ❌ ERROR
        setError(data.message || 'Login Failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network Error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    onLogin('Guest User', loginType);
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden font-sans">
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

      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FFD700] to-[#FF9933]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FFD700] to-[#FF9933]"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF9933] to-[#FFD700] flex items-center justify-center shadow-xl">
            <span className="text-white text-4xl">🕉️</span>
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-[#FF9933] to-[#FFD700] bg-clip-text text-transparent text-3xl font-bold">
            Welcome to BhaktiSetu
          </h1>
          <p className="text-gray-600">Connect with Divine Services</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setLoginType('user')}
              className={`flex-1 py-3 rounded-full transition-all ${loginType === 'user'
                  ? 'bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              I'm a User
            </button>
            <button
              onClick={() => setLoginType('provider')}
              className={`flex-1 py-3 rounded-full transition-all ${loginType === 'provider'
                  ? 'bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              I'm a Provider
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#FF9933]/20">
            <h2 className="mb-2 text-center text-gray-800 text-xl font-semibold">
              {loginType === 'user' ? 'Sign In as User' : 'Provider Login'}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {loginType === 'user'
                ? 'Book devotional services'
                : 'Manage your services'}
            </p>

            {error && (
              <div className="mb-4 text-center text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 text-sm">
                {error}
              </div>
            )}

            {!showPassword ? (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-full pl-12 border-2 border-gray-200 focus:border-[#FF9933] transition-colors h-12"
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePhoneLogin}
                  disabled={phoneNumber.length !== 10}
                  className="w-full rounded-full h-12 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white shadow-lg disabled:opacity-50 font-bold tracking-wide"
                >
                  Continue
                </Button>

                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full rounded-full h-12 border-2 border-gray-200 hover:border-[#FF9933] hover:bg-[#FF9933]/5 transition-colors"
                >
                  <Mail className="mr-2" size={20} />
                  Continue with Google
                </Button>

                {loginType === 'provider' && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-2">New service provider?</p>
                    <button onClick={onProviderSignup} className="text-[#FF9933] hover:underline font-medium">
                      Register as a Provider →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="mb-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Hello, <span className="font-bold text-gray-800">+91 {phoneNumber}</span>
                  </p>
                  <button onClick={() => setShowPassword(false)} className="text-sm text-[#FF9933] hover:underline">
                    Change Number?
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium text-left">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-full pl-12 border-2 border-gray-200 focus:border-[#FF9933] transition-colors h-12"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleLoginSubmit}
                  disabled={isLoading || !password}
                  className="w-full rounded-full h-12 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white shadow-lg flex items-center justify-center gap-2 font-bold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Verifying...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          <p className="text-center text-gray-500 mt-6 px-4 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>

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

      {onAdminAccess && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onAdminAccess}
          className="absolute bottom-24 right-6 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border-2 border-[#FF9933]/30 hover:bg-[#FF9933]/10 transition-all z-20"
          title="Admin Access"
        >
          <Shield className="w-5 h-5 text-[#FF9933]" />
        </motion.button>
      )}
    </div>
  );
}