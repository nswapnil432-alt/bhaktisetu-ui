import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Save, User, MapPin, DollarSign, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EditProviderProfile() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem('providerId') || localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    basePrice: '',
    experience: '',
    address: '',
    bio: ''
  });

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    if (!providerId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/providers/${providerId}`);
        const data = await res.json();
        
        if (res.ok) {
          const profile = data.providerProfile || {};
          setFormData({
            fullName: data.user?.fullName || data.fullName || '',
            basePrice: profile.basePrice?.toString() || '',
            experience: profile.experience?.toString() || '',
            address: data.address || profile.address || '',
            bio: profile.bio || ''
          });
          
          // 🖼️ THE ONLY FIX: Look in data.profileImage just like we did on the Dashboard!
          setImagePreview(data.profileImage || profile.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [providerId]);

  // 2. Handle Text Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Image Selection & Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Creates a temporary local URL to show the user
    }
  };

  // 4. Save Data to Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Step A: Send the normal text data to your main window (/:id)
      const textRes = await fetch(`http://localhost:3000/providers/${providerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          basePrice: Number(formData.basePrice),
          experience: Number(formData.experience),
          address: formData.address,
          bio: formData.bio
        })
      });

      // Step B: If the user picked a photo, send it to your special photo window (/:id/photo)
      if (selectedFile) {
        const imageData = new FormData();
        // Notice we are calling it 'file' here, exactly as your backend requested!
        imageData.append('file', selectedFile); 

        await fetch(`http://localhost:3000/providers/${providerId}/photo`, {
          method: 'PATCH',
          body: imageData
        });
      }

      if (textRes.ok) {
        alert("Profile updated successfully! 🙏");
        navigate('/provider-dashboard'); // Go back to dashboard
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500 font-bold">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pb-10">
      {/* Header */}
      <div className="bg-[#FF9933] p-5 pt-8 text-white flex items-center gap-4 shadow-md rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-5 mt-6 space-y-6 max-w-md mx-auto">
        
        {/* Image Upload Section */}
        <div className="flex flex-col items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-[#FF9933] flex items-center justify-center overflow-hidden mb-3">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-gray-300" />
            )}
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><Upload size={14}/> Tap image to upload new photo</p>
        </div>

        {/* Form Fields */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><User size={14}/> Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF9933]" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><DollarSign size={14}/> Base Cost (₹)</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF9933]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Clock size={14}/> Experience (Yrs)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF9933]"  />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><MapPin size={14}/> Address / City</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF9933]"/>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><FileText size={14}/> Short Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF9933] resize-none" placeholder="Tell devotees about your service..."></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={saving} className="w-full bg-[#FF9933] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-[#E68A2E] active:scale-95 transition-all flex justify-center items-center gap-2">
          {saving ? 'Saving updates...' : <><Save size={20} /> Save Profile</>}
        </button>

      </form>
    </div>
  );
}