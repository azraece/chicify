'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Outfit {
  id: string;
  name: string;
  image: string;
  description?: string;
  isUserPhoto?: boolean;
}

export default function DailyOutfit() {
  const params = useParams();
  const router = useRouter();
  const [savedOutfit, setSavedOutfit] = useState<Outfit | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL'den tarihi al
  const dateString = params.date as string;
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  });

  // Sayfa yüklendiğinde kaydedilmiş kombini kontrol et
  useEffect(() => {
    const savedOutfits = localStorage.getItem('daily-outfits');
    if (savedOutfits) {
      try {
        const outfitsData = JSON.parse(savedOutfits);
        if (outfitsData[dateString]) {
          setSavedOutfit(outfitsData[dateString]);
        }
      } catch (error) {
        console.error('Kaydedilmiş kombinler yüklenirken hata:', error);
      }
    }
  }, [dateString]);

  // Resim yükleme fonksiyonu
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        setUploadedImage(base64Image);
        
        const userOutfit: Outfit = {
          id: 'user-upload',
          name: 'Benim Kombinom',
          image: base64Image,
          description: 'Kendi yüklediğim kombin fotoğrafı',
          isUserPhoto: true
        };
        
        // Direkt kaydet
        saveOutfit(userOutfit);
      };
      reader.readAsDataURL(file);
    }
  };

  // Kombin kaydetme fonksiyonu
  const saveOutfit = (outfit: Outfit) => {
    const savedOutfits = localStorage.getItem('daily-outfits');
    let outfitsData = {};
    
    if (savedOutfits) {
      try {
        outfitsData = JSON.parse(savedOutfits);
      } catch (error) {
        console.error('Kombinler parse edilirken hata:', error);
      }
    }

    outfitsData[dateString] = outfit;
    localStorage.setItem('daily-outfits', JSON.stringify(outfitsData));
    setSavedOutfit(outfit);
    setShowImageUpload(false);
    setUploadedImage(null);
  };

  // Dosya seçimi tetikle
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 relative overflow-hidden pt-16">
        {/* Arka plan dalgalı çizgiler */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Dalgalı çizgiler */}
            <path d="M0 200C300 150 600 250 900 200C1000 180 1100 220 1200 200V0H0V200Z" stroke="#d1d5db" strokeWidth="2" fill="none"/>
            <path d="M0 300C200 280 400 320 600 300C800 280 1000 320 1200 300V100H0V300Z" stroke="#d1d5db" strokeWidth="2" fill="none"/>
            <path d="M0 400C300 380 600 420 900 400C1000 390 1100 410 1200 400V200H0V400Z" stroke="#d1d5db" strokeWidth="2" fill="none"/>
            <path d="M0 500C200 480 400 520 600 500C800 480 1000 520 1200 500V300H0V500Z" stroke="#d1d5db" strokeWidth="2" fill="none"/>
            <path d="M0 600C300 580 600 620 900 600C1000 590 1100 610 1200 600V400H0V600Z" stroke="#d1d5db" strokeWidth="2" fill="none"/>
            <path d="M0 700C200 680 400 720 600 700C800 680 1000 720 1200 700V500H0V700Z" stroke="#d1d5db" strokeWidth="2" fill="none"/>
            <path d="M0 800C300 780 600 820 900 800V600H0V800Z" stroke="#d1d5db" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* Gizli dosya input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8">
          {savedOutfit ? (
            /* Kaydedilmiş kombin varsa göster */
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-12">
                Bugün ne giyeceksin?
              </h1>
              
              <div className="bg-white border-4 border-gray-800 rounded-lg p-12 max-w-md mx-auto shadow-lg">
                {savedOutfit.isUserPhoto && savedOutfit.image ? (
                  <div className="w-full h-64 rounded-lg overflow-hidden mb-6">
                    <img 
                      src={savedOutfit.image} 
                      alt={savedOutfit.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl">👕</span>
                  </div>
                )}
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {savedOutfit.name}
                </h2>
                
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={triggerFileSelect}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Değiştir
                  </button>
                  <button
                    onClick={() => {
                      const savedOutfits = localStorage.getItem('daily-outfits');
                      if (savedOutfits) {
                        try {
                          const outfitsData = JSON.parse(savedOutfits);
                          delete outfitsData[dateString];
                          localStorage.setItem('daily-outfits', JSON.stringify(outfitsData));
                          setSavedOutfit(null);
                        } catch (error) {
                          console.error('Kombin silinirken hata:', error);
                        }
                      }
                    }}
                    className="border-2 border-gray-800 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-medium"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Kombin yoksa ana tasarım */
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-16">
                Bugün ne giyeceksin?
              </h1>
              
              <div className="bg-white border-4 border-gray-800 rounded-lg w-80 h-96 flex flex-col items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                   onClick={triggerFileSelect}>
                <div className="text-3xl font-bold text-gray-800">
                  kombin ekle
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 