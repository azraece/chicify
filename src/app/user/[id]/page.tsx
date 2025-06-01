'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function UserProfile() {
  const params = useParams();
  const userId = params.id;

  // Demo kullanıcı verileri (gerçek uygulamada API'den gelecek)
  const users = {
    'user1': {
      name: "Ayşe Yılmaz",
      followers: 234,
      following: 189,
      combinations: [
        { id: 1, image: '/resimler/1.jpeg' },
        { id: 2, image: '/resimler/3.jpeg' },
        { id: 3, image: '/resimler/5.jpeg' }
      ]
    },
    'user2': {
      name: "Elif Demir",
      followers: 156,
      following: 243,
      combinations: [
        { id: 1, image: '/resimler/2.jpeg' },
        { id: 2, image: '/resimler/4.jpeg' },
        { id: 3, image: '/resimler/6.jpeg' }
      ]
    },
    'user3': {
      name: "Zeynep Kaya",
      followers: 89,
      following: 102,
      combinations: [
        { id: 1, image: '/resimler/7.jpeg' },
        { id: 2, image: '/resimler/8.jpeg' },
        { id: 3, image: '/resimler/9.jpeg' }
      ]
    },
    'user4': {
      name: "Merve Öztürk",
      followers: 298,
      following: 156,
      combinations: [
        { id: 1, image: '/resimler/10.jpeg' },
        { id: 2, image: '/resimler/11.jpeg' },
        { id: 3, image: '/resimler/12.jpeg' }
      ]
    },
    'user5': {
      name: "Selin Çelik",
      followers: 187,
      following: 203,
      combinations: [
        { id: 1, image: '/resimler/14.jpeg' },
        { id: 2, image: '/resimler/15.jpeg' },
        { id: 3, image: '/resimler/16.jpeg' }
      ]
    }
  };

  // Kullanıcı bulunamazsa varsayılan veri
  const userProfile = users[userId as keyof typeof users] || {
    name: "kişinin adı soyadı",
    followers: 156,
    following: 243,
    combinations: [
      { id: 1, image: '/resimler/1.jpeg' },
      { id: 2, image: '/resimler/2.jpeg' },
      { id: 3, image: '/resimler/3.jpeg' }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Sadece CHICIFY logosu */}
      <div className="w-full shadow-xl border-b-2 border-gray-200 relative mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-start">
            <Link href="/home" className="text-2xl font-bold text-black">
              CHICIFY
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol taraf - Kullanıcı bilgileri */}
          <div className="lg:col-span-1">
            {/* Kullanıcı Adı */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold">{userProfile.name}</h1>
            </div>

            {/* İstatistikler ve Follow Butonu */}
            <div className="flex items-center space-x-8 mb-12">
              <div className="flex space-x-16">
                <div className="text-left">
                  <div className="text-2xl font-bold">{userProfile.followers}</div>
                  <div className="text-gray-600">takipçi</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{userProfile.following}</div>
                  <div className="text-gray-600">takip</div>
                </div>
              </div>
              <button className="border-2 border-black bg-white px-6 py-2 rounded-full text-black font-medium hover:bg-gray-50 transition-colors">
                follow
              </button>
            </div>

            {/* Avatar Section */}
            <div>
              <h2 className="text-xl font-medium mb-4">avatar</h2>
              <div className="w-80 h-96 border-4 border-black rounded-3xl bg-white flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                  <p>Avatar burada görünecek</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ taraf - Kombinler */}
          <div className="lg:col-span-2">
            {/* Kombinler - daha aşağıda */}
            <div className="mt-16">
              <h3 className="text-xl font-medium mb-6">kombinler</h3>
              
              {/* Kombin kutucukları - profil settings gibi */}
              <div className="grid grid-cols-3 gap-4">
                {userProfile.combinations.map((combo) => (
                  <div
                    key={combo.id}
                    className="w-full aspect-[3/4] border-2 border-black rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden"
                  >
                    <img
                      src={combo.image}
                      alt={`Kombin ${combo.id}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 