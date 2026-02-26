import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Film, Plus, X, Trash2, Loader2, Play } from 'lucide-react';
import { Button } from './ui/button';

interface GalleryManagerProps {
    providerId: string;
    existingImages: string[];
    existingVideos: string[];
    onUpdate: () => void;
}

export default function GalleryManager({ providerId, existingImages, existingVideos, onUpdate }: GalleryManagerProps) {
    const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
const [viewingMedia, setViewingMedia] = useState<string | null>(null);    
const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Smart URL Fixer - Ensures we don't double the localhost prefix
    const getMediaUrl = (path: string) => {
        if (!path) return "";

        // 🚨 Check if the database already gave us a full link
        if (path.startsWith('http')) {
            return path; // Return it exactly as it is
        }

        // 🏠 If it's just a filename (e.g., "gallery-123.jpg"), add the prefix
        return `http://localhost:3000/uploads/${path}`;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            console.log("📂 Files selected:", files); // 🕵️‍♂️ Debugging log
            const validFiles = files.filter(file => {
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
                if (activeTab === 'photos' && !isImage) return false;
                if (activeTab === 'videos' && !isVideo) return false;

                const sizeLimit = activeTab === 'photos' ? 10 * 1024 * 1024 : 250 * 1024 * 1024;
                if (file.size > sizeLimit) {
                    alert(`File ${file.name} is too large! Limit is ${activeTab === 'photos' ? '10MB' : '100MB'}.`);
                    return false;
                }
                return true;
            });
            if (validFiles.length > 0) {
                setSelectedFiles(prev => [...prev, ...validFiles]);
                const newPreviews = validFiles.map(file => URL.createObjectURL(file));
                setPreviews(prev => [...previews, ...newPreviews]);
            }

            setSelectedFiles(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeSelected = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (selectedFiles.length === 0 || isUploading) return;
 try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('type', activeTab);
        selectedFiles.forEach((file) => formData.append('files', file));

       
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/providers/${providerId}/gallery`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Upload Successful!");
                setSelectedFiles([]);
                setPreviews([]);
                onUpdate(); // Triggers the parent re-fetch
            } else {
                alert(`❌ Failed: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("🔴 UPLOAD ERROR:", error);
            alert("Network Error. Check console.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (imageUrl: string) => {
        if (!window.confirm("Are you sure you want to delete this photo?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/providers/${providerId}/gallery/delete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl }),
            });

            if (response.ok) {
                onUpdate(); // 🔥 This refreshes the parent state and removes the image from the grid!
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ImageIcon className="text-[#FF9933]" /> Media Gallery
            </h3>

            {/* Tab Switching */}
            <div className="flex gap-4 mb-6 border-b border-gray-100 pb-2">
                <button
                    type="button"
                    onClick={() => { setActiveTab('photos'); setSelectedFiles([]); setPreviews([]); }}
                    className={`pb-2 px-4 text-sm font-semibold transition-colors ${activeTab === 'photos' ? 'text-[#FF9933] border-b-2 border-[#FF9933]' : 'text-gray-400'}`}
                >
                    Photos ({existingImages.length})
                </button>
                <button
                    type="button"
                    onClick={() => { setActiveTab('videos'); setSelectedFiles([]); setPreviews([]); }}
                    className={`pb-2 px-4 text-sm font-semibold transition-colors ${activeTab === 'videos' ? 'text-[#FF9933] border-b-2 border-[#FF9933]' : 'text-gray-400'}`}
                >
                    Videos ({existingVideos.length})
                </button>
            </div>

            {/* Selection Area */}
            <div className="mb-8">
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept={activeTab === 'photos' ? "image/*" : "video/*"}
                    onChange={handleFileSelect}
                />

                <div className="flex gap-3">
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-dashed border-2 border-gray-300 hover:border-[#FF9933] text-gray-600"
                    >
                        <Plus size={18} className="mr-2" /> Add {activeTab === 'photos' ? 'Photos' : 'Videos'}
                    </Button>

                    {selectedFiles.length > 0 && (
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="bg-[#FF9933] hover:bg-[#FF8800] text-white"
                        >
                            {isUploading ? <Loader2 className="animate-spin mr-2" /> : `Upload ${selectedFiles.length} Files`}
                        </Button>
                    )}
                </div>

                {/* Local Previews */}
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                    <AnimatePresence>
                        {previews.map((src, index) => (
                            <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden group">
                                {activeTab === 'photos' ? <img src={src} className="w-full h-full object-cover" /> : <video src={src} className="w-full h-full object-cover" />}
                                <button type="button" onClick={() => removeSelected(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={12} /></button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Existing Gallery Display */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {activeTab === 'photos' ? (
    // 📸 PHOTO GRID
    existingImages.map((url, i) => (
      <div key={i} 
      onClick={() => setViewingMedia(url)}
      className="aspect-square rounded-xl overflow-hidden border">
        <img src={url} className="w-full h-full object-cover" alt="Gallery" />
      </div>
    ))
  ) : (
    // 🎥 VIDEO GRID
    existingVideos.map((url, i) => (
      <div key={i}
      onClick={() => setViewingMedia(url)}
      className="aspect-square rounded-xl overflow-hidden border bg-black relative">
        <video 
          src={url} 
          className="w-full h-full object-cover"
          controls={false} // Hide controls in grid view
        />
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
           <div className="bg-white/30 p-3 rounded-full">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
           </div>
        </div>
      </div>
    ))
  )}

</div>
{selectedMedia && (
  <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-5">
    {/* Close Button */}
    <button 
      onClick={() => setSelectedMedia(null)}
      className="absolute top-10 right-10 text-white bg-white/20 p-3 rounded-full hover:bg-white/40"
    >
      ✕ Close
    </button>

    <div className="max-w-4xl w-full flex justify-center">
      {selectedMedia.endsWith('.mp4') || selectedMedia.endsWith('.mov') ? (
        <video 
          src={selectedMedia} 
          controls 
          autoPlay 
          className="max-h-[80vh] rounded-2xl shadow-2xl"
        />
      ) : (
        <img 
          src={selectedMedia} 
          className="max-h-[80vh] rounded-2xl shadow-2xl object-contain" 
          alt="Full view" 
        />
      )}
    </div>
  </div>
)}
{/* 🎥 THE POP-UP MODAL */}
{viewingMedia && (
  <div 
    // 1. Click the black background to QUIT
    onClick={() => setViewingMedia(null)} 
    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
  >
    {/* 2. Visible Close Button */}
    <button 
      onClick={(e) => {
        e.stopPropagation(); // Prevents double-triggering
        setViewingMedia(null);
      }}
      className="absolute top-8 right-8 text-white text-5xl font-thin hover:text-[#FF9933] transition-colors z-[10000]"
    >
      &times;
    </button>
    
    <div 
      className="max-w-5xl w-full flex justify-center items-center"
      onClick={(e) => e.stopPropagation()} // 🚨 IMPORTANT: Prevents quitting if you click the video itself
    >
      {viewingMedia.toLowerCase().endsWith('.mp4') ? (
        <video 
          src={viewingMedia} 
          controls 
          autoPlay 
          className="max-h-[80vh] w-auto rounded-lg shadow-2xl border border-white/10" 
        />
      ) : (
        <img 
          src={viewingMedia} 
          className="max-h-[80vh] w-auto rounded-lg shadow-2xl object-contain" 
          alt="Full view"
        />
      )}
    </div>
  </div>
)}
        </div>
    );
}