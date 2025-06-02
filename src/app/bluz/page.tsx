import Navbar from '@/components/Navbar';

const bluzImages = [
  'WhatsApp Image 2025-06-02 at 19.57.40 (1).jpeg',
  'WhatsApp Image 2025-06-02 at 19.57.39 (2).jpeg',
  'WhatsApp Image 2025-06-02 at 19.57.39 (1).jpeg',
  'WhatsApp Image 2025-06-02 at 19.57.39.jpeg',
  'WhatsApp Image 2025-06-02 at 19.57.38.jpeg',
  'WhatsApp Image 2025-06-02 at 19.57.34.jpeg'
];

export default function BluzPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bluz Kombinleri
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Zarif ve modern bluz kombinlerini keşfedin ve tarzınızı tamamlayın!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {bluzImages.map((image, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="aspect-[3/4] bg-gray-50">
                <img
                  src={`/bluz/${image}`}
                  alt={`Bluz kombinleri ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Bluz Kombin {index + 1}
                </h3>
                <p className="text-sm text-gray-600">
                  Zarif ve modern bluz kombinleri
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 