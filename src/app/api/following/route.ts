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

// Kullanıcının takip ettiği kişileri getir
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

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const followsCollection = db.collection('follows');
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

    // Kullanıcının takip ettiği kişileri getir
    const followingList = await followsCollection.aggregate([
      {
        $match: {
          followerId: userObjectId
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'followingId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: '$userDetails._id',
          name: '$userDetails.name',
          username: '$userDetails.username',
          email: '$userDetails.email',
          followersCount: '$userDetails.followersCount',
          followingCount: '$userDetails.followingCount',
          followedAt: '$createdAt'
        }
      },
      {
        $sort: {
          followedAt: -1 // En son takip edilenler başta
        }
      }
    ]).toArray();

    return NextResponse.json({
      success: true,
      following: followingList,
      count: followingList.length
    });

  } catch (error) {
    console.error('Following list error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 