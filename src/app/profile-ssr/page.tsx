import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';

async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      redirect('/login');
    }

    // JWT token'ı doğrula
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (jwtError) {
      redirect('/login');
    }

    const { db } = await connectToDatabase();
    
    // MongoDB ObjectId dönüşümü
    let userObjectId;
    try {
      userObjectId = new ObjectId(decoded.userId);
    } catch (error) {
      redirect('/login');
    }

    const user = await db.collection('users').findOne(
      { _id: userObjectId },
      { 
        projection: { 
          name: 1, 
          username: 1, 
          email: 1,
          followersCount: 1,
          followingCount: 1,
          profileImage: 1,
          createdAt: 1
        } 
      }
    );

    if (!user) {
      redirect('/login');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      profileImage: user.profileImage || null,
      createdAt: user.createdAt
    };

  } catch (error) {
    console.error('Server-side authentication error:', error);
    redirect('/login');
  }
}

export default async function ProfileSSR() {
  // Server-side'da kullanıcı verilerini al
  const user = await getUserFromToken();

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
              <Link href="/my-profile" className="text-lg font-medium hover:text-red-600 transition-colors">
                Client Profile
              </Link>
              <Link href="/profile-settings" className="text-lg font-medium hover:text-red-600 transition-colors">
                Ayarlar
              </Link>
              <form action="/api/auth/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  Çıkış Yap
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* SSR Badge */}
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-800 font-medium">Server-Side Rendered Profile</span>
              <span className="text-green-600 text-sm">(No loading state, data pre-fetched)</span>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              {/* User Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-black mb-2">{user.name}</h1>
                <p className="text-gray-600 text-lg mb-1">@{user.username}</p>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Üye olma tarihi: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{user.followersCount}</div>
                <div className="text-gray-600">Takipçi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{user.followingCount}</div>
                <div className="text-gray-600">Takip Edilen</div>
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Server-Side vs Client-Side Rendering</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-100 p-4 rounded">
                <h4 className="font-medium text-green-800 mb-2">✅ Server-Side (Bu Sayfa)</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Anında yüklenir (loading yok)</li>
                  <li>• SEO dostu</li>
                  <li>• Token server'da doğrulanır</li>
                  <li>• Daha güvenli</li>
                </ul>
              </div>
              <div className="bg-yellow-100 p-4 rounded">
                <h4 className="font-medium text-yellow-800 mb-2">⚡ Client-Side</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• İnteraktif (loading state)</li>
                  <li>• Real-time güncellemeler</li>
                  <li>• Daha hızlı sayfa geçişleri</li>
                  <li>• Daha dinamik</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Settings */}
            <Link href="/profile-settings" className="block">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Profil Ayarları</h3>
                  <p className="text-gray-600 text-sm">Kombinlerinizi ve avatar ayarlarınızı düzenleyin</p>
                </div>
              </div>
            </Link>

            {/* Client-Side Profile */}
            <Link href="/my-profile" className="block">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Client-Side Profil</h3>
                  <p className="text-gray-600 text-sm">Dinamik loading ile profil sayfası</p>
                </div>
              </div>
            </Link>

            {/* Wardrobe */}
            <Link href="/gardirop" className="block">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l4-2" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Gardırobum</h3>
                  <p className="text-gray-600 text-sm">Kıyafetlerinizi organize edin</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Technical Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Teknik Bilgi:</strong> Bu sayfa React Server Component kullanarak server-side'da render edildi. 
              Token doğrulaması sunucuda yapıldı ve kullanıcı verileri props olarak geçildi.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              User ID: {user._id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 