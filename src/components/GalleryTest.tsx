import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
export default function GalleryTest() {
  const [images, setImages] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const providerId = searchParams.get('providerId'); // This gets it from the URL

  useEffect(() => {
    // 1. Fetch the data with a timestamp to kill the cache
    fetch(`http://localhost:3000/providers/${providerId}?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        console.log("🔍 Test Page Data:", data.galleryImages);
        setImages(data.galleryImages || []);
      });
  }, [providerId]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>📸 Raw Gallery Test ({images.length} images)</h1>
      <hr />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {images.map((url, index) => (
          <div key={index} style={{ border: '2px solid orange', padding: '5px', background: 'white' }}>
            <p style={{ fontSize: '10px' }}>Img #{index}</p>
            <img 
              src={url} 
              alt="test" 
              style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
              onError={(e) => {
                console.error("❌ FAILED TO LOAD:", url);
                e.currentTarget.style.border = "5px solid red";
              }}
            />
            <code style={{ fontSize: '8px', wordBreak: 'break-all' }}>{url}</code>
          </div>
        ))}
      </div>

      {images.length === 0 && <p>No images found in database yet.</p>}
    </div>
  );
}