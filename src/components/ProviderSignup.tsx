import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Upload, Mic, Music, Droplet, Lightbulb, Drum, Piano, Users, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface ProviderSignupProps {
  onSignupComplete: (name: string, category: string) => void;
  onBack: () => void;
}

const serviceCategories = [
  {
    id: 'kirtankar',
    name: 'Kirtankar',
    icon: Mic,
    color: '#FF9933',
    emoji: '🕉️',
    description: 'Lead devotional singing sessions',
  },
  {
    id: 'gayak',
    name: 'Gayak (Singer)',
    icon: Music,
    color: '#00AEEF',
    emoji: '🎤',
    description: 'Professional spiritual vocalist',
  },
  {
    id: 'achari',
    name: 'Achari (Pooja Expert)',
    icon: Droplet,
    color: '#800000',
    emoji: '🔱',
    description: 'Perform traditional poojas',
  },
  {
    id: 'lighting',
    name: 'Lighting / Mandap',
    icon: Lightbulb,
    color: '#FFD700',
    emoji: '💡',
    description: 'Event decoration & lighting',
  },
  {
    id: 'mrudung',
    name: 'Mrudung Vadak',
    icon: Drum,
    color: '#A0522D',
    emoji: '🥁',
    description: 'Traditional drum player',
  },
  {
    id: 'harmonium',
    name: 'Harmonium Player',
    icon: Piano,
    color: '#008080',
    emoji: '🎹',
    description: 'Harmonium accompaniment',
  },
  {
    id: 'bhajani',
    name: 'Bhajani Mandal',
    icon: Users,
    color: '#9932CC',
    emoji: '👥',
    description: 'Devotional music group',
  },
  {
    id: 'photographer',
    name: 'Photographer',
    icon: Camera,
    color: '#A9A9A9',
    emoji: '🎥',
    description: 'Event photography & videography',
  },
];

type Step = 1 | 2 | 3;

export default function ProviderSignup({ onSignupComplete, onBack }: ProviderSignupProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    experience: '',
    cost: '',
    bio: '',
  });

  const selectedCategoryData = serviceCategories.find(cat => cat.id === selectedCategory);

  const handleNext = () => {
    if (step === 1 && selectedCategory) {
      setStep(2);
    } else if (step === 2 && formData.name && formData.phone) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    onSignupComplete(formData.name, selectedCategory);
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div 
        className="rounded-b-[2rem] shadow-xl p-6 pb-8"
        style={{
          background: selectedCategoryData 
            ? `linear-gradient(135deg, ${selectedCategoryData.color}, ${selectedCategoryData.color}dd)`
            : 'linear-gradient(135deg, #FF9933, #FFD700)',
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={step === 1 ? onBack : () => setStep((step - 1) as Step)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Provider Registration</h2>
            <p className="text-white/90">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-gray-900 mb-2">Select Your Service Category</h3>
                <p className="text-gray-600">Choose the service you want to provide</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {serviceCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
                      selectedCategory === category.id
                        ? 'shadow-2xl scale-105'
                        : 'shadow-lg hover:shadow-xl'
                    }`}
                    style={{
                      background: selectedCategory === category.id
                        ? `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
                        : 'white',
                      border: `2px solid ${selectedCategory === category.id ? category.color : '#E5E7EB'}`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="text-3xl">{category.emoji}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{category.name}</h4>
                        <p className="text-gray-600">{category.description}</p>
                      </div>

                      {selectedCategory === category.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <Check className="text-white" size={20} />
                        </motion.div>
                      )}
                    </div>

                    {/* Orange accent line */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{
                        background: selectedCategory === category.id
                          ? `linear-gradient(90deg, ${category.color}, transparent)`
                          : 'transparent',
                      }}
                    />
                  </motion.button>
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!selectedCategory}
                className="w-full rounded-full h-12 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:opacity-90 text-white shadow-lg disabled:opacity-50"
              >
                Continue
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && selectedCategoryData && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: selectedCategoryData.color }}
                >
                  <span className="text-4xl">{selectedCategoryData.emoji}</span>
                </div>
                <h3 className="text-gray-900 mb-2">Your Details</h3>
                <p 
                  className="px-4 py-2 rounded-full inline-block"
                  style={{ 
                    backgroundColor: `${selectedCategoryData.color}20`,
                    color: selectedCategoryData.color,
                  }}
                >
                  {selectedCategoryData.name}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-2" style={{ borderColor: `${selectedCategoryData.color}40` }}>
                <div>
                  <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 mt-2"
                    style={{ 
                      borderColor: formData.name ? selectedCategoryData.color : undefined,
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="rounded-xl border-2 border-gray-200 mt-2"
                    style={{ 
                      borderColor: formData.phone ? selectedCategoryData.color : undefined,
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 mt-2"
                  />
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={!formData.name || !formData.phone}
                className="w-full rounded-full h-12 text-white shadow-lg disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${selectedCategoryData.color}, ${selectedCategoryData.color}dd)`,
                }}
              >
                Continue
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Professional Details */}
          {step === 3 && selectedCategoryData && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: selectedCategoryData.color }}
                >
                  <span className="text-4xl">{selectedCategoryData.emoji}</span>
                </div>
                <h3 className="text-gray-900 mb-2">Professional Information</h3>
                <p className="text-gray-600">Tell us about your expertise</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-2" style={{ borderColor: `${selectedCategoryData.color}40` }}>
                <div>
                  <Label htmlFor="experience" className="text-gray-700">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="cost" className="text-gray-700">Service Cost Range</Label>
                  <Input
                    id="cost"
                    type="text"
                    placeholder="e.g., ₹5,000 - ₹8,000"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-700">About You</Label>
                  <Textarea
                    id="bio"
                    placeholder="Describe your services and experience..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 mt-2 min-h-[100px]"
                  />
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: `${selectedCategoryData.color}10` }}>
                  <div className="flex items-start gap-3">
                    <Upload className="flex-shrink-0 mt-1" size={20} style={{ color: selectedCategoryData.color }} />
                    <div>
                      <p className="text-gray-900 mb-1">Upload Documents</p>
                      <p className="text-gray-600">
                        You can upload verification documents after registration
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FF9933]/10 to-[#FFD700]/10 rounded-2xl p-4 border-2 border-[#FF9933]/20">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-[#FF9933] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    Your profile will be reviewed by our team within 24-48 hours before going live
                  </p>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full rounded-full h-12 text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${selectedCategoryData.color}, ${selectedCategoryData.color}dd)`,
                }}
              >
                Complete Registration
                <Check className="ml-2" size={20} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
