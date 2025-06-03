'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FavoriteOutfit {
  _id: string;
  title: string;
  imageUrl: string;
  ownerName: string;
  ownerId: string;
  tags: string[];
  likedAt: string;
}

export default function Favoriler() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Demo: Gerçek uygulamada bu auth context'ten gelecek
  const currentUserId = "675c8b5e123456789012a567"; // Mevcut kullanıcının ID'si

  const allCategories = [
    'Tişört', 'Gömlek', 'Bluz', 'Kazak', 'Sweatshirt', 'Ceket',
    'Hırka', 'Yelek', 'Pantolon', 'Jean', 'Etek', 'Şort',
    'Tayt', 'Eşofman altı', 'Mont', 'Kaban', 'Trençkot',
    'Yağmurluk', 'Parka', 'Blazer', 'Deri ceket', 'Pijama takımı'
  ];

  // Favori kombinleri çek
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/favorites?userId=${currentUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(data.favorites);
        } else {
          setError('Favoriler yüklenirken hata oluştu');
        }
      } else {
        setError('Favoriler getirilemedi');
      }
    } catch (err) {
      console.error('Favoriler çekilirken hata:', err);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Favorilerden çıkarma
  const removeFavorite = async (outfitId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          outfitId: outfitId
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Favorileri listeden kaldır
        setFavorites(prev => prev.filter(fav => fav._id !== outfitId));
        console.log(data.message);
      } else {
        console.error('Favorilerden çıkarma hatası:', data.error);
      }

    } catch (error) {
      console.error('Remove favorite error:', error);
    }
  };

  // Component mount olduğunda favorileri çek
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Beğeni değişikliklerini dinle
  useEffect(() => {
    // CustomEvent listener
    const handleFavoritesUpdate = (event: CustomEvent) => {
      console.log('Favoriler güncellendi:', event.detail);
      // Favorileri yeniden çek
      fetchFavorites();
    };

    // Storage değişikliklerini dinle (farklı tab'lardan gelebilir)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'favoritesNeedUpdate') {
        console.log('Storage ile favoriler güncelleme sinyali alındı');
        fetchFavorites();
      }
    };

    // Sayfa odağa geldiğinde kontrol et
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const lastUpdate = localStorage.getItem('favoritesNeedUpdate');
        if (lastUpdate) {
          const updateTime = parseInt(lastUpdate);
          const now = Date.now();
          // Son 10 saniye içinde güncelleme varsa yenile
          if (now - updateTime < 10000) {
            console.log('Sayfa odağa geldi, favoriler güncelleniyor');
            fetchFavorites();
            localStorage.removeItem('favoritesNeedUpdate');
          }
        }
      }
    };

    // Event listener'ları ekle
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Component mount'dan sonra periyodik kontrol (opsiyonel)
  useEffect(() => {
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('favoritesNeedUpdate');
      if (lastUpdate) {
        const updateTime = parseInt(lastUpdate);
        const now = Date.now();
        // Son 5 saniye içinde güncelleme varsa yenile
        if (now - updateTime < 5000) {
          console.log('Periyodik kontrol: favoriler güncelleniyor');
          fetchFavorites();
          localStorage.removeItem('favoritesNeedUpdate');
        }
      }
    }, 2000); // 2 saniyede bir kontrol

    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="w-full shadow-xl border-b-2 border-gray-200 relative mb-8">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/home" className="text-2xl font-bold text-black">
                CHICIFY
              </Link>
            </div>
          </div>
        </div>

        {/* Loading content */}
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-8">favorilerim</h1>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full aspect-[3/4] border-2 border-gray-200 rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold">favorilerim</h1>
            <button
              onClick={fetchFavorites}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Favorileri Yenile"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-500">
              {favorites.length}
            </p>
            <p className="text-sm text-gray-600">
              {favorites.length === 0 ? 'favori yok' :
               favorites.length === 1 ? 'favori kombin' :
               'favori kombin'}
            </p>
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={fetchFavorites}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Favori kombinler */}
        {!error && (
          <div className={`grid gap-4 ${
            favorites.length === 0 ? 'grid-cols-4' : 
            favorites.length <= 4 ? 'grid-cols-4' :
            favorites.length <= 6 ? 'grid-cols-3 sm:grid-cols-6' :
            favorites.length <= 8 ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8' :
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          }`}>
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <div
                  key={favorite._id}
                  onClick={() => {
                    // Kombinin sahibinin profiline git
                    const userRoute = favorite.ownerId === '675c8b5e123456789012a568' ? 'user1' :
                      favorite.ownerId === '675c8b5e123456789012a569' ? 'user2' :
                      favorite.ownerId === '675c8b5e123456789012a570' ? 'user3' :
                      favorite.ownerId === '675c8b5e123456789012a571' ? 'user4' :
                      favorite.ownerId === '675c8b5e123456789012a572' ? 'user5' : 'home';
                    
                    router.push(`/user/${userRoute}`);
                  }}
                  className="w-full aspect-[3/4] border-2 border-black rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden group relative"
                >
                  <img
                    src={favorite.imageUrl}
                    alt={favorite.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="text-white">
                      <p className="font-medium text-sm mb-1">{favorite.title}</p>
                      <p className="text-xs text-gray-200">@{favorite.ownerName}</p>
                      {favorite.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {favorite.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Favorilerden çıkarma ikonu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(favorite._id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                    title="Favorilerden Çıkar"
                  >
                    <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              // Boş durum
              <div className="col-span-4 text-center py-16">
                <div className="text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Henüz favori kombin yok</h3>
                  <p className="text-gray-400 mb-4">Beğendiğiniz kombinleri kalp ikonuna tıklayarak favorilerinize ekleyin</p>
                  <Link 
                    href="/home" 
                    className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Kombinleri Keşfet
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 