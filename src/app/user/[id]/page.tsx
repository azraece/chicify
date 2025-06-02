'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFollow } from '@/hooks/useFollow';

interface UserData {
  _id: string;
  name: string;
  username: string;
  followersCount: number;
  followingCount: number;
  profileImage?: string;
  createdAt: string;
}

export default function UserProfile() {
  const params = useParams();
  const userId = params.id as string;
  
  // State for user data
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Demo: Gerçek uygulamada bu auth context'ten gelecek
  const currentUserId = "675c8b5e123456789012a567"; // Mevcut kullanıcının ID'si

  // Demo kombinler (gerçek uygulamada da API'den gelecek)
  const demoData = {
    'user1': { combinations: [{ id: 1, image: '/resimler/1.jpeg' }, { id: 2, image: '/resimler/3.jpeg' }, { id: 3, image: '/resimler/5.jpeg' }] },
    'user2': { combinations: [{ id: 1, image: '/resimler/2.jpeg' }, { id: 2, image: '/resimler/4.jpeg' }, { id: 3, image: '/resimler/6.jpeg' }] },
    'user3': { combinations: [{ id: 1, image: '/resimler/7.jpeg' }, { id: 2, image: '/resimler/8.jpeg' }, { id: 3, image: '/resimler/9.jpeg' }] },
    'user4': { combinations: [{ id: 1, image: '/resimler/10.jpeg' }, { id: 2, image: '/resimler/11.jpeg' }, { id: 3, image: '/resimler/12.jpeg' }] },
    'user5': { combinations: [{ id: 1, image: '/resimler/14.jpeg' }, { id: 2, image: '/resimler/15.jpeg' }, { id: 3, image: '/resimler/16.jpeg' }] }
  };

  // User ID'yi gerçek ObjectId'ye map etme
  const userIdMapping = {
    'user1': '675c8b5e123456789012a568',
    'user2': '675c8b5e123456789012a569',
    'user3': '675c8b5e123456789012a570',
    'user4': '675c8b5e123456789012a571',
    'user5': '675c8b5e123456789012a572'
  };

  const realUserId = userIdMapping[userId as keyof typeof userIdMapping] || userId;

  // Kullanıcı verilerini MongoDB'den çek
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${realUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        } else {
          setError('Kullanıcı bulunamadı');
        }
      } else {
        setError('Kullanıcı verileri alınamadı');
      }
    } catch (err) {
      console.error('Kullanıcı veri çekme hatası:', err);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Follow hook'unu gerçek ObjectId ile kullan - callback ile takipçi sayılarını yenile
  const { isFollowing, isLoading: followLoading, error: followError, toggleFollow } = useFollow(
    currentUserId, 
    realUserId,
    fetchUserData // Takip işleminden sonra kullanıcı verilerini yenile
  );

  useEffect(() => {
    if (realUserId) {
      fetchUserData();
    }
  }, [realUserId]);

  // Follow buton metni ve stili
  const getFollowButtonProps = () => {
    if (followLoading) {
      return {
        text: 'Yükleniyor...',
        className: 'border-2 border-gray-400 bg-gray-100 px-6 py-2 rounded-full text-gray-500 font-medium cursor-not-allowed',
        disabled: true
      };
    }

    if (isFollowing) {
      return {
        text: 'Takip Ediliyor',
        className: 'border-2 border-green-500 bg-green-500 px-6 py-2 rounded-full text-white font-medium hover:bg-green-600 transition-colors',
        disabled: false
      };
    }

    return {
      text: 'Takip Et',
      className: 'border-2 border-black bg-white px-6 py-2 rounded-full text-black font-medium hover:bg-gray-50 transition-colors',
      disabled: false
    };
  };

  const buttonProps = getFollowButtonProps();
  const combinations = demoData[userId as keyof typeof demoData]?.combinations || [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Yükleniyor...</div>
          <div className="text-gray-600">Kullanıcı bilgileri getiriliyor</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2 text-red-600">Hata</div>
          <div className="text-gray-600">{error || 'Kullanıcı bulunamadı'}</div>
          <Link href="/home" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-semibold">{userData.name}</h1>
              <p className="text-gray-600">@{userData.username}</p>
            </div>

            {/* İstatistikler ve Follow Butonu */}
            <div className="flex items-center space-x-8 mb-12">
              <div className="flex space-x-16">
                <div className="text-left">
                  <div className="text-2xl font-bold">{userData.followersCount}</div>
                  <div className="text-gray-600">takipçi</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{userData.followingCount}</div>
                  <div className="text-gray-600">takip</div>
                </div>
              </div>
              
              {/* MongoDB destekli Follow Butonu */}
              <button 
                onClick={toggleFollow}
                disabled={buttonProps.disabled}
                className={buttonProps.className}
              >
                {buttonProps.text}
              </button>
            </div>

            {/* Error mesajı */}
            {followError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {followError}
              </div>
            )}

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
                {combinations.map((combo) => (
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