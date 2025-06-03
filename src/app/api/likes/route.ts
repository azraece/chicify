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

// Beğeni durumunu kontrol et
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const outfitId = searchParams.get('outfitId');

    if (!userId || !outfitId) {
      return NextResponse.json(
        { error: 'userId ve outfitId parametreleri gerekli' },
        { status: 400 }
      );
    }

    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      const likesCollection = db.collection('likes');

      // ObjectId dönüşümleri
      let userObjectId: ObjectId;
      let outfitObjectId: ObjectId;

      try {
        userObjectId = new ObjectId(userId);
        outfitObjectId = new ObjectId(outfitId);
      } catch (error) {
        return NextResponse.json(
          { error: 'Geçersiz ID formatı' },
          { status: 400 }
        );
      }

      // Beğeni durumunu kontrol et
      const like = await likesCollection.findOne({
        userId: userObjectId,
        outfitId: outfitObjectId
      });

      return NextResponse.json({
        success: true,
        isLiked: !!like,
        likedAt: like?.createdAt || null
      });

    } catch (dbError) {
      // MongoDB hatası durumunda false döndür
      return NextResponse.json({
        success: true,
        isLiked: false,
        likedAt: null
      });
    }

  } catch (error) {
    console.error('Like check error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// Beğeni ekleme/çıkarma
export async function POST(request: NextRequest) {
  try {
    const { userId, outfitId, action } = await request.json();

    if (!userId || !outfitId || !action) {
      return NextResponse.json(
        { error: 'userId, outfitId ve action parametreleri gerekli' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'unlike') {
      return NextResponse.json(
        { error: 'action "like" veya "unlike" olmalı' },
        { status: 400 }
      );
    }

    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      const likesCollection = db.collection('likes');

      // ObjectId dönüşümleri
      let userObjectId: ObjectId;
      let outfitObjectId: ObjectId;

      try {
        userObjectId = new ObjectId(userId);
        outfitObjectId = new ObjectId(outfitId);
      } catch (error) {
        return NextResponse.json(
          { error: 'Geçersiz ID formatı' },
          { status: 400 }
        );
      }

      if (action === 'like') {
        // Mevcut beğeniyi kontrol et
        const existingLike = await likesCollection.findOne({
          userId: userObjectId,
          outfitId: outfitObjectId
        });

        if (existingLike) {
          return NextResponse.json(
            { error: 'Bu kombin zaten beğenilmiş' },
            { status: 409 }
          );
        }

        // Yeni beğeni ekle
        await likesCollection.insertOne({
          userId: userObjectId,
          outfitId: outfitObjectId,
          createdAt: new Date()
        });

        return NextResponse.json({
          success: true,
          message: 'Kombin beğenildi',
          action: 'liked'
        });

      } else { // unlike
        // Beğeniyi sil
        const result = await likesCollection.deleteOne({
          userId: userObjectId,
          outfitId: outfitObjectId
        });

        if (result.deletedCount === 0) {
          return NextResponse.json(
            { error: 'Bu kombin beğenilmemiş' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Beğeni kaldırıldı',
          action: 'unliked'
        });
      }

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Veritabanı hatası' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Like action error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 