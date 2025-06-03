import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'chicify';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!client) {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

// Demo kombinler farklı kullanıcılar için
const getDemoOutfits = (userId: string) => {
  const userIdToImageMap = {
    '675c8b5e123456789012a568': { // user1
      images: ['/resimler/1.jpeg', '/resimler/3.jpeg', '/resimler/5.jpeg'],
      titles: ['Günlük Şık', 'Casual Look', 'Hafta Sonu']
    },
    '675c8b5e123456789012a569': { // user2  
      images: ['/resimler/2.jpeg', '/resimler/4.jpeg', '/resimler/6.jpeg'],
      titles: ['Ofis Stili', 'Akşam Yemeği', 'İş Toplantısı']
    },
    '675c8b5e123456789012a570': { // user3
      images: ['/resimler/7.jpeg', '/resimler/8.jpeg', '/resimler/9.jpeg'],
      titles: ['Spor Chic', 'Günlük Rahat', 'Yürüyüş']
    },
    '675c8b5e123456789012a571': { // user4
      images: ['/resimler/10.jpeg', '/resimler/11.jpeg', '/resimler/12.jpeg'],
      titles: ['Özel Gün', 'Parti Look', 'Gece Çıkışı']
    },
    '675c8b5e123456789012a572': { // user5
      images: ['/resimler/14.jpeg', '/resimler/15.jpeg', '/resimler/16.jpeg'],
      titles: ['Vintage Style', 'Retro Chic', 'Boho Look']
    }
  };

  const userData = userIdToImageMap[userId as keyof typeof userIdToImageMap];
  
  if (!userData) {
    // Default demo outfits
    return [
      {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        title: 'Demo Kombin 1',
        imageUrl: '/resimler/1.jpeg',
        tags: ['demo', 'style'],
        createdAt: new Date(),
        isPublic: true
      },
      {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        title: 'Demo Kombin 2',
        imageUrl: '/resimler/2.jpeg',
        tags: ['demo', 'fashion'],
        createdAt: new Date(),
        isPublic: true
      }
    ];
  }

  return userData.images.map((image, index) => ({
    _id: new ObjectId(),
    userId: new ObjectId(userId),
    title: userData.titles[index],
    imageUrl: image,
    tags: ['style', 'fashion', 'outfit'],
    createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Farklı tarihler
    isPublic: true
  }));
};

// Kullanıcının kombinlerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parametresi gerekli' },
        { status: 400 }
      );
    }

    // ObjectId dönüşümü
    let userObjectId: ObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı ID formatı' },
        { status: 400 }
      );
    }

    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      const outfitsCollection = db.collection('outfits');

      // Kullanıcının kombinlerini getir
      const outfits = await outfitsCollection.find({
        userId: userObjectId
      }).sort({
        createdAt: -1 // En yeni kombinler başta
      }).toArray();

      // Eğer kombinler yoksa demo kombinler döndür
      if (outfits.length === 0) {
        const demoOutfits = getDemoOutfits(userId);
        
        return NextResponse.json({
          success: true,
          outfits: demoOutfits,
          count: demoOutfits.length,
          isDemo: true
        });
      }

      return NextResponse.json({
        success: true,
        outfits: outfits,
        count: outfits.length,
        isDemo: false
      });

    } catch (dbError) {
      // MongoDB bağlantı hatası veya collection yoksa demo data döndür
      console.log('MongoDB error, returning demo data:', dbError);
      const demoOutfits = getDemoOutfits(userId);
      
      return NextResponse.json({
        success: true,
        outfits: demoOutfits,
        count: demoOutfits.length,
        isDemo: true
      });
    }

  } catch (error) {
    console.error('Outfits fetch error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// Yeni kombin ekleme
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { title, imageUrl, tags, isPublic = true } = await request.json();

    if (!userId || !title || !imageUrl) {
      return NextResponse.json(
        { error: 'userId, title ve imageUrl parametreleri gerekli' },
        { status: 400 }
      );
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const outfitsCollection = db.collection('outfits');

    // ObjectId dönüşümü
    let userObjectId: ObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı ID formatı' },
        { status: 400 }
      );
    }

    // Yeni kombini ekle
    const newOutfit = {
      userId: userObjectId,
      title,
      imageUrl,
      tags: tags || [],
      isPublic,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await outfitsCollection.insertOne(newOutfit);

    return NextResponse.json({
      success: true,
      outfitId: result.insertedId,
      message: 'Kombin başarıyla eklendi'
    });

  } catch (error) {
    console.error('Outfit creation error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 