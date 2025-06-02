import Navbar from '@/components/Navbar';
import ChatBox from '@/components/ChatBox';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Chat Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Moda, kombin önerileri ve daha fazlası hakkında AI asistanımızla sohbet edin!
          </p>
        </div>
        
        <div className="flex justify-center">
          <ChatBox />
        </div>
      </div>
    </div>
  );
} 