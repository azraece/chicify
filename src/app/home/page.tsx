'use client';

import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LikeButton from '@/components/LikeButton';

const popularCategories = [
  { name: 'Elbise', icon: '/icons/dress.jpeg' },
  { name: 'Etek', icon: '/icons/skirt.jpeg' },
  { name: 'Pantolon', icon: '/icons/pantolon.jpeg' },
  { name: 'Bluz', icon: '/icons/tshirt.jpeg' },
  { name: 'Tüm Kategoriler', type: 'all' }
];

const allCategories = [
  'Tişört', 'Gömlek', 'Bluz', 'Kazak', 'Sweatshirt', 'Ceket',
  'Hırka', 'Yelek', 'Pantolon', 'Jean', 'Etek', 'Şort',
  'Tayt', 'Eşofman altı', 'Mont', 'Kaban', 'Trençkot',
  'Yağmurluk', 'Parka', 'Blazer', 'Deri ceket', 'Pijama takımı'
];

const outfitCombinations = [
  {
    id: 'slider-outfit-1',
    title: 'Günlük Şık',
    userId: '675c8b5e123456789012a568', // user1 ObjectId
    userName: 'Ayşe Yılmaz',
    items: [
      { name: 'Siyah Üst', image: '/resimler/1.jpeg' },
      { name: 'Açık Mavi Jean', image: '/resimler/2.jpeg' },
      { name: 'Siyah Topuklu', image: '/resimler/3.jpeg' },
      { name: 'Siyah Çanta', image: '/resimler/4.jpeg' }
    ]
  },
  {
    id: 'slider-outfit-2',
    title: 'İş Şıklığı',
    userId: '675c8b5e123456789012a569', // user2 ObjectId
    userName: 'Elif Demir',
    items: [
      { name: 'Bordo Üst', image: '/resimler/5.jpeg' },
      { name: 'Lacivert Jean', image: '/resimler/6.jpeg' },
      { name: 'Bordo Topuklu', image: '/resimler/7.jpeg' },
      { name: 'Lacivert Çanta', image: '/resimler/8.jpeg' }
    ]
  },
  {
    id: 'slider-outfit-3',
    title: 'Zarif Kombin',
    userId: '675c8b5e123456789012a570', // user3 ObjectId
    userName: 'Zeynep Kaya',
    items: [
      { name: 'Krem Elbise', image: '/resimler/9.jpeg' },
      { name: 'Kahverengi Topuklu', image: '/resimler/99.jpeg' },
      { name: 'Tasarım Çanta', image: '/resimler/1.jpeg' },
      { name: 'Güneş Gözlüğü', image: '/resimler/2.jpeg' }
    ]
  },
  {
    id: 'slider-outfit-4',
    title: 'Spor Elegant',
    userId: '675c8b5e123456789012a571', // user4 ObjectId
    userName: 'Merve Öztürk',
    items: [
      { name: 'Beyaz Tişört', image: '/resimler/10.jpeg' },
      { name: 'Siyah Spor Ayakkabı', image: '/resimler/11.jpeg' },
      { name: 'Denim Ceket', image: '/resimler/12.jpeg' },
      { name: 'Sırt Çantası', image: '/resimler/13.jpeg' }
    ]
  },
  {
    id: 'slider-outfit-5',
    title: 'Romantik Tarz',
    userId: '675c8b5e123456789012a572', // user5 ObjectId
    userName: 'Selin Çelik',
    items: [
      { name: 'Pembe Bluz', image: '/resimler/14.jpeg' },
      { name: 'Beyaz Etek', image: '/resimler/15.jpeg' },
      { name: 'Nude Topuklu', image: '/resimler/16.jpeg' },
      { name: 'Mini Çanta', image: '/resimler/17.jpeg' }
    ]
  }
];

const CategoryIcon = ({ type, icon }: { type?: string; icon?: string }) => {
  if (icon) {
    return (
      <div className="w-full h-full rounded-full overflow-hidden">
        <img src={icon} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (type === 'all') {
    return (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" strokeWidth="1.5"/>
      </svg>
    );
  }
  return null;
};

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  
  // Demo: Gerçek uygulamada bu auth context'ten gelecek
  const currentUserId = "675c8b5e123456789012a567"; // Mevcut kullanıcının ID'si

  // Demo outfit verileri
  const demoOutfits = [
    {
      id: 'demo-outfit-1',
      image: '/resimler/1.jpeg',
      title: 'Kombin 1',
      userName: 'Ayşe Yılmaz',
      userId: '675c8b5e123456789012a568', // user1
      routePath: '/user/user1'
    },
    {
      id: 'demo-outfit-2', 
      image: '/resimler/2.jpeg',
      title: 'Kombin 2',
      userName: 'Elif Demir',
      userId: '675c8b5e123456789012a569', // user2
      routePath: '/user/user2'
    },
    {
      id: 'demo-outfit-3',
      image: '/resimler/3.jpeg', 
      title: 'Kombin 3',
      userName: 'Zeynep Kaya',
      userId: '675c8b5e123456789012a570', // user3
      routePath: '/user/user3'
    },
    {
      id: 'demo-outfit-4',
      image: '/resimler/4.jpeg',
      title: 'Kombin 4', 
      userName: 'Merve Öztürk',
      userId: '675c8b5e123456789012a571', // user4
      routePath: '/user/user4'
    },
    {
      id: 'demo-outfit-5',
      image: '/resimler/5.jpeg',
      title: 'Kombin 5',
      userName: 'Selin Çelik', 
      userId: '675c8b5e123456789012a572', // user5
      routePath: '/user/user5'
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleCategoryClick = (category: any) => {
    if (category.type === 'all') {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (category.name === 'Etek') {
      router.push('/etek');
    } else if (category.name === 'Elbise') {
      router.push('/elbise');
    } else if (category.name === 'Pantolon') {
      router.push('/pantolon');
    } else if (category.name === 'Bluz') {
      router.push('/bluz');
    } else {
      // Diğer kategoriler için istediğiniz aksiyonu buraya ekleyebilirsiniz
      console.log('Kategori seçildi:', category.name);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-16 p-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-8">Popüler Kategoriler</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mb-12 relative">
            {popularCategories.map((category, index) => (
              <div key={category.name} className="text-center cursor-pointer relative">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-50 mx-auto mb-3 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CategoryIcon type={category.type} icon={category.icon} />
                </div>
                <p className="text-sm font-medium text-gray-700">{category.name}</p>
                
                {/* Dropdown - sadece "Tüm Kategoriler" için */}
                {category.type === 'all' && isDropdownOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-sm font-medium text-gray-700 p-2 border-b">Tüm Kategoriler</div>
                      {allCategories.map((cat) => (
                        <button
                          key={cat}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                          onClick={() => {
                            console.log('Kategori seçildi:', cat);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-8">Popüler Kombinler</h2>
          <div className="mb-12">
            <Slider {...settings}>
              {outfitCombinations.map((outfit) => (
                <div key={outfit.id} className="px-2">
                  <Link href={`/user/${outfit.userId === '675c8b5e123456789012a568' ? 'user1' : 
                    outfit.userId === '675c8b5e123456789012a569' ? 'user2' :
                    outfit.userId === '675c8b5e123456789012a570' ? 'user3' :
                    outfit.userId === '675c8b5e123456789012a571' ? 'user4' : 'user5'}`} className="block">
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer relative">
                      {/* Like Button - Slider kartları için sağ üst köşe */}
                      <LikeButton
                        currentUserId={currentUserId}
                        outfitId={outfit.id}
                        outfitOwnerId={outfit.userId}
                        className="top-2 right-2 bottom-auto left-auto" // Sağ üst köşe
                      />
                      
                      <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h3 className="text-xl font-medium">{outfit.title}</h3>
                        <p className="text-sm text-gray-500">@{outfit.userName}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {outfit.items.map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-gray-50">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-600 text-center">{item.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>

          {/* Popüler Kombinler */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">popüler kombinler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoOutfits.map((outfit) => (
                <div 
                  key={outfit.id}
                  onClick={() => router.push(outfit.routePath)}
                  className="border-2 border-black rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative"
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded mb-3 overflow-hidden relative">
                    <img
                      src={outfit.image}
                      alt={outfit.title}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Like Button - Sol alt köşe */}
                    <LikeButton
                      currentUserId={currentUserId}
                      outfitId={outfit.id}
                      outfitOwnerId={outfit.userId}
                      className="bottom-1 left-1" // Ana sayfada biraz daha içerde
                    />
                  </div>
                  <p className="font-medium">{outfit.userName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 