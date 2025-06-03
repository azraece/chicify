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

// Demo favoriler - beğenilen kombinler için
const getDemoFavorites = (userId: string) => {
  // Farklı kullanıcılar için demo favori kombinler
  const demoFavorites = [
    {
      _id: 'demo-outfit-1',
      title: 'Günlük Şık',
      imageUrl: '/resimler/1.jpeg',
      ownerName: 'Ayşe Yılmaz',
      ownerId: '675c8b5e123456789012a568',
      tags: ['casual', 'günlük'],
      likedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 gün önce
    },
    {
      _id: 'slider-outfit-2',
      title: 'İş Şıklığı',
      imageUrl: '/resimler/5.jpeg',
      ownerName: 'Elif Demir',
      ownerId: '675c8b5e123456789012a569',
      tags: ['elegant', 'iş'],
      likedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 gün önce
    },
    {
      _id: 'demo-outfit-3',
      title: 'Zarif Kombin',
      imageUrl: '/resimler/3.jpeg',
      ownerName: 'Zeynep Kaya',
      ownerId: '675c8b5e123456789012a570',
      tags: ['elegant', 'zarif'],
      likedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 saat önce
    }
  ];

  return demoFavorites;
};

// Kullanıcının favori kombinlerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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
      const likesCollection = db.collection('likes');

      // Kullanıcının beğendiği kombinleri getir
      const likedOutfits = await likesCollection.aggregate([
        {
          $match: {
            userId: userObjectId
          }
        },
        {
          $lookup: {
            from: 'outfits',
            localField: 'outfitId',
            foreignField: '_id',
            as: 'outfit'
          }
        },
        {
          $unwind: '$outfit'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'outfit.userId',
            foreignField: '_id',
            as: 'owner'
          }
        },
        {
          $unwind: '$owner'
        },
        {
          $project: {
            _id: '$outfit._id',
            title: '$outfit.title',
            imageUrl: '$outfit.imageUrl',
            tags: '$outfit.tags',
            ownerName: '$owner.name',
            ownerId: '$owner._id',
            likedAt: '$createdAt'
          }
        },
        {
          $sort: {
            likedAt: -1 // En son beğenilenler başta
          }
        }
      ]).toArray();

      // Eğer gerçek favoriler yoksa demo favoriler döndür
      if (likedOutfits.length === 0) {
        const demoFavorites = getDemoFavorites(userId);
        
        return NextResponse.json({
          success: true,
          favorites: demoFavorites,
          count: demoFavorites.length,
          isDemo: true
        });
      }

      return NextResponse.json({
        success: true,
        favorites: likedOutfits,
        count: likedOutfits.length,
        isDemo: false
      });

    } catch (dbError) {
      // MongoDB hatası durumunda demo data döndür
      console.log('MongoDB error, returning demo favorites:', dbError);
      const demoFavorites = getDemoFavorites(userId);
      
      return NextResponse.json({
        success: true,
        favorites: demoFavorites,
        count: demoFavorites.length,
        isDemo: true
      });
    }

  } catch (error) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// Favorilerden çıkarma (beğeniyi kaldırma)
export async function DELETE(request: NextRequest) {
  try {
    const { userId, outfitId } = await request.json();

    if (!userId || !outfitId) {
      return NextResponse.json(
        { error: 'userId ve outfitId parametreleri gerekli' },
        { status: 400 }
      );
    }

    // ObjectId dönüşümleri
    let userObjectId: ObjectId;
    let outfitObjectId: ObjectId;

    try {
      userObjectId = new ObjectId(userId);
      // Eğer outfitId string ise (demo data) ObjectId'ye çevirme
      if (outfitId.length === 24 && /^[a-fA-F0-9]+$/.test(outfitId)) {
        outfitObjectId = new ObjectId(outfitId);
      } else {
        // Demo outfit ID'ler için - gerçek ObjectId değil
        return NextResponse.json({
          success: true,
          message: 'Demo favori kaldırıldı',
          action: 'removed_demo'
        });
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz ID formatı' },
        { status: 400 }
      );
    }

    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      const likesCollection = db.collection('likes');

      // Beğeniyi sil (favorilerden çıkar)
      const result = await likesCollection.deleteOne({
        userId: userObjectId,
        outfitId: outfitObjectId
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Bu kombin favorilerde değil' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Favorilerden kaldırıldı',
        action: 'removed'
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Veritabanı hatası' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 