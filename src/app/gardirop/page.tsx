'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Gardirop() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleBoxes, setVisibleBoxes] = useState(8);
  const [clothingImages, setClothingImages] = useState<{[key: number]: string}>({});
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);
  
  // File input referansı
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allCategories = [
    'Tişört', 'Gömlek', 'Bluz', 'Kazak', 'Sweatshirt', 'Ceket',
    'Hırka', 'Yelek', 'Pantolon', 'Jean', 'Etek', 'Şort',
    'Tayt', 'Eşofman altı', 'Mont', 'Kaban', 'Trençkot',
    'Yağmurluk', 'Parka', 'Blazer', 'Deri ceket', 'Pijama takımı'
  ];

  // Maksimum kutucuk sayısı (örnek: 16 kutucuk - 4x4)
  const maxBoxes = 16;

  // Component mount olduğunda localStorage'dan resimleri yükle
  useEffect(() => {
    const savedImages = localStorage.getItem('gardirop-clothing-images');
    if (savedImages) {
      try {
        setClothingImages(JSON.parse(savedImages));
      } catch (error) {
        console.error('Kaydedilmiş resimleri yüklerken hata:', error);
      }
    }
  }, []);

  // Resimleri localStorage'a kaydet
  const saveImagesToStorage = (images: {[key: number]: string}) => {
    localStorage.setItem('gardirop-clothing-images', JSON.stringify(images));
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Belirli bir kutucuk için dosya seçme fonksiyonu
  const handleAddClothing = (clothingId: number) => {
    setActiveUploadId(clothingId);
    fileInputRef.current?.click();
  };

  // Yeni kutucuk ekleme fonksiyonu
  const handleAddNewBox = () => {
    if (visibleBoxes < maxBoxes) {
      setVisibleBoxes(visibleBoxes + 1); // Her seferinde 1 kutucuk ekle
    }
  };

  // Dosya seçildiğinde çalışacak fonksiyon
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeUploadId !== null) {
      // Dosyayı base64'e çevir
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        
        // Yeni resim state'ini güncelle
        const newClothingImages = {
          ...clothingImages,
          [activeUploadId]: base64String
        };
        
        setClothingImages(newClothingImages);
        saveImagesToStorage(newClothingImages);
        setActiveUploadId(null);
      };
      
      reader.readAsDataURL(file);
    }
    
    // Input'u temizle
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Resmi silme fonksiyonu
  const handleRemoveImage = (clothingId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Butona tıklamayı engelle
    
    const newClothingImages = { ...clothingImages };
    delete newClothingImages[clothingId];
    
    setClothingImages(newClothingImages);
    saveImagesToStorage(newClothingImages);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Full width */}
      <div className="w-full shadow-xl border-b-2 border-gray-200 relative mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/home" className="text-2xl font-bold text-black">
              CHICIFY
            </Link>
            <div className="flex items-center space-x-2 relative">
              <button 
                onClick={handleCategoryClick}
                className="flex items-center space-x-2 hover:text-red-600 transition-colors"
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-lg font-medium">kategoriler</span>
              </button>
              
              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-700 p-2 border-b">Kategoriler</div>
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        onClick={() => {
                          console.log('Kategori seçildi:', category);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        {/* Gardırop başlığı */}
        <h1 className="text-2xl font-semibold mb-8">gardırop</h1>
        
        {/* Gizli file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {/* 4x2 Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Array.from({ length: visibleBoxes }, (_, index) => {
            const clothingId = index + 1;
            const hasImage = clothingImages[clothingId];
            
            return (
              <div key={clothingId} className="relative group">
                <button
                  onClick={() => handleAddClothing(clothingId)}
                  className="w-full aspect-[3/4] border-2 border-black rounded-lg bg-white flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden p-2"
                >
                  {hasImage ? (
                    <img
                      src={hasImage}
                      alt={`Kıyafet ${clothingId}`}
                      className="w-full h-full object-contain rounded"
                    />
                  ) : (
                    <>
                      {/* Yuvarlak artı sembolu */}
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">kıyafet ekle</p>
                    </>
                  )}
                </button>
                
                {/* Resim varsa silme butonu */}
                {hasImage && (
                  <button
                    onClick={(e) => handleRemoveImage(clothingId, e)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Kombin Paylaş Butonu */}
        <div className="flex justify-end items-center space-x-4">
          {/* Dinamik Artı Sembolü - sadece maksimum sayıya ulaşılmadıysa göster */}
          {visibleBoxes < maxBoxes && (
            <button 
              onClick={handleAddNewBox}
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          
          <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            kombin paylaş
          </button>
        </div>
      </div>
    </div>
  );
} 