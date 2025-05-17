import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Geçici depolama (MongoDB olmadığında)
const tempAvatarStorage: any[] = [];

export async function POST(request: Request) {
  let client;
  try {
    const { measurements, avatar } = await request.json();
    
    // MongoDB bağlantı kontrolü
    if (!process.env.MONGODB_URI) {
      console.warn('MongoDB bağlantı bilgisi bulunamadı - bellek üzerinde saklama kullanılıyor');
      // MongoDB yoksa geçici bellek üzerinde saklama
      const tempId = Date.now().toString();
      tempAvatarStorage.push({
        _id: tempId,
        measurements,
        avatar,
        createdAt: new Date()
      });
      
      console.log(`Avatar bellek üzerinde kaydedildi. ID: ${tempId}`);
      console.log(`Toplam kayıtlı avatar: ${tempAvatarStorage.length}`);
      
      return NextResponse.json({
        success: true,
        avatarId: tempId,
        storageType: 'memory'
      });
    }

    try {
      // MongoDB bağlantı denemesi
      client = await MongoClient.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 30000,
        family: 4,
        directConnection: true
      });

      const db = client.db();
      
      // Avatar bilgilerini kaydet
      const result = await db.collection('avatars').insertOne({
        measurements,
        avatar,
        createdAt: new Date()
      });

      return NextResponse.json({
        success: true,
        avatarId: result.insertedId,
        storageType: 'mongodb'
      });
    } catch (dbError: any) {
      console.error('MongoDB Bağlantı hatası:', dbError);
      
      // MongoDB bağlantı hatası durumunda geçici bellek üzerinde saklama
      const tempId = Date.now().toString();
      tempAvatarStorage.push({
        _id: tempId,
        measurements,
        avatar,
        createdAt: new Date()
      });
      
      console.log(`Avatar bellek üzerinde kaydedildi. ID: ${tempId}`);
      console.log(`Toplam kayıtlı avatar: ${tempAvatarStorage.length}`);
      
      return NextResponse.json({
        success: true,
        avatarId: tempId,
        storageType: 'memory',
        note: 'Veritabanı bağlantısı başarısız olduğu için bellek üzerinde saklandı'
      });
    }
  } catch (error: any) {
    console.error('Avatar kaydetme hatası:', error);
    return NextResponse.json(
      { error: 'Avatar kaydedilemedi: ' + error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Bellekteki avatarları görüntülemek için (isteğe bağlı)
export async function GET() {
  return NextResponse.json({
    avatarCount: tempAvatarStorage.length,
    avatars: tempAvatarStorage
  });
} 