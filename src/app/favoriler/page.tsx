'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Favoriler() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const allCategories = [
    'Tişört', 'Gömlek', 'Bluz', 'Kazak', 'Sweatshirt', 'Ceket',
    'Hırka', 'Yelek', 'Pantolon', 'Jean', 'Etek', 'Şort',
    'Tayt', 'Eşofman altı', 'Mont', 'Kaban', 'Trençkot',
    'Yağmurluk', 'Parka', 'Blazer', 'Deri ceket', 'Pijama takımı'
  ];

  // 4 adet boş kutucuk
  const favoriteItems = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1
  }));

  const handleCategoryClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        {/* Favorilerim başlığı */}
        <h1 className="text-2xl font-semibold mb-8">favorilerim</h1>
        
        {/* 4 kutucuk yan yana */}
        <div className="grid grid-cols-4 gap-4">
          {favoriteItems.map((item) => (
            <div
              key={item.id}
              className="w-full aspect-[3/4] border-2 border-black rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Boş kutucuk - favori içerikleri eklenebilir */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 