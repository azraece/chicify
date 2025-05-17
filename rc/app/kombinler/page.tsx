'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Outfit = {
  id: number;
  title: string;
  description: string;
  image: string;
  style: string;
  size: string;
  userId: string;
  likes: number;
  userAvatar: string;
  userName: string;
  bgColor: string;
};

export default function Kombinler() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('hepsi');
  const [selectedSize, setSelectedSize] = useState<string>('hepsi');

  // Demo verisi
  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilir
    const demoOutfits: Outfit[] = [
      {
        id: 1,
        title: "Bahar Kombini",
        description: "Hafif ve şık bir bahar kombini",
        image: "/photos/1.jpg",
        style: "casual",
        size: "M",
        userId: "user1",
        likes: 124,
        userAvatar: "/avatar-placeholder.png",
        userName: "Ayşe K.",
        bgColor: "#f0e4d7"
      },
      {
        id: 2,
        title: "Ofis Şıklığı",
        description: "Resmi toplantılar için ideal",
        image: "/photos/2.jpg",
        style: "elegant",
        size: "S",
        userId: "user2",
        likes: 89,
        userAvatar: "/avatar-placeholder.png",
        userName: "Zeynep A.",
        bgColor: "#e4d7c5"
      },
      {
        id: 3,
        title: "Spor Giyim",
        description: "Aktif yaşam tarzı için uygun",
        image: "/photos/1.jpg",
        style: "sporty",
        size: "L",
        userId: "user3",
        likes: 210,
        userAvatar: "/avatar-placeholder.png",
        userName: "Mehmet Y.",
        bgColor: "#d7c5b5"
      },
      {
        id: 4,
        title: "Sonbahar Kombini",
        description: "Sonbahar renkleriyle uyumlu kombin",
        image: "/photos/2.jpg",
        style: "casual",
        size: "M",
        userId: "user4",
        likes: 156,
        userAvatar: "/avatar-placeholder.png",
        userName: "Elif D.",
        bgColor: "#c5b5a3"
      },
      {
        id: 5,
        title: "Parti Şıklığı",
        description: "Özel geceler için şık bir seçim",
        image: "/photos/1.jpg",
        style: "elegant",
        size: "XS",
        userId: "user5",
        likes: 268,
        userAvatar: "/avatar-placeholder.png",
        userName: "Buse T.",
        bgColor: "#b5a393"
      },
      {
        id: 6,
        title: "Günlük Kombin",
        description: "Günlük kullanım için rahat ve şık",
        image: "/photos/2.jpg",
        style: "casual",
        size: "L",
        userId: "user6",
        likes: 97,
        userAvatar: "/avatar-placeholder.png",
        userName: "Can M.",
        bgColor: "#a39383"
      },
    ];

    setOutfits(demoOutfits);
  }, []);

  // Filtreleme fonksiyonu
  const filteredOutfits = outfits.filter(outfit => {
    if (selectedStyle !== 'hepsi' && outfit.style !== selectedStyle) {
      return false;
    }
    
    if (selectedSize !== 'hepsi' && outfit.size !== selectedSize) {
      return false;
    }
    
    return true;
  });

  return (
    <main className="min-h-screen bg-[#FFF5EE]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-red-600">Chicify</Link>
            <input 
              type="search" 
              placeholder="Kombinlerde ara..." 
              className="bg-gray-100 px-4 py-2 rounded-full w-64"
            />
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              href="/profile/avatar" 
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Avatarım
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                  K
                </div>
              </div>
              <span className="text-sm font-medium">Kullanıcı</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Senin İçin Kombinler</h1>
        <p className="text-center text-gray-600 mb-8">
          Avatar bilgilerine göre önerilen kişisel kombinler
        </p>

        {/* Filtreler */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <select 
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="border-none bg-transparent focus:outline-none px-3 py-1"
            >
              <option value="hepsi">Tüm Stiller</option>
              <option value="casual">Günlük</option>
              <option value="elegant">Şık</option>
              <option value="sporty">Spor</option>
            </select>
          </div>

          <div className="bg-white p-2 rounded-full shadow-sm">
            <select 
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border-none bg-transparent focus:outline-none px-3 py-1"
            >
              <option value="hepsi">Tüm Bedenler</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
        </div>

        {/* Kombinler Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredOutfits.map((outfit) => (
            <div key={outfit.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div 
                className="relative h-80 w-full flex items-center justify-center" 
                style={{backgroundColor: outfit.bgColor}}
              >
                <div className="text-white font-bold text-xl">
                  {outfit.userName} Kombini
                </div>
                <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-sm">
                  <button className="text-gray-400 hover:text-red-500 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-500">
                      {outfit.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{outfit.userName}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{outfit.size}</span>
                    <span className="text-xs flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {outfit.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 