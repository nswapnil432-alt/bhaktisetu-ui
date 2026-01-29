import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Phone, MapPin, Clock, FileText, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ProviderSignupProps {
  onSignupComplete: (user: any) => void;
  onBack: () => void;
}

export default function ProviderSignup({ onSignupComplete, onBack }: ProviderSignupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]); 
  
  // 🆕 STEP STATE: 1 = Category Selection, 2 = Details Form
  const [currentStep, setCurrentStep] = useState(1); 

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    category: '', 
    categoryColor: '', // Store color for UI themes
    experience: '',
    location: '',
    bio: '',
    cost: ''
  });

  // 🔄 1. FETCH CATEGORIES
  useEffect(() => {
    fetch('http://localhost:3000/users/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const handleCategorySelect = (category: any) => {
    setFormData({ 
      ...formData, 
      category: category.name,
      categoryColor: category.color 
    });
    // Automatically go to next step after selection
    setTimeout(() => setCurrentStep(2), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'PROVIDER',
          experience: Number(formData.experience)
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Signup failed');

      localStorage.setItem('token', data.access_token);
      onSignupComplete({ name: formData.fullName, category: formData.category });

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎨 STEP 1 UI: CATEGORY SELECTION CARDS
  const renderCategorySelection = () => (
    <div className="px-6 pb-12">
      <div className="text-center mb-6 mt-4">
        <h2 className="text-xl font-bold text-gray-800">Select Your Service Category</h2>
        <p className="text-gray-500 text-sm">Choose the service you want to provide</p>
      </div>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleCategorySelect(cat)}
            className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-95 ${
              formData.category === cat.name 
                ? 'border-[#FF9933] shadow-md ring-2 ring-[#FF9933]/20' 
                : 'border-transparent hover:border-gray-200 hover:shadow-md'
            }`}
          >
            {/* Colored Icon Box */}
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner shrink-0"
              style={{ backgroundColor: cat.color }} // Uses the Admin Color
            >
              <span className="text-3xl">{cat.emoji}</span>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
              <p className="text-gray-500 text-sm leading-tight">
                {cat.description || `Register as a professional ${cat.name}`}
              </p>
            </div>

            {/* Selection Checkmark */}
            {formData.category === cat.name && (
              <CheckCircle2 className="text-[#FF9933] w-6 h-6" />
            )}
          </motion.button>
        ))}

        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-10">
             <Loader2 className="animate-spin mx-auto mb-2" />
             Loading Services...
          </div>
        )}
      </div>
    </div>
  );

  // 📝 STEP 2 UI: REGISTRATION FORM
  const renderRegistrationForm = () => (
    <div className="px-6 pb-12 mt-4">
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100"
      >
        <div className="flex items-center gap-3 mb-6 p-3 bg-orange-50 rounded-xl border border-orange-100">
          <span className="text-2xl">
             {categories.find(c => c.name === formData.category)?.emoji || '✨'}
          </span>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Selected Role</p>
            <p className="font-bold text-gray-900">{formData.category}</p>
          </div>
          <button 
             onClick={() => setCurrentStep(1)}
             className="ml-auto text-xs text-[#FF9933] font-bold underline"
          >
            Change
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input placeholder="e.g. Santosh Maharaj" className="pl-10" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input placeholder="e.g. 9876543210" className="pl-10" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Create a password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Experience (Yrs)</Label>
              <div className="relative">
                 <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                 <Input type="number" placeholder="5" className="pl-10" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cost (approx)</Label>
              <Input placeholder="₹5000" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>City / Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input placeholder="e.g. Pune" className="pl-10" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>About You</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <Textarea placeholder="Tell us about your service..." className="pl-10" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-xl mt-4" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Register Account"}
          </Button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] p-6 pb-8 rounded-b-[2rem] shadow-xl sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-4 text-white">
           <button onClick={currentStep === 1 ? onBack : () => setCurrentStep(1)}>
             <ArrowLeft size={24} />
           </button>
           <span className="font-medium text-sm opacity-90">
             {currentStep === 1 ? "Step 1 of 3" : "Step 2 of 3"}
           </span>
        </div>
        <h1 className="text-2xl font-bold text-white">Provider Registration</h1>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/30 rounded-full mt-4 overflow-hidden">
           <motion.div 
             className="h-full bg-white"
             initial={{ width: "33%" }}
             animate={{ width: currentStep === 1 ? "33%" : "66%" }}
           />
        </div>
      </div>

      {/* RENDER THE CORRECT STEP */}
      {currentStep === 1 ? renderCategorySelection() : renderRegistrationForm()}

    </div>
  );
}