'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  'Tişört', 'Gömlek', 'Bluz', 'Kazak', 'Sweatshirt', 'Ceket',
  'Hırka', 'Yelek', 'Pantolon', 'Jean', 'Etek', 'Şort',
  'Tayt', 'Eşofman altı', 'Mont', 'Kaban', 'Trençkot',
  'Yağmurluk', 'Parka', 'Blazer', 'Deri ceket', 'Pijama takımı'
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-xl border-b-2 border-gray-200 relative">
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60"></div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="text-2xl font-bold text-black">
            CHICIFY
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/calendar" className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center space-x-1">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Takvim</span>
            </Link>

            <Link href="/profile-settings" className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center space-x-1">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profil</span>
            </Link>

            <Link href="/kombinler" className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-medium">
              Kombinler
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 