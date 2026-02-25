import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
import { Phone, Lock, User, Loader2, ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function UserSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Sending data to your backend to create a user
      const response = await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          password: formData.password,
          role: 'USER' // Hardcoding the role so they become a Devotee!
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        alert("✅ Account created successfully! Please log in.");
        navigate('/login'); // Send them back to the login page
      } else {
        setError(data.message || 'Failed to create account.');
      }
    } catch (err) {
      console.error(err);
      setError('Network Error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Styling */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mandala" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FF9933" strokeWidth="2" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#FF9933" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mandala)" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FFD700] to-[#FF9933]"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#FF9933]/20 relative">
            
            <button 
              onClick={() => navigate(-1)} 
              className="absolute top-6 left-6 text-gray-400 hover:text-[#FF9933] transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="text-center mb-8 mt-4">
              <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 text-sm mt-1">Join BhaktiSetu as a Devotee</p>
            </div>

            {error && (
              <div className="mb-4 text-center text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-gray-700 mb-1 font-medium text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="rounded-full pl-12 border-2 border-gray-200 focus:border-[#FF9933] transition-colors h-12 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium text-sm">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    className="rounded-full pl-12 border-2 border-gray-200 focus:border-[#FF9933] transition-colors h-12 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="rounded-full pl-12 border-2 border-gray-200 focus:border-[#FF9933] transition-colors h-12 w-full"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || formData.phone.length !== 10 || !formData.password || !formData.fullName}
                className="w-full rounded-full h-12 mt-4 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white shadow-lg flex items-center justify-center gap-2 font-bold"
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin" size={20} /> Creating...</>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">Already have an account?</p>
              <button onClick={() => navigate('/login')} className="text-[#FF9933] hover:underline font-medium mt-1">
                Sign In here
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}