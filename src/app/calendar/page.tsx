'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [savedOutfits, setSavedOutfits] = useState<{[key: string]: any}>({});

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const days = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  // Kaydedilmiş kombinleri yükle
  useEffect(() => {
    const loadSavedOutfits = () => {
      const saved = localStorage.getItem('daily-outfits');
      if (saved) {
        try {
          setSavedOutfits(JSON.parse(saved));
        } catch (error) {
          console.error('Kombinler yüklenirken hata:', error);
        }
      }
    };

    loadSavedOutfits();
    
    // Storage değişikliklerini dinle
    const handleStorageChange = () => {
      loadSavedOutfits();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Component focus aldığında da kontrol et
    window.addEventListener('focus', loadSavedOutfits);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadSavedOutfits);
    };
  }, []);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Tarih string'i oluştur
  const getDateString = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  // Gün için kombin var mı kontrol et
  const hasOutfit = (day: number) => {
    const dateString = getDateString(day);
    return savedOutfits[dateString];
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-16 p-8">
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={previousMonth}
                className="text-gray-600 hover:text-gray-800 text-4xl font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                &#8592;
              </button>
              <h2 className="text-3xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="text-gray-600 hover:text-gray-800 text-4xl font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                &#8594;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-3 mb-6">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center text-lg font-bold text-gray-700 py-3"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateString = getDateString(day);
                const outfit = hasOutfit(day);
                
                return (
                  <Link
                    key={day}
                    href={`/calendar/${dateString}`}
                    className="h-24 flex flex-col items-center justify-center border-2 rounded-xl hover:bg-gray-100 cursor-pointer text-lg font-medium transition-all hover:shadow-md hover:scale-105 relative overflow-hidden"
                  >
                    {/* Arka plan resmi */}
                    {outfit && outfit.isUserPhoto && outfit.image && (
                      <div className="absolute inset-0 opacity-30">
                        <img 
                          src={outfit.image} 
                          alt="Kombin"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Gün numarası */}
                    <span className={`text-lg font-medium relative z-10 ${outfit ? 'text-gray-800' : 'text-gray-600'}`}>
                      {day}
                    </span>
                    
                    {/* Kombin indikatorü */}
                    {outfit && !outfit.isUserPhoto && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-xs text-white">👕</span>
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Açıklama */}
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span>Bir güne tıklayarak kombin ekleyebilirsin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 