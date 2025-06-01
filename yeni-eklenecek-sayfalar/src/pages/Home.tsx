import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const popularCategories = [
  { name: 'Elbise', icon: '/icons/dress.jpeg' },
  { name: 'Etek', icon: '/icons/skirt.jpeg' },
  { name: 'Pantolon', icon: '/icons/pantolon.jpeg' },
  { name: 'Bluz', icon: '/icons/tshirt.jpeg' },
  { name: 'Tüm Kategoriler', type: 'all' }
];

const outfitCombinations = [
  {
    id: 1,
    title: 'Günlük Şık',
    items: [
      { name: 'Siyah Üst', image: '/resimler/1.jpeg' },
      { name: 'Açık Mavi Jean', image: '/resimler/2.jpeg' },
      { name: 'Siyah Topuklu', image: '/resimler/3.jpeg' },
      { name: 'Siyah Çanta', image: '/resimler/4.jpeg' }
    ]
  },
  {
    id: 2,
    title: 'İş Şıklığı',
    items: [
      { name: 'Bordo Üst', image: '/resimler/5.jpeg' },
      { name: 'Lacivert Jean', image: '/resimler/6.jpeg' },
      { name: 'Bordo Topuklu', image: '/resimler/7.jpeg' },
      { name: 'Lacivert Çanta', image: '/resimler/8.jpeg' }
    ]
  },
  {
    id: 3,
    title: 'Zarif Kombin',
    items: [
      { name: 'Krem Elbise', image: '/resimler/9.jpeg' },
      { name: 'Kahverengi Topuklu', image: '/resimler/99.jpeg' },
      { name: 'Tasarım Çanta', image: '/resimler/1.jpeg' },
      { name: 'Güneş Gözlüğü', image: '/resimler/2.jpeg' }
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

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-8">Popüler Kategoriler</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mb-12">
        {popularCategories.map((category) => (
          <div key={category.name} className="text-center cursor-pointer">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-50 mx-auto mb-3 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CategoryIcon type={category.type} icon={category.icon} />
            </div>
            <p className="text-sm font-medium text-gray-700">{category.name}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-8">Popüler Kombinler</h2>
      <div className="mb-12">
        <Slider {...settings}>
          {outfitCombinations.map((outfit) => (
            <div key={outfit.id} className="px-2">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-xl font-medium mb-4 sm:mb-6">{outfit.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {outfit.items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-full aspect-[3/4] relative rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-600 text-center">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Home; 