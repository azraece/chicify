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

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId, action } = await request.json();

    // Parametreleri kontrol et
    if (!followerId || !followingId || !action) {
      return NextResponse.json(
        { error: 'followerId, followingId ve action parametreleri gerekli' },
        { status: 400 }
      );
    }

    // Kendi kendini takip etme kontrolü
    if (followerId === followingId) {
      return NextResponse.json(
        { error: 'Kullanıcı kendi kendini takip edemez' },
        { status: 400 }
      );
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const followsCollection = db.collection('follows');
    const usersCollection = db.collection('users');

    // ObjectId dönüşümleri
    let followerObjectId: ObjectId;
    let followingObjectId: ObjectId;

    try {
      followerObjectId = new ObjectId(followerId);
      followingObjectId = new ObjectId(followingId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı ID formatı' },
        { status: 400 }
      );
    }

    // Kullanıcıların varlığını kontrol et
    const [followerUser, followingUser] = await Promise.all([
      usersCollection.findOne({ _id: followerObjectId }),
      usersCollection.findOne({ _id: followingObjectId })
    ]);

    if (!followerUser || !followingUser) {
      return NextResponse.json(
        { error: 'Kullanıcılardan biri bulunamadı' },
        { status: 404 }
      );
    }

    if (action === 'follow') {
      // Mevcut takip ilişkisini kontrol et
      const existingFollow = await followsCollection.findOne({
        followerId: followerObjectId,
        followingId: followingObjectId
      });

      if (existingFollow) {
        return NextResponse.json(
          { error: 'Bu kullanıcı zaten takip ediliyor' },
          { status: 409 }
        );
      }

      try {
        // 1. follows koleksiyonuna yeni ilişki ekle
        await followsCollection.insertOne({
          followerId: followerObjectId,
          followingId: followingObjectId,
          createdAt: new Date()
        });

        // 2. Follower'ın following sayısını arttır
        await usersCollection.updateOne(
          { _id: followerObjectId },
          { $inc: { followingCount: 1 } }
        );

        // 3. Following'in followers sayısını arttır
        await usersCollection.updateOne(
          { _id: followingObjectId },
          { $inc: { followersCount: 1 } }
        );

        return NextResponse.json({
          success: true,
          message: 'Kullanıcı başarıyla takip edildi',
          action: 'followed'
        });

      } catch (error) {
        console.error('Follow error:', error);
        // Rollback: Eğer bir hata olursa eklenen follow ilişkisini sil
        await followsCollection.deleteOne({
          followerId: followerObjectId,
          followingId: followingObjectId
        });
        return NextResponse.json(
          { error: 'Takip işlemi sırasında hata oluştu' },
          { status: 500 }
        );
      }

    } else if (action === 'unfollow') {
      // Mevcut takip ilişkisini kontrol et
      const existingFollow = await followsCollection.findOne({
        followerId: followerObjectId,
        followingId: followingObjectId
      });

      if (!existingFollow) {
        return NextResponse.json(
          { error: 'Bu kullanıcı zaten takip edilmiyor' },
          { status: 409 }
        );
      }

      try {
        // 1. follows koleksiyonundan ilişkiyi sil
        await followsCollection.deleteOne({
          followerId: followerObjectId,
          followingId: followingObjectId
        });

        // 2. Follower'ın following sayısını azalt
        await usersCollection.updateOne(
          { _id: followerObjectId },
          { $inc: { followingCount: -1 } }
        );

        // 3. Following'in followers sayısını azalt
        await usersCollection.updateOne(
          { _id: followingObjectId },
          { $inc: { followersCount: -1 } }
        );

        return NextResponse.json({
          success: true,
          message: 'Kullanıcı takibi bırakıldı',
          action: 'unfollowed'
        });

      } catch (error) {
        console.error('Unfollow error:', error);
        return NextResponse.json(
          { error: 'Takibi bırakma işlemi sırasında hata oluştu' },
          { status: 500 }
        );
      }

    } else {
      return NextResponse.json(
        { error: 'Geçersiz aksiyon. "follow" veya "unfollow" olmalı' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Follow API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// Takip durumunu kontrol etmek için GET endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('followerId');
    const followingId = searchParams.get('followingId');

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'followerId ve followingId parametreleri gerekli' },
        { status: 400 }
      );
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const followsCollection = db.collection('follows');

    // ObjectId dönüşümleri
    let followerObjectId: ObjectId;
    let followingObjectId: ObjectId;

    try {
      followerObjectId = new ObjectId(followerId);
      followingObjectId = new ObjectId(followingId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı ID formatı' },
        { status: 400 }
      );
    }

    // Takip durumunu kontrol et
    const followRelation = await followsCollection.findOne({
      followerId: followerObjectId,
      followingId: followingObjectId
    });

    return NextResponse.json({
      isFollowing: !!followRelation,
      followedAt: followRelation?.createdAt || null
    });

  } catch (error) {
    console.error('Follow check error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 