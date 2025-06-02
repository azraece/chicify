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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const usersCollection = db.collection('users');

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

    // Kullanıcıyı bul
    const user = await usersCollection.findOne(
      { _id: userObjectId },
      { 
        projection: { 
          name: 1, 
          username: 1, 
          followersCount: 1, 
          followingCount: 1,
          profileImage: 1,
          createdAt: 1
        } 
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        profileImage: user.profileImage || null,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 