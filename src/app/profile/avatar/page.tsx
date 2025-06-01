'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Avatar3D = dynamic(() => import('@/components/Avatar3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Yükleniyor...</div>
});

export default function AvatarCreator() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [measurements, setMeasurements] = useState({
    bodySize: 'M',
    heightGroup: 'normal',
    pantSize: '38',
    skinTone: 'medium',
    hairStyle: 'straight',
    hairColor: 'brown',
    scarf: 'none',
    gender: 'female'
  });

  const [avatar, setAvatar] = useState({
    style: 'casual',
    color: 'red'
  });

  const handleMeasurementChange = (field: string, value: string | number) => {
    setMeasurements({
      ...measurements,
      [field]: value
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements, avatar })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Avatar kaydedilemedi');
      }
      
      alert('Avatar başarıyla kaydedildi! ID: ' + data.avatarId);
      // Kullanıcıyı home sayfasına yönlendir
      router.push('/home');
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      alert('Hata: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Avatar Oluşturucu</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol taraf - Ölçüler */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Ölçüleriniz</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                <select
                  value={measurements.gender}
                  onChange={(e) => handleMeasurementChange('gender', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="female">Kadın</option>
                  <option value="male">Erkek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Boy</label>
                <select
                  value={measurements.heightGroup}
                  onChange={(e) => handleMeasurementChange('heightGroup', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="petite">Kısa (150-160 cm)</option>
                  <option value="normal">Normal (160-175 cm)</option>
                  <option value="tall">Uzun (175-190 cm)</option>
                  <option value="veryTall">Çok Uzun (190+ cm)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Genel Beden</label>
                <select
                  value={measurements.bodySize}
                  onChange={(e) => handleMeasurementChange('bodySize', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pantolon Bedeni</label>
                <select
                  value={measurements.pantSize}
                  onChange={(e) => handleMeasurementChange('pantSize', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Array.from({ length: 7 }, (_, i) => 32 + i * 2).map((size) => (
                    <option key={size} value={size.toString()}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ten Rengi</label>
                <select
                  value={measurements.skinTone}
                  onChange={(e) => handleMeasurementChange('skinTone', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="light">Açık</option>
                  <option value="medium">Orta</option>
                  <option value="dark">Koyu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Saç Stili</label>
                <select
                  value={measurements.hairStyle}
                  onChange={(e) => handleMeasurementChange('hairStyle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="straight">Düz</option>
                  <option value="wavy">Dalgalı</option>
                  <option value="curly">Kıvırcık</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Saç Rengi</label>
                <select
                  value={measurements.hairColor}
                  onChange={(e) => handleMeasurementChange('hairColor', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="black">Siyah</option>
                  <option value="brown">Kahverengi</option>
                  <option value="blonde">Sarı</option>
                  <option value="red">Kızıl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Başörtüsü</label>
                <select
                  value={measurements.scarf}
                  onChange={(e) => handleMeasurementChange('scarf', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="none">Yok</option>
                  <option value="simple">Sade</option>
                  <option value="styled">Şık</option>
                </select>
              </div>
            </form>
          </div>

          {/* Sağ taraf - Avatar Önizleme */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Avatar Önizleme</h2>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Avatar önizlemesi burada görünecek</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stil</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Casual', 'Elegant', 'Sporty'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setAvatar({...avatar, style: style.toLowerCase()})}
                      className={`p-2 text-center rounded ${
                        avatar.style === style.toLowerCase()
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white py-2 px-4 rounded-md`}
              >
                {isLoading ? 'Kaydediliyor...' : 'Avatarı Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 