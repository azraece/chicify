'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

export default function ProfileSettings() {
  // Demo veriler
  const stats = {
    followers: 156,
    following: 243
  };

  // Kullanıcı bilgileri - gerçek uygulamada auth context'ten gelecek
  const userInfo = {
    name: "Azra Ece", // Bu gerçek kullanıcı verilerinden gelecek
    email: "azraece@example.com"
  };

  // Maksimum 6 kutucuk
  const maxOutfits = [
    { id: 1, image: '/outfit-placeholder.jpg' },
    { id: 2, image: '/outfit-placeholder.jpg' },
    { id: 3, image: '/outfit-placeholder.jpg' },
    { id: 4, image: '/outfit-placeholder.jpg' },
    { id: 5, image: '/outfit-placeholder.jpg' },
    { id: 6, image: '/outfit-placeholder.jpg' }
  ];

  // Görünür olan kutucuk sayısı (başlangıçta 6)
  const [visibleOutfits, setVisibleOutfits] = useState(6);

  // File input referansı
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dosya seçme fonksiyonu
  const handleAddOutfit = () => {
    fileInputRef.current?.click();
  };

  // Yeni kutucuk ekleme fonksiyonu
  const handleAddNewBox = () => {
    if (visibleOutfits < maxOutfits.length) {
      setVisibleOutfits(visibleOutfits + 1);
    }
  };

  // Dosya seçildiğinde çalışacak fonksiyon
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Burada dosya işleme mantığını ekleyebilirsiniz
      console.log('Seçilen dosya:', file.name);
      // Örnek: resmi preview gösterme, sunucuya yükleme vb.
    }
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
            <div className="flex items-center space-x-4">
              <Link href="/gardirop" className="text-lg font-medium hover:text-red-600 transition-colors">gardırop</Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center">
                  <span className="text-black text-xs font-bold">AI</span>
                </div>
                <span className="text-lg font-medium">chicify ai</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol taraf - Avatar */}
          <div className="lg:col-span-1">
            <div className="text-left mb-6 mt-4">
              {/* Kullanıcı Adı */}
              <h1 className="text-2xl font-semibold mb-2">{userInfo.name}</h1>
              
              <h2 className="text-xl font-medium mb-4">avatar</h2>
              
              {/* Avatar Container */}
              <div className="w-80 h-96 border-4 border-black rounded-3xl bg-white flex items-center justify-center mb-6">
                <div className="text-gray-400 text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                  <p>Avatar burada görünecek</p>
                </div>
              </div>

              {/* Avatar Düzenle Butonu */}
              <Link href="/profile/avatar" className="inline-block border-2 border-black bg-white px-6 py-2 rounded-full text-black font-medium hover:bg-gray-50 transition-colors">
                avatarı düzenle
              </Link>
              
              {/* Dinamik Artı Sembolü */}
              {visibleOutfits < maxOutfits.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleAddNewBox}
                    className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sağ taraf - İstatistikler ve Kombinler */}
          <div className="lg:col-span-2">
            {/* İstatistikler */}
            <div className="flex items-center space-x-8 mb-8">
              <div className="flex space-x-12">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.followers}</div>
                  <div className="text-gray-600">takipçi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.following}</div>
                  <div className="text-gray-600">takip</div>
                </div>
              </div>

              {/* Favoriler Butonu */}
              <Link href="/favoriler" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">favoriler</span>
              </Link>
            </div>

            {/* Kombinlerim */}
            <div>
              <h3 className="text-xl font-medium mb-6">kombinlerim</h3>
              
              {/* Gizli file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                multiple
              />
              
              <div className="relative">
                {/* Kombin kutucukları - 2 satır 3 sütun */}
                <div className="grid grid-cols-3 gap-4">
                  {maxOutfits.slice(0, visibleOutfits).map((outfit, index) => (
                    <button
                      key={outfit.id}
                      onClick={handleAddOutfit}
                      className="w-full aspect-[3/4] border-2 border-black rounded-lg bg-white flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {/* Yuvarlak artı sembolu */}
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">kombin ekle</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 