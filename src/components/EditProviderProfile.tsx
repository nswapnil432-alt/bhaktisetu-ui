import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Save, User, MapPin, DollarSign, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GalleryManager from './GalleryManager';

export default function EditProviderProfile() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem('providerId') || localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 1. Form State
  const [formData, setFormData] = useState({
    fullName: '',
    basePrice: '',
    experience: '',
    address: '',
    bio: '',
    galleryImages: [] as string[], // Store images here
    galleryVideos: [] as string[]   // Store videos here
  });

  // 2. Fetch Function (Shared for initial load and updates)
  const fetchProfile = async () => {
    if (!providerId) return;
    try {
      // Add timestamp to prevent the 304 Cache issue we saw!
      const res = await fetch(`http://localhost:3000/providers/${providerId}?t=${Date.now()}`);
      const data = await res.json();

      if (res.ok) {
        // Handle different data structures safely
        const profileData = data.providerProfile || data || {};
        
        setFormData({
          fullName: data.user?.fullName || data.fullName || '',
          basePrice: profileData.basePrice?.toString() || '',
          experience: profileData.experience?.toString() || '',
          address: data.address || profileData.address || '',
          bio: profileData.bio || '',
          // ✅ FIX: Map the actual gallery data from the server
          galleryImages: data.galleryImages || profileData.galleryImages || [],
          galleryVideos: data.galleryVideos || profileData.galleryVideos || []
        });

        setImagePreview(data.profileImage || profileData.profileImage || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [providerId]);

  // 3. Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update Text Data
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

      // Update Profile Photo if selected
      if (selectedFile) {
        const imageData = new FormData();
        imageData.append('file', selectedFile);
        await fetch(`http://localhost:3000/providers/${providerId}/photo`, {
          method: 'PATCH',
          body: imageData
        });
      }

      if (textRes.ok) {
        alert("Profile updated successfully! 🙏");
        navigate('/provider-dashboard');
      }
    } catch (error) {
      alert("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500 font-bold">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-10">
      <div className="bg-[#FF9933] p-5 pt-8 text-white flex items-center gap-4 shadow-md rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      <div className="px-5 mt-6 space-y-6 max-w-md mx-auto">
        {/* Profile Image */}
        <div className="flex flex-col items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-[#FF9933] flex items-center justify-center overflow-hidden mb-3">
            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" /> : <User size={40} className="text-gray-300" />}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Tap image to change</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><User size={14} /> Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><DollarSign size={14}/> Cost</label>
                 <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Clock size={14}/> Yrs</label>
                 <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
               </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><MapPin size={14}/> Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FileText size={14}/> Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-[#FF9933] text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2">
            {saving ? 'Saving...' : <><Save size={20} /> Save Profile Details</>}
          </button>
        </form>

        {/* 📸 GALLERY MANAGER SECTION */}
        <div className="mt-4">
           <GalleryManager
             providerId={providerId!}
             existingImages={formData.galleryImages}
             existingVideos={formData.galleryVideos}
             onUpdate={fetchProfile} // 🔥 Updates state WITHOUT page reload!
           />
        </div>
      </div>
    </div>
  );
}