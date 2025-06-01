import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF5EE]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-black">Chicify</h1>
            <input 
              type="search" 
              placeholder="Ara..." 
              className="bg-gray-100 px-4 py-2 rounded-full w-64"
            />
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors">
              Giriş Yap
            </Link>
            <Link href="/signup" className="bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Kaydol
            </Link>
          </nav>
        </div>
      </header>

      {/* Slogan */}
      <div className="w-full text-center pt-24 pb-8">
        <h2 className="text-4xl font-alex-brush text-gray-800">Şıklığı yaşam tarzı haline getirenler için</h2>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          {/* Fotoğraflar */}
          {[
            '/photos/1.jpg',
            '/photos/2.jpg',
            '/photos/3.jpg',
            '/photos/4.jpg',
            '/photos/5.jpg',
            '/photos/6.jpg',
            '/photos/7.jpg',
            '/photos/8.jpg',
          ].map((image, index) => (
            <div key={index} className="break-inside-avoid mb-4 rounded-lg overflow-hidden cursor-pointer">
              <div className="relative aspect-[3/4] w-full max-w-[300px] mx-auto">
                <Image
                  src={image}
                  alt={`Fotoğraf ${index + 1}`}
                  fill
                  sizes="(max-width: 300px) 100vw, 300px"
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
