import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  let client;
  try {
    const { measurements, avatar } = await request.json();
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB bağlantı bilgisi eksik');
    }

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
      avatarId: result.insertedId
    });

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