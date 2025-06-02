'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  profileImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function MyProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token geçersiz veya yok, login sayfasına yönlendir
            router.push('/login');
            return;
          }
          throw new Error('Profil bilgileri alınamadı');
        }
        
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          throw new Error('Profil verileri alınamadı');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h1 className="text-xl font-semibold mb-2">Hata</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Kullanıcı bulunamadı</h1>
          <Link href="/login" className="text-blue-600 hover:underline">
            Giriş yapmak için tıklayın
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full shadow-xl border-b-2 border-gray-200 relative mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/home" className="text-2xl font-bold text-black">
              CHICIFY
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/profile-ssr" className="text-lg font-medium hover:text-red-600 transition-colors">
                SSR Profile
              </Link>
              <Link href="/profile-settings" className="text-lg font-medium hover:text-red-600 transition-colors">
                Ayarlar
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* CSR Badge */}
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-800 font-medium">Client-Side Rendered Profile</span>
              <span className="text-blue-600 text-sm">(Interactive with loading states)</span>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-start space-x-6">
              {/* Profile Image */}
              <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-3xl font-bold text-black">{user.name}</h1>
                  <div className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm rounded-full">
                    Fashion Influencer
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg mb-2">@{user.username}</p>
                <p className="text-gray-500 mb-3">{user.email}</p>
                
                {user.bio && (
                  <p className="text-gray-700 mb-3 leading-relaxed">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Website</span>
                    </a>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(user.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">{user.followersCount}</div>
                <div className="text-gray-600 font-medium">Takipçi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black">{user.followingCount}</div>
                <div className="text-gray-600 font-medium">Takip Edilen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">127</div>
                <div className="text-gray-600 font-medium">Gönderi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">2.3K</div>
                <div className="text-gray-600 font-medium">Beğeni</div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Settings */}
            <Link href="/profile-settings" className="block">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Profil Ayarları</h3>
                  <p className="text-purple-100 text-sm">Bilgilerinizi düzenleyin</p>
                </div>
              </div>
            </Link>

            {/* Server-Side Profile */}
            <Link href="/profile-ssr" className="block">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Server-Side Profil</h3>
                  <p className="text-green-100 text-sm">Hızlı yükleme ile profil</p>
                </div>
              </div>
            </Link>

            {/* Wardrobe */}
            <Link href="/gardirop" className="block">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l4-2" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Gardırobum</h3>
                  <p className="text-orange-100 text-sm">Kıyafetlerinizi organize edin</p>
                </div>
              </div>
            </Link>
          </div>

          {/* User ID for development */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Geliştirici Bilgisi:</strong> User ID: {user._id}
            </p>
            {user.updatedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Son güncelleme: {new Date(user.updatedAt).toLocaleString('tr-TR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 