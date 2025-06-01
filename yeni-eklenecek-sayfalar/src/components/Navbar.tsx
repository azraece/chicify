import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

const categories = [
  'Tişört', 'Gömlek', 'Bluz', 'Kazak', 'Sweatshirt', 'Ceket',
  'Hırka', 'Yelek', 'Pantolon', 'Jean', 'Etek', 'Şort',
  'Tayt', 'Eşofman altı', 'Mont', 'Kaban', 'Trençkot',
  'Yağmurluk', 'Parka', 'Blazer', 'Deri ceket', 'Pijama takımı'
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            CHICIFY
          </Link>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Menu>
                <Menu.Button className="px-3 py-2 text-gray-700 hover:text-gray-900">
                  Tüm Kategoriler
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    {categories.map((category) => (
                      <Menu.Item key={category}>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {category}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Menu>
            </div>

            <Link to="/calendar" className="text-gray-700 hover:text-gray-900">
              <CalendarIcon className="h-6 w-6" />
            </Link>

            <Link to="/profile" className="text-gray-700 hover:text-gray-900">
              <UserCircleIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 